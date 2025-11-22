import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { UTApi } from "uploadthing/server";

const utapi = new UTApi();

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

    // UploadThing'den dosyayı sil
    if (site.cvUrl) {
      try {
        // URL'den file key'i çıkar
        // Örnek URL: https://utfs.io/f/abc123.pdf
        const fileKey = site.cvUrl.split('/f/')[1];
        if (fileKey) {
          await utapi.deleteFiles(fileKey);
          console.log("UploadThing'den dosya silindi:", fileKey);
        }
      } catch (uploadError) {
        console.error("UploadThing silme hatası:", uploadError);
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
