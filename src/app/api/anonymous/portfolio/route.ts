import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
    region: "auto",
    endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
});

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_PORTFOLIO_IMAGES = 10; // Limit for anonymous users

/**
 * POST /api/anonymous/portfolio
 * Anonim kullanıcılar için portfolyo yükleme endpoint'i
 * 
 * Body (FormData): 
 *   - files: Görsel dosyaları (multiple)
 *   - anonymousSessionToken: Client tarafından üretilen benzersiz token
 */
export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const anonymousSessionToken = formData.get("anonymousSessionToken") as string;

        // Validasyonlar
        if (!anonymousSessionToken) {
            return NextResponse.json(
                { error: "Anonymous session token is required" },
                { status: 400 }
            );
        }

        // Token ile kullanıcıyı doğrula
        const user = await prisma.user.findUnique({
            where: { anonymousSessionToken }
        });

        if (!user) {
            return NextResponse.json(
                { error: "Invalid session token" },
                { status: 401 }
            );
        }

        // Dosyaları al
        const files = formData.getAll("files") as File[];

        // Tek dosya desteği
        if (files.length === 0) {
            const singleFile = formData.get("file") as File;
            if (singleFile) {
                files.push(singleFile);
            }
        }

        if (files.length === 0) {
            return NextResponse.json(
                { error: "No files provided" },
                { status: 400 }
            );
        }

        // Limit kontrolü
        if (files.length > MAX_PORTFOLIO_IMAGES) {
            return NextResponse.json(
                { error: `Maximum ${MAX_PORTFOLIO_IMAGES} portfolio images allowed` },
                { status: 400 }
            );
        }

        const uploadResults = [];
        const errors = [];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];

            try {
                // Dosya tipi kontrolü
                if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
                    errors.push({
                        fileName: file.name,
                        error: "Only JPEG, PNG, and WebP images are allowed"
                    });
                    continue;
                }

                // Dosya boyutu kontrolü
                if (file.size > MAX_FILE_SIZE) {
                    errors.push({
                        fileName: file.name,
                        error: "File size must be less than 5MB"
                    });
                    continue;
                }

                // Benzersiz dosya adı oluştur
                const fileExt = file.name.split(".").pop() || "jpg";
                const timestamp = Date.now();
                const fileName = `portfolio-${timestamp}-${i}.${fileExt}`;

                // Buffer'a çevir
                const buffer = Buffer.from(await file.arrayBuffer());

                // R2'ye yükle
                await s3Client.send(
                    new PutObjectCommand({
                        Bucket: process.env.R2_BUCKET_NAME!,
                        Key: `users/${user.id}/portfolio/${fileName}`,
                        Body: buffer,
                        ContentType: file.type,
                        CacheControl: "public, max-age=31536000",
                    })
                );

                // Public URL oluştur
                const fileUrl = `${process.env.R2_PUBLIC_URL}/users/${user.id}/portfolio/${fileName}`;

                uploadResults.push({
                    success: true,
                    url: fileUrl,
                    fileName: file.name,
                    originalIndex: i
                });

                console.log(`[Anonymous Portfolio] Uploaded: ${fileUrl}`);
            } catch (error) {
                console.error(`Error uploading file ${file.name}:`, error);
                errors.push({
                    fileName: file.name,
                    error: "Upload failed"
                });
            }
        }

        if (uploadResults.length === 0) {
            return NextResponse.json(
                { error: "All uploads failed", errors },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            uploads: uploadResults,
            errors: errors.length > 0 ? errors : undefined,
            message: `Successfully uploaded ${uploadResults.length} of ${files.length} files`
        });

    } catch (error) {
        console.error("Anonymous portfolio upload error:", error);
        return NextResponse.json(
            { error: "Upload failed" },
            { status: 500 }
        );
    }
}
