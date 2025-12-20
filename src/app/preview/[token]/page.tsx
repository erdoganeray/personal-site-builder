import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import PreviewClient from "./PreviewClient";

interface PageProps {
    params: Promise<{ token: string }>;
}

export default async function AnonymousPreviewPage({ params }: PageProps) {
    const { token } = await params;

    // Token ile kullanıcıyı bul
    const user = await prisma.user.findUnique({
        where: { anonymousSessionToken: token },
        include: {
            sites: {
                where: { status: { in: ["preview", "previewed"] } },
                orderBy: { updatedAt: "desc" },
                take: 1,
            },
        },
    });

    if (!user || !user.sites[0]) {
        notFound();
    }

    const site = user.sites[0];

    // Site içeriği yoksa 404
    if (!site.htmlContent) {
        notFound();
    }

    return (
        <PreviewClient
            token={token}
            siteTitle={site.title}
            htmlContent={site.htmlContent}
            cssContent={site.cssContent || ""}
            jsContent={site.jsContent || ""}
        />
    );
}
