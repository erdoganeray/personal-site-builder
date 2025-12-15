import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { S3Client, PutObjectCommand, DeleteObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { recalculateUserStorage } from "@/lib/storage-calculator";

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

    const allFilesInR2 = listResult.Contents || [];

    // Get soft-deleted assets from database
    const { prisma } = await import("@/lib/prisma");
    const deletedAssets = await prisma.deletedAsset.findMany({
      where: {
        userId: session.user.id,
        assetType: "portfolio",
      },
      select: {
        assetKey: true,
      },
    });

    // Create a set of deleted asset keys for fast lookup
    const deletedKeys = new Set(deletedAssets.map(asset => asset.assetKey));

    // Count only active files (exclude soft-deleted ones)
    const activeFiles = allFilesInR2.filter(file => !deletedKeys.has(file.Key || ""));
    const currentCount = activeFiles.length;

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

    // Recalculate user's storage after upload
    try {
      await recalculateUserStorage(session.user.id);
    } catch (storageError) {
      console.error("Failed to recalculate storage:", storageError);
      // Don't fail the request if storage calculation fails
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

    const { prisma } = await import("@/lib/prisma");

    // Check if site is published
    const site = await prisma.site.findFirst({
      where: { userId: session.user.id },
      select: { status: true },
    });

    // If site is NOT published, delete directly from R2 (no need for rollback)
    // If site IS published, use soft delete to allow rollback
    if (site?.status !== "published") {
      // HARD DELETE: Site is not published, so delete immediately from R2
      await s3Client.send(
        new DeleteObjectCommand({
          Bucket: process.env.R2_BUCKET_NAME!,
          Key: key,
        })
      );

      console.log("Portfolio image deleted permanently (site not published):", key);

      // Recalculate user's storage after deletion
      try {
        await recalculateUserStorage(session.user.id);
      } catch (storageError) {
        console.error("Failed to recalculate storage:", storageError);
      }

      return NextResponse.json({
        success: true,
        message: "Image deleted permanently",
      });
    } else {
      // SOFT DELETE: Site is published, mark for deletion to allow rollback
      await prisma.deletedAsset.create({
        data: {
          userId: session.user.id,
          assetKey: key,
          assetType: "portfolio",
        },
      });

      console.log("Portfolio image marked for deletion (soft delete - site published):", key);

      // Recalculate user's storage after marking deletion
      try {
        await recalculateUserStorage(session.user.id);
      } catch (storageError) {
        console.error("Failed to recalculate storage:", storageError);
      }

      return NextResponse.json({
        success: true,
        message: "Image marked for deletion successfully",
      });
    }
  } catch (error) {
    console.error("Portfolio image delete error:", error);
    return NextResponse.json(
      { error: "Delete failed" },
      { status: 500 }
    );
  }
}
