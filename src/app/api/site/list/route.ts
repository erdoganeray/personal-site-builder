import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sites = await prisma.site.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        userId: true,
        htmlContent: true,
        cssContent: true,
        jsContent: true,
        cvContent: true,
        status: true,
        revisionCount: true,
        maxRevisions: true,
        createdAt: true,
        updatedAt: true,
        publishedAt: true,
        cloudflareUrl: true,
        subdomain: true,
        publishedHtmlContent: true,
        publishedCssContent: true,
        publishedJsContent: true,
        publishedCvContent: true,
      },
    });

    return NextResponse.json({ sites });
  } catch (error) {
    console.error("Site listeleme hatası:", error);
    return NextResponse.json(
      { error: "Siteler yüklenemedi" },
      { status: 500 }
    );
  }
}
