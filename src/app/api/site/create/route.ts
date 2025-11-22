import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { cvUrl } = await request.json();

    if (!cvUrl) {
      return NextResponse.json({ error: "CV URL is required" }, { status: 400 });
    }

    // Kullanıcının zaten bir sitesi var mı kontrol et
    const existingSite = await prisma.site.findFirst({
      where: {
        userId: session.user.id,
      },
    });

    if (existingSite) {
      return NextResponse.json(
        { error: "Zaten bir siteniz mevcut. Yeni site oluşturmak için önce mevcut sitenizi silmelisiniz." },
        { status: 400 }
      );
    }

    // Site kaydı oluştur
    const site = await prisma.site.create({
      data: {
        userId: session.user.id,
        cvUrl: cvUrl,
        status: "draft",
      },
    });

    return NextResponse.json({ 
      success: true, 
      siteId: site.id,
      message: "CV başarıyla yüklendi" 
    });
  } catch (error) {
    console.error("Site oluşturma hatası:", error);
    return NextResponse.json(
      { error: "Site oluşturulamadı" },
      { status: 500 }
    );
  }
}
