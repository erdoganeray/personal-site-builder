import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { deleteKVMapping } from "@/lib/cloudflare-deploy";

/**
 * Cron job to clean up expired subdomain reservations
 * Runs every 6 hours via Vercel Cron
 * 
 * When a site is unpublished, the subdomain is reserved for 7 days (configurable).
 * After expiration, this job clears the subdomain so it can be claimed by others.
 */
export async function GET(request: NextRequest) {
    // Verify cron secret for security
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        console.log("❌ Cleanup reservations: Unauthorized request");
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const now = new Date();
        console.log(`🕐 Starting subdomain reservation cleanup at ${now.toISOString()}`);

        // Find sites with expired subdomain reservations
        const expiredSites = await prisma.site.findMany({
            where: {
                subdomainReservationExpiresAt: {
                    lt: now,
                },
                subdomain: {
                    not: null,
                },
                // Only unpublished sites (published sites don't have expiration)
                status: {
                    not: "published",
                },
            },
            select: {
                id: true,
                subdomain: true,
                userId: true,
            },
        });

        console.log(`📋 Found ${expiredSites.length} expired subdomain reservations`);

        let cleanedCount = 0;
        let errorCount = 0;

        for (const site of expiredSites) {
            try {
                // Delete KV mapping first
                if (site.subdomain) {
                    await deleteKVMapping(site.subdomain);
                }

                // Clear subdomain and expiration from database
                await prisma.site.update({
                    where: { id: site.id },
                    data: {
                        subdomain: null,
                        subdomainReservationExpiresAt: null,
                    },
                });

                console.log(`✅ Cleared expired subdomain: ${site.subdomain} (Site: ${site.id})`);
                cleanedCount++;
            } catch (error) {
                console.error(`❌ Error cleaning subdomain for site ${site.id}:`, error);
                errorCount++;
            }
        }

        const summary = {
            success: true,
            timestamp: now.toISOString(),
            found: expiredSites.length,
            cleaned: cleanedCount,
            errors: errorCount,
        };

        console.log(`✅ Subdomain cleanup completed:`, summary);

        return NextResponse.json(summary);
    } catch (error) {
        console.error("❌ Subdomain cleanup failed:", error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : "Cleanup failed"
            },
            { status: 500 }
        );
    }
}
