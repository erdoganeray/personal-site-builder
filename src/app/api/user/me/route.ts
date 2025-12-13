import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PLAN_LIMITS, PlanType } from "@/lib/plan-constants";

/**
 * GET /api/user/me
 * Returns current user data including pending email, plan limits, and usage stats
 */
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: {
                id: true,
                email: true,
                name: true,
                pendingEmail: true,
                emailTokenExpiresAt: true,
                planType: true,
                storageUsed: true,
                storageLimit: true,
                createdAt: true,
                updatedAt: true,
                editsThisMonth: true,
                editsResetDate: true,
            },
        });

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        // Get plan limits for the user's plan type
        const planType = user.planType as PlanType;
        const planLimits = PLAN_LIMITS[planType];

        return NextResponse.json({
            ...user,
            storageUsed: user.storageUsed.toString(),
            storageLimit: user.storageLimit.toString(),
            planLimits,
        });
    } catch (error) {
        console.error("Get user error:", error);
        return NextResponse.json(
            { error: "Failed to fetch user data" },
            { status: 500 }
        );
    }
}
