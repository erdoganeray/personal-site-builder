import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";
import { recalculateUserStorage } from "@/lib/storage-calculator";

const s3Client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

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

    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Only PDF files are allowed" },
        { status: 400 }
      );
    }

    if (file.size > 4 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size must be less than 4MB" },
        { status: 400 }
      );
    }

    // Dosya adını temizle ve UUID ekle
    const fileExt = file.name.split(".").pop();
    const fileName = `cv-${randomUUID()}.${fileExt}`;

    // Dosyayı buffer'a çevir
    const buffer = Buffer.from(await file.arrayBuffer());

    // R2'ye yükle - users/[userId]/cv/ klasörüne
    await s3Client.send(
      new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME!,
        Key: `users/${session.user.id}/cv/${fileName}`,
        Body: buffer,
        ContentType: file.type,
      })
    );

    const fileUrl = `${process.env.R2_PUBLIC_URL}/users/${session.user.id}/cv/${fileName}`;

    console.log("File uploaded to R2:", fileUrl);

    // Recalculate user's storage after upload
    try {
      await recalculateUserStorage(session.user.id);
    } catch (storageError) {
      console.error("Failed to recalculate storage:", storageError);
      // Don't fail the request if storage calculation fails
    }

    return NextResponse.json({
      success: true,
      url: fileUrl,
    });
  } catch (error) {
    console.error("Upload error:", error);
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
    const cvUrl = searchParams.get("url");

    if (!cvUrl) {
      return NextResponse.json(
        { error: "No CV URL provided" },
        { status: 400 }
      );
    }

    // Extract the key from the URL
    // URL format: https://pub-xxx.r2.dev/users/{userId}/cv/cv-xxx.pdf
    const urlParts = cvUrl.split("/");
    const keyParts = urlParts.slice(urlParts.indexOf("users"));
    const key = keyParts.join("/");

    // Verify the key belongs to the current user
    if (!key.startsWith(`users/${session.user.id}/cv/`)) {
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

    console.log("CV deleted from R2:", key);

    // Recalculate user's storage after deletion
    try {
      await recalculateUserStorage(session.user.id);
    } catch (storageError) {
      console.error("Failed to recalculate storage:", storageError);
      // Don't fail the request if storage calculation fails
    }

    return NextResponse.json({
      success: true,
      message: "CV deleted successfully",
    });
  } catch (error) {
    console.error("CV delete error:", error);
    return NextResponse.json(
      { error: "Delete failed" },
      { status: 500 }
    );
  }
}
