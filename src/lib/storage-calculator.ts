import { S3Client, ListObjectsV2Command, ListObjectsV2CommandOutput, HeadObjectCommand } from "@aws-sdk/client-s3";
import { prisma } from "@/lib/prisma";

const s3Client = new S3Client({
    region: "auto",
    endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
});

/**
 * Recalculates the total storage used by a user by querying all their files in R2
 * and updates the user's storageUsed field in the database.
 * 
 * @param userId - The user's ID
 * @returns The total storage used in bytes
 */
export async function recalculateUserStorage(userId: string): Promise<bigint> {
    try {
        console.log(`📊 Recalculating storage for user: ${userId}`);

        let totalSize = BigInt(0);
        let continuationToken: string | undefined = undefined;

        // List all objects under users/{userId}/
        do {
            const listCommand: ListObjectsV2Command = new ListObjectsV2Command({
                Bucket: process.env.R2_BUCKET_NAME!,
                Prefix: `users/${userId}/`,
                ContinuationToken: continuationToken,
            });

            const listResponse: ListObjectsV2CommandOutput = await s3Client.send(listCommand);

            if (listResponse.Contents) {
                for (const object of listResponse.Contents) {
                    if (object.Size) {
                        totalSize += BigInt(object.Size);
                    }
                }
            }

            continuationToken = listResponse.NextContinuationToken;
        } while (continuationToken);

        console.log(`✅ Total storage for user ${userId}: ${totalSize} bytes (${formatBytes(Number(totalSize))})`);

        // Update user's storage in database
        await prisma.user.update({
            where: { id: userId },
            data: { storageUsed: totalSize },
        });

        console.log(`✅ Database updated for user ${userId}`);

        return totalSize;
    } catch (error) {
        console.error(`❌ Error recalculating storage for user ${userId}:`, error);
        throw error;
    }
}

/**
 * Formats bytes to human-readable format
 */
function formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}
