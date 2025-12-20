import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parseCVFromPDF } from "@/lib/gemini-pdf-parser";
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
 * POST /api/anonymous/analyze
 * Anonim kullanıcılar için CV analiz endpoint'i
 * 
 * Body: { anonymousSessionToken: string, siteId: string }
 */
export async function POST(req: NextRequest) {
    try {
        const { anonymousSessionToken, siteId } = await req.json();

        // Validasyonlar
        if (!anonymousSessionToken) {
            return NextResponse.json(
                { error: "Anonymous session token is required" },
                { status: 400 }
            );
        }

        if (!siteId) {
            return NextResponse.json(
                { error: "Site ID is required" },
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

        // Site'ı bul ve kullanıcıya ait olduğunu doğrula
        const site = await prisma.site.findUnique({
            where: { id: siteId }
        });

        if (!site || site.userId !== user.id) {
            return NextResponse.json(
                { error: "Site not found or access denied" },
                { status: 404 }
            );
        }

        if (!site.cvUrl) {
            return NextResponse.json(
                { error: "CV URL not found" },
                { status: 400 }
            );
        }

        console.log(`[Anonymous Analyze] Processing CV from: ${site.cvUrl}`);

        // CV URL'den key'i çıkar
        // URL format: https://pub-xxx.r2.dev/users/{userId}/cv/cv-xxx.pdf
        const urlParts = site.cvUrl.split("/");
        const keyIndex = urlParts.indexOf("users");

        if (keyIndex === -1) {
            return NextResponse.json(
                { error: "Invalid CV URL format" },
                { status: 400 }
            );
        }

        const key = urlParts.slice(keyIndex).join("/");
        console.log(`[Anonymous Analyze] Fetching from R2 key: ${key}`);

        // PDF'i doğrudan R2'den çek
        let pdfBuffer: Buffer;
        try {
            const command = new GetObjectCommand({
                Bucket: process.env.R2_BUCKET_NAME!,
                Key: key,
            });

            const response = await s3Client.send(command);

            if (!response.Body) {
                throw new Error("Empty response from R2");
            }

            // Stream'i buffer'a çevir
            const chunks: Uint8Array[] = [];
            const reader = response.Body.transformToWebStream().getReader();

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                chunks.push(value);
            }

            pdfBuffer = Buffer.concat(chunks);
            console.log(`[Anonymous Analyze] PDF fetched, size: ${pdfBuffer.length} bytes`);
        } catch (r2Error) {
            console.error("R2 fetch error:", r2Error);
            return NextResponse.json(
                { error: "CV dosyası okunamadı" },
                { status: 500 }
            );
        }

        // CV'yi analiz et
        const cvData = await parseCVFromPDF(pdfBuffer);

        // cvContent'i veritabanına kaydet
        await prisma.site.update({
            where: { id: siteId },
            data: {
                cvContent: cvData as any
            }
        });

        console.log(`[Anonymous Analyze] CV analyzed and saved for site: ${siteId}`);

        return NextResponse.json({
            success: true,
            data: cvData
        });

    } catch (error) {
        console.error("Anonymous analyze error:", error);

        const errorMessage = error instanceof Error
            ? error.message
            : "CV analizi sırasında bir hata oluştu";

        return NextResponse.json(
            { success: false, error: errorMessage },
            { status: 500 }
        );
    }
}
