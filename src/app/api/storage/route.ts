import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { S3Client, HeadObjectCommand } from "@aws-sdk/client-s3";
import { extractAssetKeys } from "@/lib/asset-cleanup-utils";

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
    } catch (error: any) {
        if (error.name === 'NotFound' || error.$metadata?.httpStatusCode === 404) {
            return 0;
        }
        console.error(`Error getting file size for ${key}:`, error);
        return 0;
    }
}

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const userId = session.user.id;

        // Get user's storage limit
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                storageLimit: true,
            },
        });

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        // Calculate real-time storage from R2 (same logic as breakdown)
        const site = await prisma.site.findFirst({
            where: { userId },
            select: {
                id: true,
                cvUrl: true,
                cvContent: true,
            },
        });

        const deletedAssets = await prisma.deletedAsset.findMany({
            where: { userId },
            select: {
                assetKey: true,
            },
        });

        let totalStorage = 0;

        // Calculate User Info Content Storage
        // CV file
        if (site?.cvUrl) {
            const urlParts = site.cvUrl.split('/');
            let cvKey: string;

            if (site.cvUrl.includes('/users/')) {
                const keyParts = urlParts.slice(urlParts.indexOf('users'));
                cvKey = keyParts.join('/');
            } else {
                const keyParts = urlParts.slice(-3);
                cvKey = `users/${keyParts.join('/')}`;
            }

            totalStorage += await getFileSize(cvKey);
        }

        // Profile photo and portfolio photos
        if (site?.cvContent) {
            const assetKeys = extractAssetKeys(site.cvContent as any, userId);
            for (const key of assetKeys) {
                totalStorage += await getFileSize(key);
            }
        }

        // Published site files
        if (site?.id) {
            const publishedFilePaths = [
                `users/${userId}/site/${site.id}/index.html`,
                `users/${userId}/site/${site.id}/styles.css`,
                `users/${userId}/site/${site.id}/script.js`,
            ];

            for (const key of publishedFilePaths) {
                totalStorage += await getFileSize(key);
            }
        }

        // Rollback files (deleted assets)
        for (const asset of deletedAssets) {
            totalStorage += await getFileSize(asset.assetKey);
        }

        const storageLimit = Number(user.storageLimit);
        const usagePercentage = storageLimit > 0
            ? Math.round((totalStorage / storageLimit) * 100)
            : 0;

        return NextResponse.json({
            storageUsed: totalStorage,
            storageLimit,
            usagePercentage,
            storageUsedFormatted: formatBytes(totalStorage),
            storageLimitFormatted: formatBytes(storageLimit),
        });
    } catch (error) {
        console.error("Storage info error:", error);
        return NextResponse.json(
            { error: "Failed to get storage info" },
            { status: 500 }
        );
    }
}

function formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}
