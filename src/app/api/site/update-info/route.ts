import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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

        // Update site with new info
        const updatedSite = await prisma.site.update({
            where: { id: siteId },
            data: {
                name: name || null,
                jobTitle: jobTitle || null,
                email: email || null,
                phone: phone || null,
                location: location || null,
                linkedinUrl: linkedinUrl || null,
                githubUrl: githubUrl || null,
                summary: summary || null,
                experience: experience ? JSON.stringify(experience) : null,
                education: education ? JSON.stringify(education) : null,
                skills: skills ? JSON.stringify(skills) : null,
                languages: languages ? JSON.stringify(languages) : null,
                updatedAt: new Date(),
            },
        });

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
