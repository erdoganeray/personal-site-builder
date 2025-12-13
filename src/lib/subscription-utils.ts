/**
 * Subscription Utility Functions
 * Helper functions for managing subscription limits and monthly resets
 */

import { PlanType, getPlanLimits } from "./plan-constants";
import { prisma } from "./prisma";

/**
 * Check if a date has passed and needs to be reset to next month
 */
export function needsMonthlyReset(resetDate: Date): boolean {
    const now = new Date();
    return now >= resetDate;
}

/**
 * Calculate the next reset date (one month from now)
 */
export function getNextResetDate(): Date {
    const now = new Date();
    const nextMonth = new Date(now);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    return nextMonth;
}

/**
 * Check and reset monthly edit counter if needed
 * Returns the updated user with potentially reset counters
 */
export async function checkAndResetEditCounter(userId: string) {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            planType: true,
            editsThisMonth: true,
            editsResetDate: true,
        },
    });

    if (!user) {
        throw new Error("User not found");
    }

    // Check if reset is needed
    if (needsMonthlyReset(user.editsResetDate)) {
        // Reset the counter
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                editsThisMonth: 0,
                editsResetDate: getNextResetDate(),
            },
        });
        return updatedUser;
    }

    return user;
}

/**
 * Check if user has remaining edits this month
 */
export function hasRemainingEdits(
    planType: string,
    editsThisMonth: number
): boolean {
    const limits = getPlanLimits(planType as PlanType);
    return editsThisMonth < limits.editsPerMonth;
}

/**
 * Get remaining edits for the month
 */
export function getRemainingEdits(
    planType: string,
    editsThisMonth: number
): number {
    const limits = getPlanLimits(planType as PlanType);
    return Math.max(0, limits.editsPerMonth - editsThisMonth);
}

/**
 * Increment edit counter and return updated user
 */
export async function incrementEditCounter(userId: string) {
    // First check and reset if needed
    await checkAndResetEditCounter(userId);

    // Then increment
    const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
            editsThisMonth: {
                increment: 1,
            },
        },
    });

    return updatedUser;
}


