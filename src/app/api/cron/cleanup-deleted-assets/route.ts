import { NextRequest, NextResponse } from "next/server";
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
const RETENTION_DAYS = 30; // Days to keep soft-deleted assets before permanent deletion

/**
 * Cron job to permanently delete soft-deleted assets after retention period
 * Runs daily at 02:00 UTC via Vercel Cron
 * 
 * When users remove profile photos or portfolio images, they're soft-deleted
 * (moved to DeletedAsset table) for potential rollback. After 30 days,
 * this job permanently deletes them from R2 storage.
 */
export async function GET(request: NextRequest) {
    // Verify cron secret for security
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        console.log("❌ Cleanup deleted assets: Unauthorized request");
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const now = new Date();
        const cutoffDate = new Date(now.getTime() - RETENTION_DAYS * 24 * 60 * 60 * 1000);

        console.log(`🕐 Starting deleted assets cleanup at ${now.toISOString()}`);
        console.log(`📅 Cutoff date: ${cutoffDate.toISOString()} (${RETENTION_DAYS} days ago)`);

        // Find assets that were soft-deleted more than RETENTION_DAYS ago
        const expiredAssets = await prisma.deletedAsset.findMany({
            where: {
                deletedAt: {
                    lt: cutoffDate,
                },
            },
            include: {
                user: {
                    select: {
                        id: true,
                        storageUsed: true,
                    },
                },
            },
        });

        console.log(`📋 Found ${expiredAssets.length} expired deleted assets`);

        let deletedCount = 0;
        let errorCount = 0;
        let totalFreedBytes = BigInt(0);

        // Group assets by user for batch storage updates
        const userStorageUpdates: Map<string, bigint> = new Map();

        for (const asset of expiredAssets) {
            try {
                // Get file size before deletion for storage accounting
                let fileSize = BigInt(0);
                try {
                    const headCommand = new HeadObjectCommand({
                        Bucket: BUCKET_NAME,
                        Key: asset.assetKey,
                    });
                    const headResponse = await s3Client.send(headCommand);
                    fileSize = BigInt(headResponse.ContentLength || 0);
                } catch {
                    // File might already be deleted or not exist - continue anyway
                    console.log(`⚠️ Could not get size for ${asset.assetKey} (may already be deleted)`);
                }

                // Delete from R2
                const deleteCommand = new DeleteObjectCommand({
                    Bucket: BUCKET_NAME,
                    Key: asset.assetKey,
                });
                await s3Client.send(deleteCommand);

                // Delete the DeletedAsset record
                await prisma.deletedAsset.delete({
                    where: { id: asset.id },
                });

                // Track freed storage per user
                if (fileSize > 0) {
                    const currentTotal = userStorageUpdates.get(asset.userId) || BigInt(0);
                    userStorageUpdates.set(asset.userId, currentTotal + fileSize);
                    totalFreedBytes += fileSize;
                }

                console.log(`✅ Permanently deleted: ${asset.assetKey} (${fileSize} bytes)`);
                deletedCount++;
            } catch (error) {
                console.error(`❌ Error deleting asset ${asset.assetKey}:`, error);
                errorCount++;
            }
        }

        // Update storage usage for each affected user
        for (const [userId, freedBytes] of userStorageUpdates) {
            try {
                await prisma.user.update({
                    where: { id: userId },
                    data: {
                        storageUsed: {
                            decrement: freedBytes,
                        },
                    },
                });
                console.log(`📊 Updated storage for user ${userId}: freed ${freedBytes} bytes`);
            } catch (error) {
                console.error(`❌ Error updating storage for user ${userId}:`, error);
            }
        }

        const summary = {
            success: true,
            timestamp: now.toISOString(),
            retentionDays: RETENTION_DAYS,
            found: expiredAssets.length,
            deleted: deletedCount,
            errors: errorCount,
            freedBytes: totalFreedBytes.toString(),
            usersUpdated: userStorageUpdates.size,
        };

        console.log(`✅ Deleted assets cleanup completed:`, summary);

        return NextResponse.json(summary);
    } catch (error) {
        console.error("❌ Deleted assets cleanup failed:", error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : "Cleanup failed"
            },
            { status: 500 }
        );
    }
}
