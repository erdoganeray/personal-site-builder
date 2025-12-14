import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { S3Client, HeadObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { GetObjectCommand } from "@aws-sdk/client-s3";

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

async function getPresignedUrl(key: string): Promise<string> {
    try {
        const command = new GetObjectCommand({
            Bucket: BUCKET_NAME,
            Key: key,
        });
        const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 }); // 1 hour
        return url;
    } catch (error) {
        console.error(`Error generating presigned URL for ${key}:`, error);
        return "";
    }
}

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = session.user.id;

        // Fetch all deleted assets for the user
        const deletedAssets = await prisma.deletedAsset.findMany({
            where: { userId },
            orderBy: { deletedAt: 'desc' }, // Newest first
            select: {
                id: true,
                assetKey: true,
                assetType: true,
                deletedAt: true,
            },
        });

        // Generate presigned URLs and calculate auto-deletion dates
        const rollbackFiles = await Promise.all(
            deletedAssets.map(async (asset: any) => {
                const size = await getFileSize(asset.assetKey);
                const thumbnailUrl = await getPresignedUrl(asset.assetKey);

                // Auto-deletion date is 30 days from deletion
                const autoDeleteDate = new Date(asset.deletedAt);
                autoDeleteDate.setDate(autoDeleteDate.getDate() + 30);

                return {
                    id: asset.id,
                    assetKey: asset.assetKey,
                    assetType: asset.assetType,
                    deletedAt: asset.deletedAt,
                    autoDeleteDate: autoDeleteDate,
                    size: size,
                    thumbnailUrl: thumbnailUrl,
                };
            })
        );

        return NextResponse.json({
            files: rollbackFiles,
            count: rollbackFiles.length,
            totalSize: rollbackFiles.reduce((sum: number, file: any) => sum + file.size, 0),
        });
    } catch (error) {
        console.error("Rollback list error:", error);
        return NextResponse.json(
            { error: "Failed to fetch rollback files" },
            { status: 500 }
        );
    }
}
