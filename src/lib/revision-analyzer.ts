/**
 * Revision Analyzer
 * 
 * LLM-based analysis of user revision requests.
 * Analyzes user messages and returns structured operation objects.
 */

import { GoogleGenerativeAI } from "@google/generative-ai";
import { CVData } from "./gemini-pdf-parser";
import { DesignPlan } from "./revision-operations";

// Operation types
export type RevisionOperation =
    | {
        type: "ADD_COMPONENT";
        category: string;
        templateId: string;
        position?: number;
    }
    | {
        type: "REMOVE_COMPONENT";
        category: string;
    }
    | {
        type: "REORDER_COMPONENTS";
        newOrder: string[];
    }
    | {
        type: "CHANGE_TEMPLATE";
        category: string;
        newTemplateId: string;
    }
    | {
        type: "UPDATE_THEME";
        colors: {
            primary?: string;
            secondary?: string;
            accent?: string;
            background?: string;
            text?: string;
        };
    }
    | {
        type: "REDIRECT_TO_MYINFO";
        reason: string;
        field: "personal" | "experience" | "education" | "skills" | "languages" | "portfolio";
    }
    | {
        type: "CHAT";
        message: string;
    }
    | {
        type: "UNSUPPORTED";
        message: string;
    };

// Available templates for each component category
// Synced with actual template files in src/components/site-templates/
const AVAILABLE_TEMPLATES = {
    nav: ["nav-classic-horizontal", "nav-minimal-centered", "nav-sidebar-modern", "nav-floating-dot"],
    hero: ["hero-modern-centered", "hero-split-screen", "hero-minimal-text", "hero-animated-gradient"],
    experience: ["experience-timeline", "experience-cards", "experience-accordion", "experience-minimal", "experience-horizontal-timeline", "experience-tabs"],
    education: ["education-timeline", "education-cards", "education-modern", "education-accordion", "education-horizontal-timeline", "education-tabs"],
    skills: ["skills-progress-bars", "skills-card-grid", "skills-categorized", "skills-minimal-list", "skills-tag-cloud"],
    languages: ["languages-progress-bars", "languages-card-grid", "languages-minimalist", "languages-certification", "languages-accordion", "languages-badge-cloud"],
    portfolio: ["portfolio-grid", "portfolio-masonry", "portfolio-carousel", "portfolio-bento-grid"],
    contact: ["contact-modern-form", "contact-minimal-centered", "contact-split-info"],
    footer: ["footer-modern-centered", "footer-minimal-simple", "footer-split-columns", "footer-wave-sticky", "footer-mega-columns"],
};

/**
 * Analyze a user's revision request using LLM
 * @param message User's message
 * @param currentDesignPlan Current design plan
 * @param cvData Current CV data
 * @returns Analyzed operation
 */
export async function analyzeRevisionRequest(
    message: string,
    currentDesignPlan: DesignPlan,
    cvData: CVData | null
): Promise<RevisionOperation> {
    try {
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            throw new Error("GEMINI_API_KEY environment variable is not set");
        }

        const modelName = process.env.GEMINI_MODEL || "gemini-2.0-flash-exp";
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: modelName });

        // Build comprehensive prompt
        const prompt = buildAnalysisPrompt(message, currentDesignPlan, cvData);

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        // Parse LLM response
        const operation = parseOperationResponse(responseText);

        return operation;
    } catch (error) {
        console.error("Error analyzing revision request:", error);

        // Fallback to unsupported operation
        return {
            type: "UNSUPPORTED",
            message: "Talebinizi anlayamadım. Lütfen daha açık bir şekilde belirtin.",
        };
    }
}

/**
 * Build comprehensive LLM prompt for analysis
 */
