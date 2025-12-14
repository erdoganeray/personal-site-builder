import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { S3Client, HeadObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
    region: "auto",
    endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
});

const BUCKET_NAME = process.env.R2_BUCKET_NAME!;

async function getFileSize(key: string): Promise<number> {
    try {
        const command = new HeadObjectCommand({
            Bucket: BUCKET_NAME,
            Key: key,
        });
        const response = await s3Client.send(command);
        return response.ContentLength || 0;
    } catch (error) {
        console.error(`Error getting file size for ${key}:`, error);
        return 0;
    }
}

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = session.user.id;

        // Fetch user's site
        const site = await prisma.site.findFirst({
            where: { userId },
            select: {
                cvUrl: true,
                cvContent: true,
                htmlContent: true,
                cssContent: true,
                jsContent: true,
            },
        });

        // Fetch deleted assets
        const deletedAssets = await prisma.deletedAsset.findMany({
            where: { userId },
            select: {
                assetKey: true,
                assetType: true,
            },
        });

        // Calculate User Info Content Storage
        const userInfoFiles: Array<{ name: string; size: number; type: string }> = [];
        let userInfoTotal = 0;

        // CV file
        if (site?.cvUrl) {
            // Extract the key from the URL - handle both old and new formats
            // Old format: https://pub-xxx.r2.dev/userId/cv/cv-xxx.pdf (no users/ prefix)
            // New format: https://pub-xxx.r2.dev/users/userId/cv/cv-xxx.pdf (with users/ prefix)
            const urlParts = site.cvUrl.split('/');
            let cvKey: string;

            if (site.cvUrl.includes('/users/')) {
                // New format - extract from "users" onwards
                const keyParts = urlParts.slice(urlParts.indexOf('users'));
                cvKey = keyParts.join('/');
            } else {
                // Old format - add "users/" prefix
                const keyParts = urlParts.slice(-3); // [userId, 'cv', 'cv-xxx.pdf']
                cvKey = `users/${keyParts.join('/')}`;
            }

            const cvSize = await getFileSize(cvKey);
            if (cvSize > 0) {
                userInfoFiles.push({ name: "CV", size: cvSize, type: "pdf" });
                userInfoTotal += cvSize;
            }
        }


        // Profile photo
        if (site?.cvContent && typeof site.cvContent === 'object') {
            const cvData = site.cvContent as any;
            if (cvData.personalInfo?.profilePhotoUrl) {
                // Extract key from profile photo URL
                const photoUrl = cvData.personalInfo.profilePhotoUrl;
                const urlParts = photoUrl.split('/');
                let photoKey: string;

                if (photoUrl.includes('/users/')) {
                    // New format - extract from "users" onwards
                    const keyParts = urlParts.slice(urlParts.indexOf('users'));
                    photoKey = keyParts.join('/');
                } else if (photoUrl.startsWith('/_assets/profile/')) {
                    // Relative path format
                    const fileName = photoUrl.replace('/_assets/profile/', '');
                    photoKey = `users/${userId}/profile/${fileName}`;
                } else {
                    // Old format - add "users/" prefix
                    const keyParts = urlParts.slice(-3); // [userId, 'profile', 'photo-xxx.jpg']
                    photoKey = `users/${keyParts.join('/')}`;
                }

                const profilePhotoSize = await getFileSize(photoKey);
                if (profilePhotoSize > 0) {
                    userInfoFiles.push({ name: "Profil Fotoğrafı", size: profilePhotoSize, type: "image" });
                    userInfoTotal += profilePhotoSize;
                }
            }
        }

        // Portfolio photos
        if (site?.cvContent && typeof site.cvContent === 'object') {
            const cvData = site.cvContent as any;
            if (cvData.portfolio && Array.isArray(cvData.portfolio)) {
                for (let i = 0; i < cvData.portfolio.length; i++) {
                    const portfolioItem = cvData.portfolio[i];
                    const photoUrl = portfolioItem.imageUrl;
                    if (!photoUrl) continue; // Skip if no image URL

                    const urlParts = photoUrl.split('/');
                    let photoKey: string;

                    if (photoUrl.includes('/users/')) {
                        // New format - extract from "users" onwards
                        const keyParts = urlParts.slice(urlParts.indexOf('users'));
                        photoKey = keyParts.join('/');
                    } else if (photoUrl.startsWith('/_assets/portfolio/')) {
                        // Relative path format
                        const fileName = photoUrl.replace('/_assets/portfolio/', '');
                        photoKey = `users/${userId}/portfolio/${fileName}`;
                    } else {
                        // Old format - add "users/" prefix
                        const keyParts = urlParts.slice(-3); // [userId, 'portfolio', 'photo-xxx.jpg']
                        photoKey = `users/${keyParts.join('/')}`;
                    }

                    const photoSize = await getFileSize(photoKey);
                    if (photoSize > 0) {
                        userInfoFiles.push({
                            name: `Portföy Fotoğrafı ${i + 1}`,
                            size: photoSize,
                            type: "image"
                        });
                        userInfoTotal += photoSize;
                    }
                }
            }
        }

        // Calculate Published Site Files Storage
        const publishedFiles: Array<{ name: string; size: number; type: string }> = [];
        let publishedTotal = 0;

        if (site?.htmlContent) {
            const htmlSize = Buffer.byteLength(site.htmlContent, 'utf8');
            publishedFiles.push({ name: "HTML", size: htmlSize, type: "html" });
            publishedTotal += htmlSize;
        }

        if (site?.cssContent) {
            const cssSize = Buffer.byteLength(site.cssContent, 'utf8');
            publishedFiles.push({ name: "CSS", size: cssSize, type: "css" });
            publishedTotal += cssSize;
        }

        if (site?.jsContent) {
            const jsSize = Buffer.byteLength(site.jsContent, 'utf8');
            publishedFiles.push({ name: "JavaScript", size: jsSize, type: "js" });
            publishedTotal += jsSize;
        }

        // Calculate Rollback Files Storage
        const rollbackFiles: Array<{ name: string; size: number; type: string }> = [];
        let rollbackTotal = 0;

        for (const asset of deletedAssets) {
            const assetSize = await getFileSize(asset.assetKey);
            if (assetSize > 0) {
                const fileName = asset.assetType === "profile"
                    ? "Profil Fotoğrafı (Silinecek)"
                    : `Portföy Fotoğrafı (Silinecek)`;
                rollbackFiles.push({
                    name: fileName,
                    size: assetSize,
                    type: asset.assetType
                });
                rollbackTotal += assetSize;
            }
        }

        return NextResponse.json({
            userInfo: {
                files: userInfoFiles,
                total: userInfoTotal,
                count: userInfoFiles.length,
            },
            published: {
                files: publishedFiles,
                total: publishedTotal,
                count: publishedFiles.length,
            },
            rollback: {
                files: rollbackFiles,
                total: rollbackTotal,
                count: rollbackFiles.length,
            },
            grandTotal: userInfoTotal + publishedTotal + rollbackTotal,
        });
    } catch (error) {
        console.error("Storage breakdown error:", error);
        return NextResponse.json(
            { error: "Failed to fetch storage breakdown" },
            { status: 500 }
        );
    }
}
