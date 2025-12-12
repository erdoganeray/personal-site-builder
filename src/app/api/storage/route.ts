import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // Get user's storage info
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: {
                storageUsed: true,
                storageLimit: true,
            },
        });

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        // Convert BigInt to number for JSON serialization
        const storageUsed = Number(user.storageUsed);
        const storageLimit = Number(user.storageLimit);
        const usagePercentage = storageLimit > 0
            ? Math.round((storageUsed / storageLimit) * 100)
            : 0;

        return NextResponse.json({
            storageUsed,
            storageLimit,
            usagePercentage,
            storageUsedFormatted: formatBytes(storageUsed),
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
