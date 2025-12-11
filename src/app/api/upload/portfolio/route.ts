import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { S3Client, PutObjectCommand, DeleteObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_PORTFOLIO_IMAGES = 10; // Increased from 5 to 10 for MVP

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check current portfolio image count
    const listResult = await s3Client.send(
      new ListObjectsV2Command({
        Bucket: process.env.R2_BUCKET_NAME!,
        Prefix: `users/${session.user.id}/portfolio/`,
      })
    );

    const currentCount = listResult.Contents?.length || 0;

    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    // Support both single file ("file") and multiple files ("files")
    if (files.length === 0) {
      const singleFile = formData.get("file") as File;
      if (singleFile) {
        files.push(singleFile);
      }
    }

    if (files.length === 0) {
      return NextResponse.json(
        { error: "No files provided" },
        { status: 400 }
      );
    }

    // Check if adding these files would exceed the limit
    if (currentCount + files.length > MAX_PORTFOLIO_IMAGES) {
      return NextResponse.json(
        {
          error: `Maximum ${MAX_PORTFOLIO_IMAGES} portfolio images allowed. You currently have ${currentCount} images. You can upload ${MAX_PORTFOLIO_IMAGES - currentCount} more.`
        },
        { status: 400 }
      );
    }

    // Process each file
    const uploadResults = [];
    const errors = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      try {
        // Validate file type
        if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
          errors.push({
            fileName: file.name,
            error: "Only JPEG, PNG, and WebP images are allowed"
          });
          continue;
        }

        // Validate file size
        if (file.size > MAX_FILE_SIZE) {
          errors.push({
            fileName: file.name,
            error: "File size must be less than 5MB"
          });
          continue;
        }

        // Generate unique filename with timestamp and index
        const fileExt = file.name.split(".").pop() || "jpg";
        const timestamp = Date.now();
        const fileName = `portfolio-${timestamp}-${i}.${fileExt}`;

        // Convert file to buffer
        const buffer = Buffer.from(await file.arrayBuffer());

        // Upload to R2
        await s3Client.send(
          new PutObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME!,
            Key: `users/${session.user.id}/portfolio/${fileName}`,
            Body: buffer,
            ContentType: file.type,
            CacheControl: "public, max-age=31536000", // Cache for 1 year
          })
        );

        // Return R2 public URL
        const fileUrl = `${process.env.R2_PUBLIC_URL}/users/${session.user.id}/portfolio/${fileName}`;

        uploadResults.push({
          success: true,
          url: fileUrl,
          fileName: file.name,
          originalIndex: i
        });

        console.log(`Portfolio image uploaded to R2: ${fileUrl}`);
      } catch (error) {
        console.error(`Error uploading file ${file.name}:`, error);
        errors.push({
          fileName: file.name,
          error: "Upload failed"
        });
      }
    }

    // Return results
    if (uploadResults.length === 0) {
      return NextResponse.json(
        {
          error: "All uploads failed",
          errors
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      uploads: uploadResults,
      errors: errors.length > 0 ? errors : undefined,
      message: `Successfully uploaded ${uploadResults.length} of ${files.length} files`
    });
  } catch (error) {
    console.error("Portfolio image upload error:", error);
    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const imageUrl = searchParams.get("url");

    if (!imageUrl) {
      return NextResponse.json(
        { error: "No image URL provided" },
        { status: 400 }
      );
    }

    // Extract the key from the URL
    // Support both old R2 URL format and new relative path format
    let key: string;
    if (imageUrl.startsWith('/_assets/portfolio/')) {
      // New format: /_assets/portfolio/portfolio-xxx.jpg
      const fileName = imageUrl.replace('/_assets/portfolio/', '');
      key = `users/${session.user.id}/portfolio/${fileName}`;
    } else {
      // Old format: https://pub-xxx.r2.dev/users/{userId}/portfolio/portfolio-xxx.jpg
      const urlParts = imageUrl.split("/");
      const keyParts = urlParts.slice(urlParts.indexOf("users"));
      key = keyParts.join("/");
    }

    // Verify the key belongs to the current user
    if (!key.startsWith(`users/${session.user.id}/portfolio/`)) {
      return NextResponse.json(
        { error: "Unauthorized to delete this file" },
        { status: 403 }
      );
    }

    // Delete from R2
    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME!,
        Key: key,
      })
    );

    console.log("Portfolio image deleted from R2:", key);

    return NextResponse.json({
      success: true,
      message: "Image deleted successfully",
    });
  } catch (error) {
    console.error("Portfolio image delete error:", error);
    return NextResponse.json(
      { error: "Delete failed" },
      { status: 500 }
    );
  }
}
