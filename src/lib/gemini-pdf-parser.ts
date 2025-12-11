import { GoogleGenerativeAI } from "@google/generative-ai";

export interface CVPersonalInfo {
  name: string;
  email?: string;
  phone?: string;
  location?: string;
  title?: string;
  profilePhotoUrl?: string;
  linkedin?: string;
  github?: string;
  facebook?: string;
  instagram?: string;
  x?: string;
  website?: string;
}

export interface CVExperience {
  company: string;
  position: string;
  duration: string; // Display format: "Jan 2020 - Dec 2023" or "2020-2023"
  description: string;
  // Structured date fields for calculations and sorting
  startDate?: string; // ISO format: "2020-01-01" or "2020-01"
  endDate?: string; // ISO format: "2023-12-31" or "2023-12", null if current
  isCurrentPosition?: boolean; // True if still working here
}

export interface CVEducation {
  school: string;
  degree: string;
  field: string;
  year: string;
}

export interface CVPortfolioItem {
  imageUrl: string;
}

export interface CVData {
  personalInfo: CVPersonalInfo;
  summary?: string;
  experience: CVExperience[];
  education: CVEducation[];
  portfolio: CVPortfolioItem[];
  skills: string[];
  languages: string[];
}

/**
 * PDF dosyasını Gemini API kullanarak analiz eder ve yapılandırılmış CV verisi döndürür
 * @param pdfBuffer PDF dosyasının Buffer formatında içeriği
 * @returns CVData nesnesi
 */
export async function parseCVFromPDF(pdfBuffer: Buffer): Promise<CVData> {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not set");
    }

    const modelName = process.env.GEMINI_MODEL || "gemini-2.5-flash";
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: modelName });

    const prompt = `
Bu PDF dosyasındaki CV/özgeçmiş bilgilerini analiz et ve aşağıdaki 
JSON formatında yapılandırılmış olarak döndür:

{
  "personalInfo": {
    "name": "Ad Soyad",
    "email": "email@example.com",
    "phone": "telefon",
    "location": "şehir, ülke",
    "title": "meslek/unvan"
  },
  "summary": "kısa özet/bio",
  "experience": [
    {
      "company": "şirket adı",
      "position": "pozisyon",
      "duration": "tarih aralığı",
      "description": "açıklama"
    }
  ],
  "education": [
    {
      "school": "okul adı",
      "degree": "derece",
      "field": "bölüm",
      "year": "yıl"
    }
  ],
  "skills": ["skill1", "skill2"],
  "languages": ["dil1", "dil2"]
}

Önemli kurallar:
- Sadece geçerli JSON formatında döndür, başka açıklama ekleme
- Eğer bir alan bulunamazsa boş string ("") veya boş array ([]) kullan
- Tüm alanları doldur
- JSON'ın dışında hiçbir metin ekleme
`;

    const result = await model.generateContent([
      {
        inlineData: {
          data: pdfBuffer.toString('base64'),
          mimeType: 'application/pdf'
        }
      },
      prompt
    ]);

    const responseText = result.response.text();

    console.log("Gemini raw response:", responseText.substring(0, 500));

    // JSON'ı markdown kod bloklarından temizle
    let jsonText = responseText.trim();

    // ```json veya ``` ile başlıyorsa temizle
    jsonText = jsonText.replace(/^```json\s*/i, '');
    jsonText = jsonText.replace(/^```\s*/, '');
    jsonText = jsonText.replace(/\s*```$/g, '');
    jsonText = jsonText.trim();

    // JSON objesini bul (regex ile)
    const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("JSON bulunamadı. Tam yanıt:", responseText);
      throw new Error("Gemini yanıtında geçerli JSON bulunamadı");
    }

    jsonText = jsonMatch[0];

    // JSON parse et
    let cvData: CVData;
    try {
      cvData = JSON.parse(jsonText) as CVData;
    } catch (parseError) {
      console.error("JSON parse hatası:", parseError);
      console.error("Parse edilmeye çalışılan text:", jsonText.substring(0, 500));
      throw new Error("JSON parse edilemedi: " + (parseError instanceof Error ? parseError.message : "Bilinmeyen hata"));
    }

    // Temel validasyon
    if (!cvData.personalInfo || !cvData.personalInfo.name) {
      throw new Error("CV'den kişisel bilgiler çıkarılamadı");
    }

    // Varsayılan değerler
    cvData.experience = cvData.experience || [];
    cvData.education = cvData.education || [];
    cvData.skills = cvData.skills || [];
    cvData.languages = cvData.languages || [];

    return cvData;
  } catch (error) {
    console.error("PDF parsing error:", error);

    if (error instanceof SyntaxError) {
      throw new Error("Gemini'den gelen yanıt JSON formatında değil");
    }

    throw new Error(
      `CV analizi başarısız: ${error instanceof Error ? error.message : "Bilinmeyen hata"}`
    );
  }
}

/**
 * URL'den PDF dosyasını indirir ve analiz eder
 * @param pdfUrl PDF dosyasının URL'i
 * @returns CVData nesnesi
 */
export async function parseCVFromURL(pdfUrl: string): Promise<CVData> {
  try {
    const response = await fetch(pdfUrl);

    if (!response.ok) {
      throw new Error(`PDF indirilemedi: ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return await parseCVFromPDF(buffer);
  } catch (error) {
    console.error("PDF download error:", error);
    throw new Error(
      `PDF indirme ve analiz başarısız: ${error instanceof Error ? error.message : "Bilinmeyen hata"}`
    );
  }
}
