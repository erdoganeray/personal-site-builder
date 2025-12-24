import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { deleteKVMapping } from "@/lib/cloudflare-deploy";
import { S3Client, DeleteObjectCommand, HeadObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
    region: "auto",
    endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
});

const BUCKET_NAME = process.env.R2_BUCKET_NAME!;
const DELETED_ASSETS_RETENTION_DAYS = 30;
const ANONYMOUS_SESSION_RETENTION_DAYS = 7;

/**
 * Unified Cron Job: Runs all cleanup tasks
 * Runs daily at 02:00 UTC via Vercel Cron
 * 
 * Tasks:
 * 1. Subdomain reservation cleanup (expired reservations)
 * 2. Soft-deleted assets cleanup (30+ days old)
 * 3. Anonymous session cleanup (7+ days old)
 */
export async function GET(request: NextRequest) {
    // Verify cron secret for security
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        console.log("❌ Cleanup: Unauthorized request");
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const now = new Date();
    console.log(`🕐 Starting unified cleanup at ${now.toISOString()}`);

    const results = {
        timestamp: now.toISOString(),
        subdomainCleanup: { success: false, cleaned: 0, errors: 0 },
        deletedAssetsCleanup: { success: false, deleted: 0, freedBytes: "0", errors: 0 },
        anonymousSessionCleanup: { success: false, deletedUsers: 0, deletedFiles: 0, errors: 0 },
    };

    // =====================
    // 1. SUBDOMAIN CLEANUP
    // =====================
    try {
        console.log("📌 Task 1: Subdomain reservation cleanup");

        const expiredSites = await prisma.site.findMany({
            where: {
                subdomainReservationExpiresAt: { lt: now },
                subdomain: { not: null },
                status: { not: "published" },
            },
            select: { id: true, subdomain: true },
        });

        let cleaned = 0;
        let errors = 0;

        for (const site of expiredSites) {
            try {
                if (site.subdomain) await deleteKVMapping(site.subdomain);
                await prisma.site.update({
                    where: { id: site.id },
                    data: { subdomain: null, subdomainReservationExpiresAt: null },
                });
                console.log(`✅ Cleared subdomain: ${site.subdomain}`);
                cleaned++;
            } catch (error) {
                console.error(`❌ Error clearing subdomain for site ${site.id}:`, error);
                errors++;
            }
        }

        results.subdomainCleanup = { success: true, cleaned, errors };
    } catch (error) {
        console.error("❌ Subdomain cleanup failed:", error);
        results.subdomainCleanup.errors = 1;
    }

    // =====================
    // 2. DELETED ASSETS CLEANUP
    // =====================
    try {
        console.log("📌 Task 2: Deleted assets cleanup");

        const cutoffDate = new Date(now.getTime() - DELETED_ASSETS_RETENTION_DAYS * 24 * 60 * 60 * 1000);

        const expiredAssets = await prisma.deletedAsset.findMany({
            where: { deletedAt: { lt: cutoffDate } },
            include: { user: { select: { id: true } } },
        });

        let deleted = 0;
        let errors = 0;
        let totalFreedBytes = BigInt(0);
        const userStorageUpdates: Map<string, bigint> = new Map();

        for (const asset of expiredAssets) {
            try {
                let fileSize = BigInt(0);
                try {
                    const headResponse = await s3Client.send(new HeadObjectCommand({ Bucket: BUCKET_NAME, Key: asset.assetKey }));
                    fileSize = BigInt(headResponse.ContentLength || 0);
                } catch { /* File may not exist */ }

                await s3Client.send(new DeleteObjectCommand({ Bucket: BUCKET_NAME, Key: asset.assetKey }));
                await prisma.deletedAsset.delete({ where: { id: asset.id } });

                if (fileSize > 0) {
                    const current = userStorageUpdates.get(asset.userId) || BigInt(0);
                    userStorageUpdates.set(asset.userId, current + fileSize);
                    totalFreedBytes += fileSize;
                }

                console.log(`✅ Deleted asset: ${asset.assetKey}`);
                deleted++;
            } catch (error) {
                console.error(`❌ Error deleting asset ${asset.assetKey}:`, error);
                errors++;
            }
        }

        // Update storage for affected users
        for (const [userId, freedBytes] of userStorageUpdates) {
            try {
                await prisma.user.update({
                    where: { id: userId },
                    data: { storageUsed: { decrement: freedBytes } },
                });
            } catch { /* User may have been deleted */ }
        }

        results.deletedAssetsCleanup = { success: true, deleted, freedBytes: totalFreedBytes.toString(), errors };
    } catch (error) {
        console.error("❌ Deleted assets cleanup failed:", error);
        results.deletedAssetsCleanup.errors = 1;
    }

    // =====================
    // 3. ANONYMOUS SESSION CLEANUP
    // =====================
    try {
        console.log("📌 Task 3: Anonymous session cleanup");

        const cutoffDate = new Date(now.getTime() - ANONYMOUS_SESSION_RETENTION_DAYS * 24 * 60 * 60 * 1000);

        const expiredUsers = await prisma.user.findMany({
            where: { isAnonymous: true, createdAt: { lt: cutoffDate } },
            include: { sites: { select: { id: true } } },
        });

        let deletedUsers = 0;
        let deletedFiles = 0;
        let errors = 0;

        for (const user of expiredUsers) {
            try {
                // Delete all R2 files for this user
                const userPrefix = `users/${user.id}/`;
                try {
                    const listResponse = await s3Client.send(new ListObjectsV2Command({ Bucket: BUCKET_NAME, Prefix: userPrefix }));
                    if (listResponse.Contents) {
                        for (const object of listResponse.Contents) {
                            if (object.Key) {
                                await s3Client.send(new DeleteObjectCommand({ Bucket: BUCKET_NAME, Key: object.Key }));
                                deletedFiles++;
                            }
                        }
                    }
                } catch { /* R2 cleanup may fail, continue */ }

                // Delete user (cascades to Sites and DeletedAssets)
                await prisma.user.delete({ where: { id: user.id } });
                console.log(`✅ Deleted anonymous user: ${user.id}`);
                deletedUsers++;
            } catch (error) {
                console.error(`❌ Error deleting user ${user.id}:`, error);
                errors++;
            }
        }

        results.anonymousSessionCleanup = { success: true, deletedUsers, deletedFiles, errors };
    } catch (error) {
        console.error("❌ Anonymous session cleanup failed:", error);
        results.anonymousSessionCleanup.errors = 1;
    }

    console.log("✅ Unified cleanup completed:", results);
    return NextResponse.json({ success: true, ...results });
}
