import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
    try {
        // 1. Authentication check
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json(
                { error: "Unauthorized" },
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

        // 3. Fetch site from database
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

        // 4. Verify site belongs to user
        if (site.user.email !== session.user.email) {
            return NextResponse.json(
                { error: "Unauthorized - Site does not belong to you" },
                { status: 403 }
            );
        }

        // 5. Check if published content exists
        if (!site.publishedHtmlContent && !site.publishedCssContent && !site.publishedJsContent) {
            return NextResponse.json(
                { error: "No published version available to rollback to" },
                { status: 400 }
            );
        }

        // 6. Perform rollback - copy published content to preview
        const updatedSite = await prisma.site.update({
            where: { id: siteId },
            data: {
                htmlContent: site.publishedHtmlContent,
                cssContent: site.publishedCssContent,
                jsContent: site.publishedJsContent,
                cvContent: site.publishedCvContent as any,
            },
        });

        console.log(`✅ Rollback successful for site ${siteId}`);

        // 7. Return success response
        return NextResponse.json({
            success: true,
            message: "Site successfully rolled back to last published version",
            site: updatedSite,
        });
    } catch (error) {
        console.error("❌ Rollback error:", error);
        return NextResponse.json(
            { error: "Failed to rollback site" },
            { status: 500 }
        );
    }
}
