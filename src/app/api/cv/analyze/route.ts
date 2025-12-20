import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { parseCVFromPDF } from "@/lib/gemini-pdf-parser";
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
 * POST /api/cv/analyze
 * CV PDF'ini analiz eder ve yapılandırılmış veri döndürür
 * 
 * Body: { cvUrl: string, siteId?: string }
 * Response: { success: true, data: CVData } | { success: false, error: string }
 */
export async function POST(req: NextRequest) {
  try {
    // Authentication kontrolü
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json(
        { success: false, error: "Giriş yapmalısınız" },
        { status: 401 }
      );
    }

    // Request body'yi parse et
    const body = await req.json();
    const { cvUrl, siteId } = body;

    // Validasyon
    if (!cvUrl || typeof cvUrl !== 'string') {
      return NextResponse.json(
        { success: false, error: "CV URL'i gerekli" },
        { status: 400 }
      );
    }

    // PDF URL'inin geçerli olduğunu kontrol et
    if (!cvUrl.startsWith('http://') && !cvUrl.startsWith('https://')) {
      return NextResponse.json(
        { success: false, error: "Geçerli bir URL sağlanmalı" },
        { status: 400 }
      );
    }

    console.log(`[CV Analyze] Processing CV from: ${cvUrl}`);

    // CV URL'den R2 key'i çıkar
    // URL format: https://pub-xxx.r2.dev/users/{userId}/cv/cv-xxx.pdf
    const urlParts = cvUrl.split("/");
    const keyIndex = urlParts.indexOf("users");

    if (keyIndex === -1) {
      return NextResponse.json(
        { success: false, error: "Geçersiz CV URL formatı" },
        { status: 400 }
      );
    }

    const key = urlParts.slice(keyIndex).join("/");
    console.log(`[CV Analyze] Fetching from R2 key: ${key}`);

    // PDF'i doğrudan R2'den çek (public URL yerine S3 client kullan)
    let pdfBuffer: Buffer;
    try {
      const command = new GetObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME!,
        Key: key,
      });

      const response = await s3Client.send(command);

      if (!response.Body) {
        throw new Error("R2'den boş yanıt alındı");
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
      console.log(`[CV Analyze] PDF fetched, size: ${pdfBuffer.length} bytes`);
    } catch (r2Error) {
      console.error("[CV Analyze] R2 fetch error:", r2Error);
      return NextResponse.json(
        { success: false, error: "CV dosyası okunamadı" },
        { status: 500 }
      );
    }

    // Gemini ile PDF'i analiz et
    const cvData = await parseCVFromPDF(pdfBuffer);

    console.log(`CV analysis successful for: ${cvData.personalInfo.name}`);

    // Eğer siteId verilmişse, veritabanını güncelle
    if (siteId) {
      // Kullanıcının bu site'a erişim yetkisi olduğunu kontrol et
      const site = await prisma.site.findFirst({
        where: {
          id: siteId,
          user: {
            email: session.user.email
          }
        }
      });

      if (!site) {
        return NextResponse.json(
          { success: false, error: "Site bulunamadı veya erişim yetkiniz yok" },
          { status: 404 }
        );
      }

      // CV verisini site'a kaydet
      await prisma.site.update({
        where: { id: siteId },
        data: {
          cvUrl,
          cvContent: JSON.parse(JSON.stringify(cvData)),
        }
      });

      console.log(`CV data saved to site: ${siteId}`);
    }

    // Başarılı yanıt
    return NextResponse.json({
      success: true,
      data: cvData
    });

  } catch (error) {
    console.error("CV analysis error:", error);

    // Hata mesajını kullanıcıya dön
    const errorMessage = error instanceof Error
      ? error.message
      : "CV analizi sırasında bir hata oluştu";

    return NextResponse.json(
      {
        success: false,
        error: errorMessage
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/cv/analyze?siteId=xxx
 * Bir site'ın kaydedilmiş CV verisini getirir
 */
export async function GET(req: NextRequest) {
  try {
    // Authentication kontrolü
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json(
        { success: false, error: "Giriş yapmalısınız" },
        { status: 401 }
      );
    }

    // URL parametrelerini al
    const { searchParams } = new URL(req.url);
    const siteId = searchParams.get('siteId');

    if (!siteId) {
      return NextResponse.json(
        { success: false, error: "siteId parametresi gerekli" },
        { status: 400 }
      );
    }

    // Site'ı bul ve kullanıcı yetkisini kontrol et
    const site = await prisma.site.findFirst({
      where: {
        id: siteId,
        user: {
          email: session.user.email
        }
      },
      select: {
        id: true,
        cvContent: true,
        cvUrl: true
      }
    });

    if (!site) {
      return NextResponse.json(
        { success: false, error: "Site bulunamadı" },
        { status: 404 }
      );
    }

    // CV verisi yoksa hata dön
    if (!site.cvContent) {
      return NextResponse.json(
        { success: false, error: "Bu site için CV verisi bulunamadı" },
        { status: 404 }
      );
    }

    // CV verisi zaten JSON formatında
    const cvData = site.cvContent;

    return NextResponse.json({
      success: true,
      data: cvData
    });

  } catch (error) {
    console.error("Error fetching CV data:", error);

    return NextResponse.json(
      {
        success: false,
        error: "CV verisi alınırken hata oluştu"
      },
      { status: 500 }
    );
  }
}
