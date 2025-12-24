import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { S3Client, DeleteObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
    region: "auto",
    endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
});

const BUCKET_NAME = process.env.R2_BUCKET_NAME!;
const RETENTION_DAYS = 7; // Days to keep anonymous sessions

/**
 * Cron job to clean up old anonymous sessions
 * Runs daily at 03:00 UTC via Vercel Cron
 * 
 * Anonymous users who haven't registered within 7 days are deleted,
 * along with their sites and uploaded assets (CV files, images).
 */
export async function GET(request: NextRequest) {
    // Verify cron secret for security
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        console.log("❌ Cleanup anonymous sessions: Unauthorized request");
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const now = new Date();
        const cutoffDate = new Date(now.getTime() - RETENTION_DAYS * 24 * 60 * 60 * 1000);

        console.log(`🕐 Starting anonymous session cleanup at ${now.toISOString()}`);
        console.log(`📅 Cutoff date: ${cutoffDate.toISOString()} (${RETENTION_DAYS} days ago)`);

        // Find anonymous users created before cutoff date
        const expiredUsers = await prisma.user.findMany({
            where: {
                isAnonymous: true,
                createdAt: {
                    lt: cutoffDate,
                },
            },
            include: {
                sites: {
                    select: {
                        id: true,
                        cvUrl: true,
                    },
                },
            },
        });

        console.log(`📋 Found ${expiredUsers.length} expired anonymous users`);

        let deletedUsersCount = 0;
        let deletedFilesCount = 0;
        let errorCount = 0;

        for (const user of expiredUsers) {
            try {
                // Delete all R2 files for this user (profile, portfolio, CV, site files)
                const userPrefix = `users/${user.id}/`;

                try {
                    // List all objects with user prefix
                    const listCommand = new ListObjectsV2Command({
                        Bucket: BUCKET_NAME,
                        Prefix: userPrefix,
                    });
                    const listResponse = await s3Client.send(listCommand);

                    if (listResponse.Contents && listResponse.Contents.length > 0) {
                        // Delete each object
                        for (const object of listResponse.Contents) {
                            if (object.Key) {
                                const deleteCommand = new DeleteObjectCommand({
                                    Bucket: BUCKET_NAME,
                                    Key: object.Key,
                                });
                                await s3Client.send(deleteCommand);
                                deletedFilesCount++;
                                console.log(`🗑️ Deleted R2 file: ${object.Key}`);
                            }
                        }
                    }
                } catch (r2Error) {
                    console.error(`⚠️ Error cleaning R2 files for user ${user.id}:`, r2Error);
                    // Continue with user deletion even if R2 cleanup fails
                }

                // Delete user (cascades to Site and DeletedAsset records)
                await prisma.user.delete({
                    where: { id: user.id },
                });

                console.log(`✅ Deleted anonymous user: ${user.id} (${user.sites.length} sites)`);
                deletedUsersCount++;
            } catch (error) {
                console.error(`❌ Error deleting user ${user.id}:`, error);
                errorCount++;
            }
        }

        const summary = {
            success: true,
            timestamp: now.toISOString(),
            retentionDays: RETENTION_DAYS,
            foundUsers: expiredUsers.length,
            deletedUsers: deletedUsersCount,
            deletedFiles: deletedFilesCount,
            errors: errorCount,
        };

        console.log(`✅ Anonymous session cleanup completed:`, summary);

        return NextResponse.json(summary);
    } catch (error) {
        console.error("❌ Anonymous session cleanup failed:", error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : "Cleanup failed"
            },
            { status: 500 }
        );
    }
}
