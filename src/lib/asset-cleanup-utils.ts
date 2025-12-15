import { S3Client, DeleteObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import { prisma } from "@/lib/prisma";

const s3Client = new S3Client({
    region: "auto",
    endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
});

const BUCKET_NAME = process.env.R2_BUCKET_NAME!;

/**
 * Normalize asset URL to R2 key format
 * Converts various URL formats to: users/{userId}/{type}/{filename}
 */
export function normalizeAssetKey(url: string, userId: string, assetType: 'profile' | 'portfolio'): string {
    // If already in R2 key format
    if (url.startsWith('users/')) {
        return url;
    }

    // If in /_assets/ format
    if (url.startsWith(`/_assets/${assetType}/`)) {
        const fileName = url.replace(`/_assets/${assetType}/`, '');
        return `users/${userId}/${assetType}/${fileName}`;
    }

    // If contains /users/ in URL
    if (url.includes('/users/')) {
        const urlParts = url.split("/");
        const keyParts = urlParts.slice(urlParts.indexOf("users"));
        return keyParts.join("/");
    }

    // Fallback: assume it's just the filename
    return `users/${userId}/${assetType}/${url}`;
}

/**
 * Extract all asset keys from CV content
 * Returns array of R2 keys for profile photo and portfolio images
 */
export function extractAssetKeys(cvContent: any, userId: string): string[] {
    const assetKeys: string[] = [];

    if (!cvContent) {
        return assetKeys;
    }

    // Extract profile photo
    const profilePhotoUrl = cvContent.personalInfo?.profilePhotoUrl;
    if (profilePhotoUrl) {
        const key = normalizeAssetKey(profilePhotoUrl, userId, 'profile');
        assetKeys.push(key);
    }

    // Extract portfolio photos
    if (Array.isArray(cvContent.portfolio)) {
        for (const item of cvContent.portfolio) {
            if (item.imageUrl) {
                const key = normalizeAssetKey(item.imageUrl, userId, 'portfolio');
                assetKeys.push(key);
            }
        }
    }

    return assetKeys;
}

/**
 * Get file size from R2
 */
async function getFileSize(key: string): Promise<number> {
    try {
        const command = new HeadObjectCommand({
            Bucket: BUCKET_NAME,
            Key: key,
        });
        const response = await s3Client.send(command);
        return response.ContentLength || 0;
    } catch (error) {
        console.error(`⚠️ Error getting file size for ${key}:`, error);
        return 0;
    }
}

/**
 * Delete a single file from R2
 */
async function deleteFromR2(key: string): Promise<boolean> {
    try {
        const deleteCommand = new DeleteObjectCommand({
            Bucket: BUCKET_NAME,
            Key: key,
        });
        await s3Client.send(deleteCommand);
        console.log(`🗑️ Deleted from R2: ${key}`);
        return true;
    } catch (error) {
        console.error(`❌ Error deleting from R2: ${key}`, error);
        return false;
    }
}

/**
 * Clean up orphaned assets from R2 and update storage
 * This is called during publish to remove old assets that are no longer referenced
 */
export async function cleanupOrphanedAssets(assetKeys: string[], userId: string): Promise<void> {
    if (assetKeys.length === 0) {
        return;
    }

    console.log(`🧹 Cleaning up ${assetKeys.length} orphaned assets for user ${userId}`);

    let totalFreedSpace = 0;

    // Delete each asset from R2 and calculate freed space
    for (const key of assetKeys) {
        const fileSize = await getFileSize(key);
        const deleted = await deleteFromR2(key);

        if (deleted && fileSize > 0) {
            totalFreedSpace += fileSize;
        }
    }

    // Clean up DeletedAsset records for these files
    const deletedCount = await prisma.deletedAsset.deleteMany({
        where: {
            userId: userId,
            assetKey: {
                in: assetKeys,
            },
        },
    });

    console.log(`🗑️ Cleaned up ${deletedCount.count} DeletedAsset records`);

    // Update user's storage usage
    if (totalFreedSpace > 0) {
        await prisma.user.update({
            where: { id: userId },
            data: {
                storageUsed: {
                    decrement: totalFreedSpace,
                },
            },
        });
        console.log(`📊 Freed ${totalFreedSpace} bytes of storage for user ${userId}`);
    }
}

/**
 * Check if an asset key is referenced in published CV content
 * Used to prevent deletion of assets that are still in use
 */
export function isAssetInPublishedContent(assetKey: string, publishedCvContent: any, userId: string): boolean {
    if (!publishedCvContent) {
        return false;
    }

    const publishedAssets = extractAssetKeys(publishedCvContent, userId);
    return publishedAssets.includes(assetKey);
}
