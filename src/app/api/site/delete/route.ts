import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { S3Client, DeleteObjectCommand, ListObjectsV2Command, ListObjectsV2CommandOutput } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const siteId = searchParams.get("id");

    if (!siteId) {
      return NextResponse.json({ error: "Site ID is required" }, { status: 400 });
    }

    // Önce site'ın kullanıcıya ait olduğunu kontrol et
    const site = await prisma.site.findUnique({
      where: { id: siteId },
    });

    if (!site) {
      return NextResponse.json({ error: "Site bulunamadı" }, { status: 404 });
    }

    if (site.userId !== session.user.id) {
      return NextResponse.json({ error: "Bu siteyi silme yetkiniz yok" }, { status: 403 });
    }

    // Delete ALL user files from R2 (CV, profile photo, portfolio images)
    try {
      console.log(`🗑️ Deleting all files for user: ${session.user.id}`);

      let deletedCount = 0;
      let continuationToken: string | undefined = undefined;

      // List and delete all objects under users/{userId}/
      do {
        const listCommand: ListObjectsV2Command = new ListObjectsV2Command({
          Bucket: process.env.R2_BUCKET_NAME!,
          Prefix: `users/${session.user.id}/`,
          ContinuationToken: continuationToken,
        });

        const listResponse: ListObjectsV2CommandOutput = await s3Client.send(listCommand);

        if (listResponse.Contents && listResponse.Contents.length > 0) {
          // Delete each file
          for (const object of listResponse.Contents) {
            if (object.Key) {
              try {
                await s3Client.send(
                  new DeleteObjectCommand({
                    Bucket: process.env.R2_BUCKET_NAME!,
                    Key: object.Key,
                  })
                );
                deletedCount++;
                console.log(`✅ Deleted: ${object.Key}`);
              } catch (deleteError) {
                console.error(`❌ Failed to delete ${object.Key}:`, deleteError);
              }
            }
          }
        }

        continuationToken = listResponse.NextContinuationToken;
      } while (continuationToken);

      console.log(`✅ Deleted ${deletedCount} files from R2 for user ${session.user.id}`);
    } catch (deleteError) {
      console.error("R2 deletion error:", deleteError);
      // Continue even if file deletion fails
    }

    // Reset user's storage to 0
    try {
      await prisma.user.update({
        where: { id: session.user.id },
        data: { storageUsed: BigInt(0) },
      });
      console.log(`✅ Reset storage to 0 for user ${session.user.id}`);
    } catch (storageError) {
      console.error("Failed to reset storage:", storageError);
    }

    // Veritabanından site'ı sil
    await prisma.site.delete({
      where: { id: siteId },
    });

    return NextResponse.json({
      success: true,
      message: "Site başarıyla silindi"
    });
  } catch (error) {
    console.error("Site silme hatası:", error);
    return NextResponse.json(
      { error: "Site silinemedi" },
      { status: 500 }
    );
  }
}
