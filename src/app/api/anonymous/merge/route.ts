import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/anonymous/merge
 * Merges anonymous user's site data into the logged-in user's account
 * 
 * Body: { anonymousSessionToken: string }
 */
export async function POST(req: NextRequest) {
    try {
        // User must be logged in
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { anonymousSessionToken } = await req.json();

        if (!anonymousSessionToken) {
            return NextResponse.json(
                { error: "Anonymous session token is required" },
                { status: 400 }
            );
        }

        // Find anonymous user
        const anonymousUser = await prisma.user.findUnique({
            where: { anonymousSessionToken },
            include: { sites: true }
        });

        if (!anonymousUser) {
            return NextResponse.json(
                { error: "Anonymous session not found" },
                { status: 404 }
            );
        }

        // Get logged-in user's existing site
        const existingUserSite = await prisma.site.findFirst({
            where: { userId: session.user.id }
        });

        // Get anonymous user's site
        const anonymousSite = anonymousUser.sites[0];

        if (!anonymousSite) {
            // No site to merge, just delete anonymous user
            await prisma.user.delete({
                where: { id: anonymousUser.id }
            });

            return NextResponse.json({
                success: true,
                message: "No site to merge",
                merged: false
            });
        }

        // Determine if we need to republish
        const shouldRepublish = existingUserSite?.status === "publish";

        if (existingUserSite) {
            // Update existing site with anonymous site's content
            await prisma.site.update({
                where: { id: existingUserSite.id },
                data: {
                    cvUrl: anonymousSite.cvUrl,
                    cvContent: anonymousSite.cvContent as any,
                    designPlan: anonymousSite.designPlan as any,
                    htmlContent: anonymousSite.htmlContent,
                    cssContent: anonymousSite.cssContent,
                    jsContent: anonymousSite.jsContent,
                    title: anonymousSite.title,
                    status: shouldRepublish ? "preview" : anonymousSite.status,
                    updatedAt: new Date()
                }
            });

            // Delete anonymous user's site and the anonymous user
            await prisma.site.delete({
                where: { id: anonymousSite.id }
            });
            await prisma.user.delete({
                where: { id: anonymousUser.id }
            });

            console.log(`[Merge] Merged anonymous site into user ${session.user.id}'s existing site`);

            // If should republish, trigger republish
            if (shouldRepublish) {
                // TODO: Trigger republish workflow
                console.log(`[Merge] Site needs to be republished`);
            }

            return NextResponse.json({
                success: true,
                merged: true,
                updatedExisting: true,
                shouldRepublish
            });
        } else {
            // Transfer anonymous site to logged-in user
            await prisma.site.update({
                where: { id: anonymousSite.id },
                data: {
                    userId: session.user.id
                }
            });

            // Delete anonymous user (site is now transferred)
            await prisma.user.delete({
                where: { id: anonymousUser.id }
            });

            console.log(`[Merge] Transferred anonymous site to user ${session.user.id}`);

            return NextResponse.json({
                success: true,
                merged: true,
                updatedExisting: false,
                siteId: anonymousSite.id
            });
        }

    } catch (error) {
        console.error("Anonymous merge error:", error);
        return NextResponse.json(
            { error: "Merge failed" },
            { status: 500 }
        );
    }
}
