import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { regeneratePreviewContent } from "@/lib/regenerate-preview";

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

    // Auto-regenerate preview ONLY if site has been generated (status != "draft" and designPlan exists)
    if (updatedSite.status !== "draft" && updatedSite.designPlan) {
      console.log(`Auto-regenerating preview for site ${siteId} after links update...`);
      
      const result = await regeneratePreviewContent(siteId);
      
      if (!result.success) {
        console.error('Failed to auto-regenerate preview:', result.error);
        // Don't fail the request - just log the error
      } else {
        console.log('✅ Preview auto-regenerated successfully');
      }
    } else {
      console.log(`Skipping preview regeneration: status=${updatedSite.status}, hasDesignPlan=${!!updatedSite.designPlan}`);
    }

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
