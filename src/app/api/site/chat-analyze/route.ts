import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * POST /api/site/chat-analyze
 * Kullanıcının mesajını analiz eder, revize gerekip gerekmediğini belirler
 */
export async function POST(req: NextRequest) {
  try {
    // 1. Authentication kontrolü
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized. Please login." },
        { status: 401 }
      );
    }

    // 2. Request body'den siteId ve message al
    const { siteId, message } = await req.json();

    if (!siteId || !message) {
      return NextResponse.json(
        { error: "siteId and message are required" },
        { status: 400 }
      );
    }

    if (typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json(
        { error: "Message must be a non-empty string" },
        { status: 400 }
      );
    }

    // 3. Kullanıcıyı database'den bul
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // 4. Site'ı database'den bul ve kullanıcıya ait olduğunu kontrol et
    const site = await prisma.site.findUnique({
      where: { id: siteId },
    });

    if (!site) {
      return NextResponse.json(
        { error: "Site not found" },
        { status: 404 }
      );
    }

    if (site.userId !== user.id) {
      return NextResponse.json(
        { error: "You don't have permission to access this site" },
        { status: 403 }
      );
    }

    // 5. Gemini ile mesajı analiz et
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not set");
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const analysisPrompt = `
Sen bir web sitesi editör asistanısın. Kullanıcı mesajlarını analiz ederek revize gerektirip gerektirmediğini belirliyorsun.

Kullanıcının Mesajı:
"${message}"

Görevin:
1. Bu mesajın web sitesinde bir değişiklik (revize) gerektirip gerektirmediğini belirle
2. Eğer revize GEREKTİRMİYORSA (soru, sohbet, teşekkür vb.), kısa ve nazik bir cevap ver
3. Eğer revize GEREKTİRİYORSA, yapılacak değişiklikleri madde madde listele

Revize gerektiren örnekler:
- "Eğitim bölümünü kaldır" → Revize gerektirir
- "Ana rengi maviye çevir" → Revize gerektirir  
- "Portfolio bölümünü üste taşı" → Revize gerektirir
- "Başlık fontunu büyüt" → Revize gerektirir
- "İletişim bölümünü silmek istiyorum" → Revize gerektirir
- "Daha modern bir tasarım yap" → Revize gerektirir

Revize gerektirmeyen örnekler:
- "Merhaba" → Sohbet
- "Teşekkür ederim" → Teşekkür
- "Nasıl çalışıyorsun?" → Soru
- "Site güzel olmuş" → Yorum

JSON formatında döndür:
{
  "isRevision": true/false,
  "response": "Kullanıcıya verilecek cevap (Türkçe, samimi ve yardımsever)",
  "changes": ["Değişiklik 1", "Değişiklik 2", ...] // Sadece isRevision=true ise
}

SADECE JSON döndür, başka açıklama ekleme.
`;

    const result = await model.generateContent(analysisPrompt);
    const responseText = result.response.text();

    try {
      // JSON temizleme
      let cleanedText = responseText.trim();
      cleanedText = cleanedText.replace(/^```json\s*/i, '').replace(/^```\s*/, '');
      cleanedText = cleanedText.replace(/\s*```$/g, '');
      cleanedText = cleanedText.trim();
      
      const parsed = JSON.parse(cleanedText);
      
      if (typeof parsed.isRevision !== 'boolean' || !parsed.response) {
        throw new Error("Analysis response is missing required fields");
      }

      // Eğer revize ise ama changes yoksa, varsayılan ekle
      if (parsed.isRevision && (!parsed.changes || parsed.changes.length === 0)) {
        parsed.changes = ["Talep edilen değişiklikler uygulanacak"];
      }
      
      return NextResponse.json({
        isRevision: parsed.isRevision,
        response: parsed.response,
        changes: parsed.changes || null,
      });
      
    } catch (parseError) {
      console.error("Failed to parse Gemini analysis response:", responseText.substring(0, 500));
      
      // Fallback: Basit keyword bazlı analiz
      const revisionKeywords = [
        'kaldır', 'sil', 'değiştir', 'çevir', 'taşı', 'ekle', 'yap',
        'renk', 'font', 'boyut', 'bölüm', 'component', 'tasarım',
        'büyüt', 'küçült', 'üst', 'alt', 'modern', 'güncelle'
      ];
      
      const lowerMessage = message.toLowerCase();
      const isRevision = revisionKeywords.some(keyword => lowerMessage.includes(keyword));
      
      if (isRevision) {
        return NextResponse.json({
          isRevision: true,
          response: "Anladım, bu değişiklikleri yapmak için onayınıza ihtiyacım var.",
          changes: [message],
        });
      } else {
        return NextResponse.json({
          isRevision: false,
          response: "Merhaba! Size nasıl yardımcı olabilirim? Site üzerinde değişiklik yapmak için isteğinizi belirtebilirsiniz.",
          changes: null,
        });
      }
    }

  } catch (error) {
    console.error("Error in /api/site/chat-analyze:", error);

    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
