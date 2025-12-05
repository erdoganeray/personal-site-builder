import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { siteId, linkedinUrl, githubUrl } = await request.json();

    if (!siteId) {
      return NextResponse.json({ error: "Site ID is required" }, { status: 400 });
    }

    // Site'ın kullanıcıya ait olduğunu kontrol et
    const site = await prisma.site.findUnique({
      where: { id: siteId },
    });

    if (!site) {
      return NextResponse.json({ error: "Site bulunamadı" }, { status: 404 });
    }

    if (site.userId !== session.user.id) {
      return NextResponse.json({ error: "Bu siteyi güncelleme yetkiniz yok" }, { status: 403 });
    }

    // Get existing cvContent
    let cvContent = site.cvContent as any || {
      personalInfo: {},
      summary: "",
      experience: [],
      education: [],
      skills: [],
      languages: [],
    };

    // Update LinkedIn and GitHub in cvContent
    if (linkedinUrl !== undefined) cvContent.personalInfo.linkedin = linkedinUrl;
    if (githubUrl !== undefined) cvContent.personalInfo.github = githubUrl;

    // LinkedIn ve GitHub URL'lerini cvContent içinde güncelle
    const updatedSite = await prisma.site.update({
      where: { id: siteId },
      data: {
        cvContent: cvContent,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ 
      success: true, 
      message: "Linkler başarıyla güncellendi",
      site: {
        id: updatedSite.id,
        cvContent: updatedSite.cvContent,
      }
    });
  } catch (error) {
    console.error("Link güncelleme hatası:", error);
    return NextResponse.json(
      { error: "Linkler güncellenemedi" },
      { status: 500 }
    );
  }
}
