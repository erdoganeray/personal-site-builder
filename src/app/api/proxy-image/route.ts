import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

/**
 * Preview sayfasında R2 görselleri için proxy endpoint
 * Blob iframe içinde CORS sorununu çözmek için
 * S3 client kullanarak doğrudan R2'den çeker (SSL hatası önlenir)
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const imageUrl = searchParams.get("url");

    if (!imageUrl) {
      return NextResponse.json(
        { error: "No image URL provided" },
        { status: 400 }
      );
    }

    // Sadece R2 public URL'lerini proxy et
    if (!imageUrl.includes('.r2.dev')) {
      return NextResponse.json(
        { error: "Invalid image URL" },
        { status: 400 }
      );
    }

    // URL'den R2 key'i çıkar
    // URL format: https://pub-xxx.r2.dev/users/{userId}/...
    const urlParts = imageUrl.split("/");
    const keyIndex = urlParts.indexOf("users");

    if (keyIndex === -1) {
      return NextResponse.json(
        { error: "Invalid image URL format" },
        { status: 400 }
      );
    }

    const key = urlParts.slice(keyIndex).join("/");

    // S3 client ile R2'den çek (public URL yerine)
    try {
      const command = new GetObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME!,
        Key: key,
      });

      const response = await s3Client.send(command);

      if (!response.Body) {
        return NextResponse.json(
          { error: "Image not found" },
          { status: 404 }
        );
      }

      // Stream'i buffer'a çevir
      const chunks: Uint8Array[] = [];
      const reader = response.Body.transformToWebStream().getReader();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
      }

      const imageBuffer = Buffer.concat(chunks);
      const contentType = response.ContentType || "image/jpeg";

      // Resmi döndür
      return new NextResponse(imageBuffer, {
        headers: {
          "Content-Type": contentType,
          "Cache-Control": "public, max-age=31536000",
        },
      });
    } catch (r2Error) {
      console.error("R2 fetch error:", r2Error);
      return NextResponse.json(
        { error: "Image not found in R2" },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Image proxy error:", error);
    return NextResponse.json(
      { error: "Proxy failed" },
      { status: 500 }
    );
  }
}
