import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const siteId = searchParams.get("id");

    if (!siteId) {
      return NextResponse.json({ error: "Site ID is required" }, { status: 400 });
    }

    // Önce site'ın kullanıcıya ait olduğunu kontrol et
    const site = await prisma.site.findUnique({
      where: { id: siteId },
    });

    if (!site) {
      return NextResponse.json({ error: "Site bulunamadı" }, { status: 404 });
    }

    if (site.userId !== session.user.id) {
      return NextResponse.json({ error: "Bu siteyi silme yetkiniz yok" }, { status: 403 });
    }

    // R2'den dosyayı sil
    if (site.cvUrl) {
      try {
        // URL'den file key'i çıkar
        // Örnek URL: https://pub-bf529b02842d4bcf8be2282dc9efb2a6.r2.dev/cvs/cv-123.pdf
        const url = new URL(site.cvUrl);
        const fileKey = url.pathname.substring(1); // "/cvs/cv-123.pdf" -> "cvs/cv-123.pdf"
        
        if (fileKey) {
          await s3Client.send(
            new DeleteObjectCommand({
              Bucket: process.env.R2_BUCKET_NAME!,
              Key: fileKey,
            })
          );
          console.log("R2'den dosya silindi:", fileKey);
        }
      } catch (deleteError) {
        console.error("R2 silme hatası:", deleteError);
        // Dosya silme hatası olsa bile devam et
      }
    }

    // Veritabanından site'ı sil
    await prisma.site.delete({
      where: { id: siteId },
    });

    return NextResponse.json({ 
      success: true, 
      message: "Site başarıyla silindi" 
    });
  } catch (error) {
    console.error("Site silme hatası:", error);
    return NextResponse.json(
      { error: "Site silinemedi" },
      { status: 500 }
    );
  }
}
