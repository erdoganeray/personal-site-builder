import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

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

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Only JPEG, PNG, and WebP images are allowed" },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File size must be less than 5MB" },
        { status: 400 }
      );
    }

    // Generate unique filename with timestamp
    const fileExt = file.name.split(".").pop() || "jpg";
    const timestamp = Date.now();
    const fileName = `profile-photo-${timestamp}.${fileExt}`;

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Upload to R2 - users/[userId]/profile/ folder
    await s3Client.send(
      new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME!,
        Key: `users/${session.user.id}/profile/${fileName}`,
        Body: buffer,
        ContentType: file.type,
        CacheControl: "public, max-age=31536000", // Cache for 1 year
      })
    );

    // Return R2 public URL for dashboard/preview use
    // Template engine will convert this to relative path for published sites
    const fileUrl = `${process.env.R2_PUBLIC_URL}/users/${session.user.id}/profile/${fileName}`;

    console.log("Profile photo uploaded to R2:", fileUrl);

    return NextResponse.json({
      success: true,
      url: fileUrl,
    });
  } catch (error) {
    console.error("Profile photo upload error:", error);
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
    const photoUrl = searchParams.get("url");

    if (!photoUrl) {
      return NextResponse.json(
        { error: "No photo URL provided" },
        { status: 400 }
      );
    }

    // Extract the key from the URL
    // Support both old R2 URL format and new relative path format
    let key: string;
    if (photoUrl.startsWith('/_assets/profile/')) {
      // New format: /_assets/profile/profile-photo-xxx.jpg
      const fileName = photoUrl.replace('/_assets/profile/', '');
      key = `users/${session.user.id}/profile/${fileName}`;
    } else {
      // Old format: https://pub-xxx.r2.dev/users/{userId}/profile/profile-photo-xxx.jpg
      const urlParts = photoUrl.split("/");
      const keyParts = urlParts.slice(urlParts.indexOf("users"));
      key = keyParts.join("/");
    }

    // Verify the key belongs to the current user
    if (!key.startsWith(`users/${session.user.id}/profile/`)) {
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

    console.log("Profile photo deleted from R2:", key);

    return NextResponse.json({
      success: true,
      message: "Photo deleted successfully",
    });
  } catch (error) {
    console.error("Profile photo delete error:", error);
    return NextResponse.json(
      { error: "Delete failed" },
      { status: 500 }
    );
  }
}
