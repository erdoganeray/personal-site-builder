import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * Update user's subdomain
 * POST /api/domain/update-subdomain
 * Body: { siteId: string, subdomain: string }
 */
export async function POST(req: NextRequest) {
    try {
        // 1. Authentication check
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        // 2. Get request body
        const body = await req.json();
        const { siteId, subdomain } = body;

        if (!siteId || !subdomain) {
            return NextResponse.json(
                { success: false, message: "Site ID ve subdomain gerekli" },
                { status: 400 }
            );
        }

        // 3. Validate subdomain format
        const subdomainRegex = /^[a-z0-9]([a-z0-9-]{1,61}[a-z0-9])?$/;
        if (!subdomainRegex.test(subdomain)) {
            return NextResponse.json({
                success: false,
                message: "Subdomain sadece küçük harf, rakam ve tire (-) içerebilir (3-63 karakter)",
            });
        }

        // 4. Get site and verify ownership
        const site = await prisma.site.findUnique({
            where: { id: siteId },
            include: { user: true },
        });

        if (!site) {
            return NextResponse.json(
                { success: false, message: "Site bulunamadı" },
                { status: 404 }
            );
        }

        if (site.user.email !== session.user.email) {
            return NextResponse.json(
                { success: false, message: "Bu site size ait değil" },
                { status: 403 }
            );
        }

        // 5. Check if subdomain is available (unless it's the same as current)
        if (site.subdomain !== subdomain) {
            const existingSite = await prisma.site.findUnique({
                where: { subdomain },
                select: {
                    id: true,
                    subdomainReservationExpiresAt: true,
                },
            });

            if (existingSite) {
                // Check if reservation has expired
                if (
                    !existingSite.subdomainReservationExpiresAt ||
                    new Date(existingSite.subdomainReservationExpiresAt) >= new Date()
                ) {
                    return NextResponse.json({
                        success: false,
                        message: "Bu subdomain kullanımda veya rezerve edilmiş",
                    });
                }

                // Clear expired reservation
                await prisma.site.update({
                    where: { id: existingSite.id },
                    data: {
                        subdomain: null,
                        subdomainReservationExpiresAt: null,
                    },
                });
            }
        }

        // 6. Update subdomain and set reservation timer if not published
        let updateData: any = { subdomain };

        // If site is not published, always set/reset reservation timer
        if (site.status !== "published") {
            const reservationDays = site.user.planType === "PAID" ? 30 : 7;
            const reservationExpiresAt = new Date();
            reservationExpiresAt.setDate(reservationExpiresAt.getDate() + reservationDays);
            updateData.subdomainReservationExpiresAt = reservationExpiresAt;
        }

        const updatedSite = await prisma.site.update({
            where: { id: siteId },
            data: updateData,
        });

        // 7. If site is published, automatically republish with new subdomain
        if (site.status === "published" && site.htmlContent && site.cssContent && site.jsContent) {
            try {
                // Import deployment functions
                const { deployToCloudflare, updateKVMapping, deleteKVMapping } = await import("@/lib/cloudflare-deploy");

                // Delete old KV mapping if old subdomain exists
                if (site.subdomain && site.subdomain !== subdomain) {
                    await deleteKVMapping(site.subdomain);
                }

                // Deploy to Cloudflare with new subdomain
                const deployment = await deployToCloudflare(
                    subdomain,
                    site.user.id,
                    siteId,
                    site.htmlContent,
                    site.cssContent,
                    site.jsContent
                );

                if (deployment.success) {
                    // Update KV mapping with new subdomain
                    await updateKVMapping(subdomain, site.user.id, siteId);

                    // Update database with new URL
                    await prisma.site.update({
                        where: { id: siteId },
                        data: {
                            cloudflareUrl: deployment.url,
                        },
                    });

                    return NextResponse.json({
                        success: true,
                        message: "Subdomain başarıyla güncellendi ve site yeni URL ile yayınlandı",
                        site: updatedSite,
                        republished: true,
                        newUrl: deployment.url,
                    });
                }
            } catch (deployError) {
                console.error("❌ Auto-republish error:", deployError);
                // Site subdomain updated but republish failed
                return NextResponse.json({
                    success: true,
                    message: "Subdomain güncellendi ancak otomatik yeniden yayınlama başarısız oldu. Lütfen manuel olarak yayınlayın.",
                    site: updatedSite,
                    republished: false,
                });
            }
        }

        return NextResponse.json({
            success: true,
            message: "Subdomain başarıyla güncellendi",
            site: updatedSite,
        });
    } catch (error) {
        console.error("❌ Update subdomain error:", error);
        return NextResponse.json(
            { success: false, message: "Bir hata oluştu" },
            { status: 500 }
        );
    }
}
