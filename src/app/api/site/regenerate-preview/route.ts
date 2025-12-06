import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { regeneratePreviewContent } from "@/lib/regenerate-preview";

/**
 * POST /api/site/regenerate-preview
 * 
 * Regenerates htmlContent, cssContent, jsContent from cvContent + designPlan
 * This is called automatically when cvContent changes (e.g., user updates info)
 * 
 * Body: { siteId: string }
 */
export async function POST(req: NextRequest) {
  try {
    // 1. Authentication check
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized. Please login first." },
        { status: 401 }
      );
    }

    // 2. Get siteId from request body
    const body = await req.json();
    const { siteId } = body;

    if (!siteId) {
      return NextResponse.json(
        { error: "Site ID is required" },
        { status: 400 }
      );
    }

    // 3. Verify ownership
    const site = await prisma.site.findUnique({
      where: { id: siteId },
      include: { user: true },
    });

    if (!site) {
      return NextResponse.json(
        { error: "Site not found" },
        { status: 404 }
      );
    }

    if (site.user.email !== session.user.email) {
      return NextResponse.json(
        { error: "You don't have permission to regenerate this site" },
        { status: 403 }
      );
    }

    // 4. Call regeneration logic
    const result = await regeneratePreviewContent(siteId);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Failed to regenerate preview" },
        { status: 400 }
      );
    }

    // 5. Return success response
    return NextResponse.json({
      success: true,
      message: "Preview regenerated successfully",
      site: result.site,
    });

  } catch (error) {
    console.error("Unexpected error in /api/site/regenerate-preview:", error);

    return NextResponse.json(
      {
        error: "An unexpected error occurred during preview regeneration",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
