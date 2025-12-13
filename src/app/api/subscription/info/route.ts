import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
    getPlanLimits,
    getPlanPrice,
    getPlanNameTR,
    PlanType,
    PLAN_FEATURES,
} from "@/lib/plan-constants";
import {
    getRemainingEdits,
    checkAndResetEditCounter,
} from "@/lib/subscription-utils";

/**
 * GET /api/subscription/info
 * Returns user's subscription information including plan details and usage statistics
 */
export async function GET(req: NextRequest) {
    try {
        // 1. Check authentication
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json(
                { error: "Unauthorized. Please login." },
                { status: 401 }
            );
        }

        // 2. Find user in database
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            include: {
                sites: {
                    select: {
                        id: true,
                        status: true,
                        cloudflareUrl: true,
                    },
                },
            },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // 3. Check and reset counters if needed
        await checkAndResetEditCounter(user.id);

        // 4. Fetch updated user data after potential resets
        const updatedUser = await prisma.user.findUnique({
            where: { id: user.id },
            include: {
                sites: {
                    select: {
                        id: true,
                        status: true,
                        cloudflareUrl: true,
                    },
                },
            },
        });

        if (!updatedUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // 5. Get plan limits
        const planType = updatedUser.planType as PlanType;
        const limits = getPlanLimits(planType);

        // 6. Calculate usage statistics
        const remainingEdits = getRemainingEdits(
            planType,
            updatedUser.editsThisMonth
        );

        // 7. Get site statistics
        const publishedSites = updatedUser.sites.filter(
            (site) => site.status === "published"
        );

        // 8. Return subscription info
        return NextResponse.json({
            plan: {
                type: planType,
                name: getPlanNameTR(planType),
                price: getPlanPrice(planType),
                limits: limits,
            },
            usage: {
                edits: {
                    used: updatedUser.editsThisMonth,
                    limit: limits.editsPerMonth,
                    remaining: remainingEdits,
                    resetDate: updatedUser.editsResetDate,
                },
                storage: {
                    used: updatedUser.storageUsed.toString(),
                    limit: updatedUser.storageLimit.toString(),
                    usedMB: Number(updatedUser.storageUsed) / (1024 * 1024),
                    limitMB: Number(updatedUser.storageLimit) / (1024 * 1024),
                },
            },
            sites: {
                total: updatedUser.sites.length,
                published: publishedSites.length,
                publishedUrls: publishedSites.map((site) => ({
                    id: site.id,
                    url: site.cloudflareUrl,
                })),
            },
            features: PLAN_FEATURES,
        });
    } catch (error) {
        console.error("Error in /api/subscription/info:", error);

        return NextResponse.json(
            {
                error: "Internal server error",
                details: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}
