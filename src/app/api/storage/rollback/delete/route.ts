import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { S3Client, DeleteObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
    region: "auto",
    endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
});

const BUCKET_NAME = process.env.R2_BUCKET_NAME!;

async function getFileSize(key: string): Promise<number> {
    try {
        const command = new HeadObjectCommand({
            Bucket: BUCKET_NAME,
            Key: key,
        });
        const response = await s3Client.send(command);
        return response.ContentLength || 0;
    } catch (error) {
        console.error(`Error getting file size for ${key}:`, error);
        return 0;
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = session.user.id;
        const { assetId } = await req.json();

        if (!assetId) {
            return NextResponse.json({ error: "Asset ID is required" }, { status: 400 });
        }

        // Fetch the asset and verify ownership
        const asset = await prisma.deletedAsset.findUnique({
            where: { id: assetId },
            select: {
                userId: true,
                assetKey: true,
            },
        });

        if (!asset) {
            return NextResponse.json({ error: "Asset not found" }, { status: 404 });
        }

        if (asset.userId !== userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        // Check if asset is in published content (deletion protection)
        const site = await prisma.site.findFirst({
            where: { userId: userId },
            select: {
                publishedCvContent: true,
            },
        });

        if (site?.publishedCvContent) {
            // Check if this asset is referenced in published content
            const publishedCvContent = site.publishedCvContent as any;
            const publishedAssets: string[] = [];

            // Extract profile photo
            const profilePhotoUrl = publishedCvContent.personalInfo?.profilePhotoUrl;
            if (profilePhotoUrl) {
                // Normalize to R2 key format
                let key: string;
                if (profilePhotoUrl.startsWith('/_assets/profile/')) {
                    const fileName = profilePhotoUrl.replace('/_assets/profile/', '');
                    key = `users/${userId}/profile/${fileName}`;
                } else if (profilePhotoUrl.includes('/users/')) {
                    const urlParts = profilePhotoUrl.split("/");
                    const keyParts = urlParts.slice(urlParts.indexOf("users"));
                    key = keyParts.join("/");
                } else {
                    key = profilePhotoUrl;
                }
                publishedAssets.push(key);
            }

            // Extract portfolio photos
            if (Array.isArray(publishedCvContent.portfolio)) {
                for (const item of publishedCvContent.portfolio) {
                    if (item.imageUrl) {
                        let key: string;
                        if (item.imageUrl.startsWith('/_assets/portfolio/')) {
                            const fileName = item.imageUrl.replace('/_assets/portfolio/', '');
                            key = `users/${userId}/portfolio/${fileName}`;
                        } else if (item.imageUrl.includes('/users/')) {
                            const urlParts = item.imageUrl.split("/");
                            const keyParts = urlParts.slice(urlParts.indexOf("users"));
                            key = keyParts.join("/");
                        } else {
                            key = item.imageUrl;
                        }
                        publishedAssets.push(key);
                    }
                }
            }

            // If asset is in published content, block deletion
            if (publishedAssets.includes(asset.assetKey)) {
                return NextResponse.json(
                    {
                        error: "Bu dosya yayınlanmış versiyonunuzda kullanılıyor. Önce 'Geri Dön' yapın veya yeni versiyonu yayınlayın.",
                        inPublishedContent: true,
                    },
                    { status: 409 } // Conflict
                );
            }
        }

        // Get file size before deletion
        const fileSize = await getFileSize(asset.assetKey);

        // Delete from R2
        try {
            const deleteCommand = new DeleteObjectCommand({
                Bucket: BUCKET_NAME,
                Key: asset.assetKey,
            });
            await s3Client.send(deleteCommand);
            console.log(`🗑️ Deleted file from R2: ${asset.assetKey}`);
        } catch (error) {
            console.error(`Error deleting file from R2: ${asset.assetKey}`, error);
            // Continue with database deletion even if R2 deletion fails
        }

        // Delete from database
        await prisma.deletedAsset.delete({
            where: { id: assetId },
        });

        // Update user's storage usage
        if (fileSize > 0) {
            await prisma.user.update({
                where: { id: userId },
                data: {
                    storageUsed: {
                        decrement: fileSize,
                    },
                },
            });
            console.log(`📊 Updated storage usage: -${fileSize} bytes`);
        }

        return NextResponse.json({
            success: true,
            message: "File deleted successfully",
            freedSpace: fileSize,
        });
    } catch (error) {
        console.error("Rollback delete error:", error);
        return NextResponse.json(
            { error: "Failed to delete rollback file" },
            { status: 500 }
        );
    }
}
