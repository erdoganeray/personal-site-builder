import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { S3Client, DeleteObjectCommand, ListObjectsV2Command, ListObjectsV2CommandOutput } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
    region: "auto",
    endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
});

/**
 * DELETE /api/user/delete-account
 * Permanently deletes user account and all associated data
 * 
 * Request body:
 * - password: string (required for verification)
 * 
 * Response:
 * - 200: Account deleted successfully
 * - 401: Unauthorized or invalid password
 * - 500: Server error
 */
export async function POST(request: NextRequest) {
    try {
        // 1. Session kontrolü
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Oturum bulunamadı. Lütfen giriş yapın." },
                { status: 401 }
            );
        }

        // 2. Request body'den şifreyi al
        const body = await request.json();
        const { password } = body;

        if (!password) {
            return NextResponse.json(
                { error: "Şifre gereklidir" },
                { status: 400 }
            );
        }

        // 3. Kullanıcıyı database'den al
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
        });

        if (!user) {
            return NextResponse.json(
                { error: "Kullanıcı bulunamadı" },
                { status: 404 }
            );
        }

        // 4. Şifre doğrulama
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return NextResponse.json(
                { error: "Şifre yanlış" },
                { status: 401 }
            );
        }

        // 5. Cloudflare R2'den tüm kullanıcı dosyalarını sil
        try {
            console.log(`🗑️ Deleting all files for user: ${session.user.id}`);

            let deletedCount = 0;
            let continuationToken: string | undefined = undefined;

            // List and delete all objects under users/{userId}/
            do {
                const listCommand: ListObjectsV2Command = new ListObjectsV2Command({
                    Bucket: process.env.R2_BUCKET_NAME!,
                    Prefix: `users/${session.user.id}/`,
                    ContinuationToken: continuationToken,
                });

                const listResponse: ListObjectsV2CommandOutput = await s3Client.send(listCommand);

                if (listResponse.Contents && listResponse.Contents.length > 0) {
                    // Delete each file
                    for (const object of listResponse.Contents) {
                        if (object.Key) {
                            try {
                                await s3Client.send(
                                    new DeleteObjectCommand({
                                        Bucket: process.env.R2_BUCKET_NAME!,
                                        Key: object.Key,
                                    })
                                );
                                deletedCount++;
                                console.log(`✅ Deleted: ${object.Key}`);
                            } catch (deleteError) {
                                console.error(`❌ Failed to delete ${object.Key}:`, deleteError);
                                // Continue even if individual file deletion fails
                            }
                        }
                    }
                }

                continuationToken = listResponse.NextContinuationToken;
            } while (continuationToken);

            console.log(`✅ Deleted ${deletedCount} files from R2 for user ${session.user.id}`);
        } catch (r2Error) {
            console.error("R2 deletion error:", r2Error);
            // Continue even if R2 deletion fails - we still want to delete the user from database
        }

        // 6. Database'den kullanıcıyı sil (Sites cascade delete otomatik)
        await prisma.user.delete({
            where: { id: session.user.id },
        });

        console.log(`✅ User ${session.user.id} deleted from database`);

        // 7. Success response
        return NextResponse.json({
            success: true,
            message: "Hesabınız başarıyla silindi",
        });
    } catch (error) {
        console.error("Account deletion error:", error);
        return NextResponse.json(
            { error: "Hesap silinirken bir hata oluştu" },
            { status: 500 }
        );
    }
}
