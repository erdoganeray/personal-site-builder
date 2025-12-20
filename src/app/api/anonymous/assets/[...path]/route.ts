import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
    region: "auto",
    endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
});

/**
 * Anonymous preview için asset proxy
 * /api/anonymous/assets/[userId]/[folder]/[fileName] isteklerini handle eder
 * Örnek: /api/anonymous/assets/cmjxxx/portfolio/portfolio-123.jpg
 */
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    try {
        const { path } = await params;

        // path: ["userId", "folder", "fileName"]
        if (!path || path.length < 3) {
            return NextResponse.json(
                { error: "Invalid path" },
                { status: 400 }
            );
        }

        const userId = path[0];
        const folder = path[1]; // "profile" veya "portfolio"
        const fileName = path.slice(2).join("/"); // geri kalan path

        // Sadece profile ve portfolio klasörlerine izin ver
        if (folder !== "profile" && folder !== "portfolio") {
            return NextResponse.json(
                { error: "Invalid folder" },
                { status: 400 }
            );
        }

        // User'ın var olup olmadığını kontrol et (güvenlik için)
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true }
        });

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        // R2'den resmi al
        const r2Key = `users/${userId}/${folder}/${fileName}`;

        try {
            const command = new GetObjectCommand({
                Bucket: process.env.R2_BUCKET_NAME!,
                Key: r2Key,
            });

            const response = await s3Client.send(command);

            if (!response.Body) {
                return NextResponse.json(
                    { error: "Image not found" },
                    { status: 404 }
                );
            }

            // Stream'i buffer'a çevir
            const chunks: Uint8Array[] = [];
            const stream = response.Body as any;

            for await (const chunk of stream) {
                chunks.push(chunk);
            }

            const buffer = Buffer.concat(chunks);
            const contentType = response.ContentType || "image/jpeg";

            return new NextResponse(buffer, {
                headers: {
                    "Content-Type": contentType,
                    "Cache-Control": "public, max-age=31536000",
                },
            });
        } catch (error) {
            console.error("R2 fetch error:", error);
            return NextResponse.json(
                { error: "Image not found in R2" },
                { status: 404 }
            );
        }
    } catch (error) {
        console.error("Asset proxy error:", error);
        return NextResponse.json(
            { error: "Proxy failed" },
            { status: 500 }
        );
    }
}
