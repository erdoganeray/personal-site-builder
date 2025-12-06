import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { regeneratePreviewContent } from "@/lib/regenerate-preview";

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
            summary,
            experience,
            education,
            skills,
            languages,
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
            skills: [],
            languages: [],
        };

        // Update cvContent with new values
        if (name !== undefined) cvContent.personalInfo.name = name;
        if (jobTitle !== undefined) cvContent.personalInfo.title = jobTitle;
        if (email !== undefined) cvContent.personalInfo.email = email;
        if (phone !== undefined) cvContent.personalInfo.phone = phone;
        if (location !== undefined) cvContent.personalInfo.location = location;
        if (linkedinUrl !== undefined) cvContent.personalInfo.linkedin = linkedinUrl;
        if (githubUrl !== undefined) cvContent.personalInfo.github = githubUrl;
        if (summary !== undefined) cvContent.summary = summary;
        if (experience !== undefined) cvContent.experience = experience;
        if (education !== undefined) cvContent.education = education;
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
