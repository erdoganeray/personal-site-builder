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