function buildAnalysisPrompt(
    message: string,
    currentDesignPlan: DesignPlan,
    cvData: CVData | null
): string {
    const currentComponents = currentDesignPlan.selectedComponents
        .map((c) => c.category)
        .join(", ");

    const cvSummary = cvData
        ? `
- İsim: ${cvData.personalInfo?.name || "Yok"}
- Email: ${cvData.personalInfo?.email || "Yok"}
- Deneyim: ${cvData.experience?.length || 0} adet
- Eğitim: ${cvData.education?.length || 0} adet
- Portfolio: ${cvData.portfolio?.length || 0} fotoğraf
- Yetenekler: ${cvData.skills?.length || 0} adet
- Diller: ${cvData.languages?.length || 0} adet`
        : "CV verisi yok";

    return `
Sen bir kişisel web sitesi düzenleme asistanısın. Kullanıcının isteğini analiz edip uygun işlemi belirle.

## Mevcut Site Yapısı:
Aktif Componentler: ${currentComponents}
Tema Renkleri: ${JSON.stringify(currentDesignPlan.themeColors || {}, null, 2)}

## Kullanılabilir Template'ler:
${JSON.stringify(AVAILABLE_TEMPLATES, null, 2)}

## Mevcut CV Verisi:
${cvSummary}

## Kullanıcı İsteği:
"${message}"

## Görevin:
Yukarıdaki bilgilere göre kullanıcının ne istediğini analiz et ve aşağıdaki formatlardan birinde JSON döndür:

1. Component Ekle:
{
  "type": "ADD_COMPONENT",
  "category": "portfolio",
  "templateId": "portfolio-grid",
  "position": 3
}

2. Component Kaldır:
{
  "type": "REMOVE_COMPONENT",
  "category": "portfolio"
}

3. Component Sırala:
{
  "type": "REORDER_COMPONENTS",
  "newOrder": ["nav", "hero", "portfolio", "experience", "contact", "footer"]
}

4. Template Değiştir:
{
  "type": "CHANGE_TEMPLATE",
  "category": "hero",
  "newTemplateId": "hero-animated-gradient"
}

5. Tema Rengi Değiştir:
{
  "type": "UPDATE_THEME",
  "colors": {
    "primary": "#2563eb",
    "secondary": "#3b82f6",
    "accent": "#60a5fa"
  }
}

6. MyInfo'ya Yönlendir (CV içeriği değişikliği için):
{
  "type": "REDIRECT_TO_MYINFO",
  "reason": "İsim değişikliği için Bilgilerim sayfasına gitmeniz gerekiyor",
  "field": "personal"
}

7. Sohbet Mesajı (selamlaşma, genel sorular, teşekkür vb.):
{
  "type": "CHAT",
  "message": "Merhaba! Size nasıl yardımcı olabilirim? Sitenizde değişiklik yapmak isterseniz, lütfen ne yapmak istediğinizi belirtin."
}

8. Desteklenmeyen İşlem (site düzenleme ile ilgili ama yapılamayan):
{
  "type": "UNSUPPORTED",
  "message": "Bu işlem şu anda desteklenmiyor. Lütfen daha spesifik bir talep yazın."
}

## Önemli Kurallar:
- Component eklemek için ilgili CV verisi olmalı (örn: portfolio eklemek için portfolio fotoğrafları)
- CV içeriği değişiklikleri (isim, email, telefon, deneyim, eğitim, yetenekler, diller) için REDIRECT_TO_MYINFO döndür
- Sohbet mesajları (merhaba, nasılsın, teşekkürler) için CHAT döndür ve dostça cevap ver
- Site düzenleme ile ilgili ama yapılamayan işlemler için UNSUPPORTED döndür
- Sadece JSON döndür, başka açıklama yapma
- Template ID'ler yukarıdaki listeden seçilmeli
- position opsiyoneldir, belirtilmezse sona eklenir

SADECE JSON formatında döndür, başka açıklama ekleme.
JSON'dan önce veya sonra hiçbir metin olmasın.
`;
}

/**
 * Parse LLM response into RevisionOperation
 */
function parseOperationResponse(responseText: string): RevisionOperation {
    try {
        // Clean JSON response
        let cleanedText = responseText.trim();

        // Remove markdown code blocks if present
        cleanedText = cleanedText.replace(/^```json\s*/i, "").replace(/^```\s*/, "");
        cleanedText = cleanedText.replace(/\s*```$/g, "");
        cleanedText = cleanedText.trim();

        // Parse JSON
        const parsed = JSON.parse(cleanedText) as RevisionOperation;

        // Validate operation type
        if (!parsed.type) {
            throw new Error("Missing operation type");
        }

        return parsed;
    } catch (error) {
        console.error("Failed to parse operation response:", responseText);

        // Return unsupported operation as fallback
        return {
            type: "UNSUPPORTED",
            message: "Talebinizi işleyemedim. Lütfen daha açık bir şekilde belirtin.",
        };
    }
}
