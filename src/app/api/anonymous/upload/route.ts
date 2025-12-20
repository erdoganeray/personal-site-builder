import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { S3Client, PutObjectCommand, ListObjectsV2Command, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";

const s3Client = new S3Client({
    region: "auto",
    endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
});

/**
 * Belirtilen klasördeki tüm dosyaları siler
 */
async function deleteFilesInFolder(userId: string, folder: string): Promise<number> {
    const prefix = `users/${userId}/${folder}/`;
    let deletedCount = 0;

    try {
        const listCommand = new ListObjectsV2Command({
            Bucket: process.env.R2_BUCKET_NAME!,
            Prefix: prefix,
        });

        const listResponse = await s3Client.send(listCommand);

        if (listResponse.Contents && listResponse.Contents.length > 0) {
            for (const object of listResponse.Contents) {
                if (object.Key) {
                    await s3Client.send(
                        new DeleteObjectCommand({
                            Bucket: process.env.R2_BUCKET_NAME!,
                            Key: object.Key,
                        })
                    );
                    deletedCount++;
                    console.log(`[Cleanup] Deleted: ${object.Key}`);
                }
            }
        }
    } catch (error) {
        console.error(`[Cleanup] Error deleting files in ${folder}:`, error);
    }

    return deletedCount;
}

/**
 * POST /api/anonymous/upload
 * Anonim kullanıcılar için CV yükleme endpoint'i
 * 
 * Body (FormData): 
 *   - file: PDF dosyası
 *   - anonymousSessionToken: Client tarafından üretilen benzersiz token
 *   - customPrompt: (opsiyonel) Kullanıcının site tercihleri
 */
export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;
        const anonymousSessionToken = formData.get("anonymousSessionToken") as string;
        const customPrompt = formData.get("customPrompt") as string | null;

        // Validasyonlar
        if (!anonymousSessionToken) {
            return NextResponse.json(
                { error: "Anonymous session token is required" },
                { status: 400 }
            );
        }

        if (!file) {
            return NextResponse.json(
                { error: "No file provided" },
                { status: 400 }
            );
        }

        if (file.type !== "application/pdf") {
            return NextResponse.json(
                { error: "Only PDF files are allowed" },
                { status: 400 }
            );
        }

        // Dosya boyutu kontrolü (5MB limit)
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            return NextResponse.json(
                { error: "File size exceeds 5MB limit" },
                { status: 400 }
            );
        }

        // Token ile mevcut anonim kullanıcıyı bul veya yeni oluştur
        let user = await prisma.user.findUnique({
            where: { anonymousSessionToken }
        });

        if (!user) {
            // Yeni anonim kullanıcı oluştur
            user = await prisma.user.create({
                data: {
                    isAnonymous: true,
                    anonymousSessionToken,
                }
            });
        } else {
            // Mevcut kullanıcı varsa, eski dosyaları temizle (CV ve portfolio)
            console.log(`[Anonymous Upload] Cleaning up old files for user: ${user.id}`);

            const deletedCVs = await deleteFilesInFolder(user.id, "cv");
            const deletedPortfolio = await deleteFilesInFolder(user.id, "portfolio");

            console.log(`[Cleanup] Deleted ${deletedCVs} CV files and ${deletedPortfolio} portfolio files`);
        }

        // CV dosyasını R2'ye yükle
        const buffer = Buffer.from(await file.arrayBuffer());
        const fileName = `cv-${randomUUID()}.pdf`;
        const fileKey = `users/${user.id}/cv/${fileName}`;

        await s3Client.send(
            new PutObjectCommand({
                Bucket: process.env.R2_BUCKET_NAME!,
                Key: fileKey,
                Body: buffer,
                ContentType: "application/pdf",
            })
        );

        // R2 public URL oluştur
        const cvUrl = `${process.env.R2_PUBLIC_URL}/${fileKey}`;

        // Kullanıcının mevcut sitesi var mı kontrol et
        let site = await prisma.site.findFirst({
            where: { userId: user.id }
        });

        if (site) {
            // Mevcut siteyi güncelle - cvContent'i de temizle ki yeniden analiz edilsin
            site = await prisma.site.update({
                where: { id: site.id },
                data: {
                    cvUrl,
                    cvContent: undefined,  // Yeniden analiz için temizle
                    designPlan: undefined, // Yeniden tasarım için temizle
                    status: "draft"
                }
            });
        } else {
            // Yeni site oluştur
            site = await prisma.site.create({
                data: {
                    userId: user.id,
                    cvUrl,
                    status: "draft",
                }
            });
        }

        console.log(`[Anonymous Upload] User: ${user.id}, Site: ${site.id}, CV: ${cvUrl}`);

        return NextResponse.json({
            success: true,
            userId: user.id,
            siteId: site.id,
            cvUrl,
            message: "CV başarıyla yüklendi"
        });

    } catch (error) {
        console.error("Anonymous upload error:", error);
        return NextResponse.json(
            { error: "Upload failed" },
            { status: 500 }
        );
    }
}

