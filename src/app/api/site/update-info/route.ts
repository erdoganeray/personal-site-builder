import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { regeneratePreviewContent } from "@/lib/regenerate-preview";

// URL'lerin başına https:// ekleyen yardımcı fonksiyon
function ensureHttps(url: string | undefined): string | undefined {
    if (!url || url.trim() === '') return undefined;
    const trimmedUrl = url.trim();
    if (trimmedUrl.startsWith('http://') || trimmedUrl.startsWith('https://')) {
        return trimmedUrl;
    }
    return `https://${trimmedUrl}`;
}

// Portfolio metadata validation and sanitization
function validatePortfolioMetadata(portfolio: any[]): any[] {
    if (!Array.isArray(portfolio)) return [];

    return portfolio.map(item => {
        // Ensure imageUrl is present
        if (!item.imageUrl || typeof item.imageUrl !== 'string') {
            throw new Error('Each portfolio item must have a valid imageUrl');
        }

        const validated: any = {
            imageUrl: item.imageUrl.trim()
        };

        // Validate and sanitize optional fields
        if (item.title !== undefined && item.title !== null) {
            validated.title = String(item.title).trim().substring(0, 200); // Max 200 chars
        }

        if (item.description !== undefined && item.description !== null) {
            validated.description = String(item.description).trim().substring(0, 1000); // Max 1000 chars
        }

        if (item.category !== undefined && item.category !== null) {
            validated.category = String(item.category).trim().substring(0, 100); // Max 100 chars
        }

        if (item.projectUrl !== undefined && item.projectUrl !== null) {
            const url = String(item.projectUrl).trim();
            if (url) {
                // Validate URL format
                try {
                    const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
                    validated.projectUrl = urlObj.href;
                } catch {
                    // Invalid URL, skip it
                    console.warn(`Invalid projectUrl: ${url}`);
                }
            }
        }

        if (item.tags !== undefined && item.tags !== null) {
            if (Array.isArray(item.tags)) {
                validated.tags = item.tags
                    .filter((tag: any) => typeof tag === 'string' && tag.trim())
                    .map((tag: any) => String(tag).trim().substring(0, 50)) // Max 50 chars per tag
                    .slice(0, 10); // Max 10 tags
            }
        }

        return validated;
    });
}

export async function PATCH(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const body = await req.json();
        const {
            siteId,
            name,
            jobTitle,
            email,
            phone,
            location,
            linkedinUrl,
            githubUrl,
            facebookUrl,
            instagramUrl,
            xUrl,
            websiteUrl,
            summary,
            experience,
            education,
            portfolio,
            skills,
            languages,
            profilePhotoUrl,
        } = body;

        if (!siteId) {
            return NextResponse.json(
                { error: "Site ID is required" },
                { status: 400 }
            );
        }

        // Verify ownership
        const site = await prisma.site.findUnique({
            where: { id: siteId },
        });

        if (!site || site.userId !== session.user.id) {
            return NextResponse.json(
                { error: "Site not found or unauthorized" },
                { status: 404 }
            );
        }

        // Get existing cvContent or create a new one
        let cvContent = site.cvContent as any || {
            personalInfo: {},
            summary: "",
            experience: [],
            education: [],
            portfolio: [],
            skills: [],
            languages: [],
        };

        // Update cvContent with new values
        if (name !== undefined) cvContent.personalInfo.name = name;
        if (jobTitle !== undefined) cvContent.personalInfo.title = jobTitle;
        if (email !== undefined) cvContent.personalInfo.email = email;
        if (phone !== undefined) cvContent.personalInfo.phone = phone;
        if (location !== undefined) cvContent.personalInfo.location = location;
        if (linkedinUrl !== undefined) cvContent.personalInfo.linkedin = ensureHttps(linkedinUrl);
        if (githubUrl !== undefined) cvContent.personalInfo.github = ensureHttps(githubUrl);
        if (facebookUrl !== undefined) cvContent.personalInfo.facebook = ensureHttps(facebookUrl);
        if (instagramUrl !== undefined) cvContent.personalInfo.instagram = ensureHttps(instagramUrl);
        if (xUrl !== undefined) cvContent.personalInfo.x = ensureHttps(xUrl);
        if (websiteUrl !== undefined) cvContent.personalInfo.website = ensureHttps(websiteUrl);
        if (profilePhotoUrl !== undefined) cvContent.personalInfo.profilePhotoUrl = profilePhotoUrl || null;
        if (summary !== undefined) cvContent.summary = summary;
        if (experience !== undefined) cvContent.experience = experience;
        if (education !== undefined) cvContent.education = education;
        if (portfolio !== undefined) cvContent.portfolio = validatePortfolioMetadata(portfolio);
        if (skills !== undefined) cvContent.skills = skills;
        if (languages !== undefined) cvContent.languages = languages;

        // Update site with updated cvContent
        const updatedSite = await prisma.site.update({
            where: { id: siteId },
            data: {
                cvContent: cvContent,
                updatedAt: new Date(),
            },
        });

        // Auto-regenerate preview ONLY if site has been generated (status != "draft" and designPlan exists)
        if (updatedSite.status !== "draft" && updatedSite.designPlan) {
            console.log(`Auto-regenerating preview for site ${siteId} after info update...`);

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
            message: "Site info updated successfully",
            site: updatedSite,
        });
    } catch (error) {
        console.error("Error updating site info:", error);
        return NextResponse.json(
            { error: "Failed to update site info" },
            { status: 500 }
        );
    }
}
