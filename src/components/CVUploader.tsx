"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { CVData } from "@/lib/gemini-pdf-parser";

interface CVUploaderProps {
  onAnalyzed?: (cvData: CVData, siteId: string) => void;
}

export default function CVUploader({ onAnalyzed }: CVUploaderProps) {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [cvData, setCvData] = useState<CVData | null>(null);
  const [siteId, setSiteId] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== "application/pdf") {
        setError("Lütfen sadece PDF dosyası yükleyin");
        return;
      }
      if (selectedFile.size > 4 * 1024 * 1024) {
        setError("Dosya boyutu 4MB'dan küçük olmalıdır");
        return;
      }
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Lütfen bir dosya seçin");
      return;
    }

    setUploading(true);
    setProgress(0);
    setError(null);

    try {
      // FormData oluştur
      const formData = new FormData();
      formData.append("file", file);

      // R2'ye yükle
      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json();
        throw new Error(errorData.error || "Yükleme başarısız oldu");
      }

      const uploadData = await uploadResponse.json();
      console.log("Upload başarılı:", uploadData.url);

      setProgress(100);
      setUploading(false);

      // CV'yi analiz et
      createSiteAndAnalyzeCV(uploadData.url);
    } catch (err) {
      console.error("Upload hatası:", err);
      setError(err instanceof Error ? err.message : "Yükleme başarısız oldu");
      setUploading(false);
    }
  };

  const saveSite = async (cvUrl: string) => {
    try {
      const response = await fetch("/api/site/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cvUrl }),
      });

      const data = await response.json();

      if (response.ok) {
        return data.siteId;
      } else {
        throw new Error(data.error || "Site kaydı oluşturulamadı");
      }
    } catch (err) {
      console.error("Site kaydetme hatası:", err);
      throw err;
    }
  };

  const analyzeCV = async (cvUrl: string, siteId: string) => {
    try {
      const response = await fetch("/api/cv/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cvUrl, siteId }),
      });

      const result = await response.json();

      if (result.success) {
        return result.data;
      } else {
        throw new Error(result.error || "CV analizi başarısız oldu");
      }
    } catch (err) {
      console.error("CV analiz hatası:", err);
      throw err;
    }
  };

  const createSiteAndAnalyzeCV = async (cvUrl: string) => {
    setAnalyzing(true);
    setError(null);

    try {
      // Önce site kaydını oluştur
      const newSiteId = await saveSite(cvUrl);
      setSiteId(newSiteId);

      // Sonra CV'yi analiz et
      const analyzedData = await analyzeCV(cvUrl, newSiteId);
      setCvData(analyzedData);

      // Parent component'e bildir
      if (onAnalyzed) {
        onAnalyzed(analyzedData, newSiteId);
      }

      setAnalyzing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu");
      setAnalyzing(false);
    }
  };

  return (
    <div className="bg-[#111]/80 backdrop-blur-xl rounded-2xl border border-white/10 p-8 hover:border-purple-500/30 transition-all">
      <h2 className="text-2xl font-bold mb-2 text-white flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500"></span>
        CV Yükle
      </h2>
      <p className="text-gray-400 mb-6">
        PDF formatında CV'nizi yükleyin ve AI ile kişisel web sitenizi oluşturun
      </p>

      {!cvData ? (
        <div className="space-y-4">
          {/* File Input */}
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="dropzone-file"
              className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-2xl cursor-pointer bg-white/5 hover:bg-white/10 border-white/10 hover:border-purple-500/30 transition-all duration-300"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg
                  className="w-10 h-10 mb-4 text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 16"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                  />
                </svg>
                <p className="mb-2 text-sm text-gray-400">
                  <span className="font-semibold text-white">Dosya seçmek için tıklayın</span>
                </p>
                <p className="text-xs text-gray-500">
                  PDF (MAX. 4MB)
                </p>
                {file && (
                  <p className="mt-3 text-sm text-green-400 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    {file.name}
                  </p>
                )}
              </div>
              <input
                id="dropzone-file"
                type="file"
                className="hidden"
                accept=".pdf"
                onChange={handleFileChange}
                disabled={uploading || analyzing}
              />
            </label>
          </div>

          {/* Progress Bar */}
          {(uploading || analyzing) && (
            <div className="w-full">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-300">
                  {uploading ? "Yükleniyor..." : "CV analiz ediliyor..."}
                </span>
                <span className="text-sm font-medium text-gray-300">
                  {uploading ? `${progress}%` : ""}
                </span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2.5 overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-300 ${analyzing ? "animate-pulse" : ""
                    }`}
                  style={{ width: uploading ? `${progress}%` : "100%" }}
                ></div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-4 text-sm text-red-400 rounded-xl bg-red-500/10 border border-red-500/20">
              {error}
            </div>
          )}

          {/* Upload Button */}
          <button
            onClick={handleUpload}
            disabled={!file || uploading || analyzing}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold py-3.5 px-4 rounded-xl transition-all duration-200 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30"
          >
            {uploading
              ? "Yükleniyor..."
              : analyzing
                ? "Analiz ediliyor..."
                : "CV'yi Yükle ve Analiz Et"}
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Success Message */}
          <div className="p-4 text-sm text-green-400 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            CV başarıyla analiz edildi!
          </div>

          {/* CV Data Display */}
          <div className="space-y-4">
            {/* Personal Info */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                Kişisel Bilgiler
              </h3>
              <div className="space-y-2 text-sm">
                <p className="text-gray-300">
                  <strong className="text-white">Ad Soyad:</strong> {cvData.personalInfo.name}
                </p>
                {cvData.personalInfo.title && (
                  <p className="text-gray-300">
                    <strong className="text-white">Ünvan:</strong> {cvData.personalInfo.title}
                  </p>
                )}
                {cvData.personalInfo.email && (
                  <p className="text-gray-300">
                    <strong className="text-white">Email:</strong> {cvData.personalInfo.email}
                  </p>
                )}
                {cvData.personalInfo.phone && (
                  <p className="text-gray-300">
                    <strong className="text-white">Telefon:</strong> {cvData.personalInfo.phone}
                  </p>
                )}
                {cvData.personalInfo.location && (
                  <p className="text-gray-300">
                    <strong className="text-white">Konum:</strong> {cvData.personalInfo.location}
                  </p>
                )}
              </div>
            </div>

            {/* Summary */}
            {cvData.summary && (
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                  Özet
                </h3>
                <p className="text-sm text-gray-300">
                  {cvData.summary}
                </p>
              </div>
            )}

            {/* Experience */}
            {cvData.experience.length > 0 && (
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                  İş Deneyimi ({cvData.experience.length})
                </h3>
                <div className="space-y-3">
                  {cvData.experience.map((exp, index) => (
                    <div key={index} className="text-sm">
                      <p className="font-medium text-white">
                        {exp.position} - {exp.company}
                      </p>
                      <p className="text-gray-400">
                        {exp.duration}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {cvData.education.length > 0 && (
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                  Eğitim ({cvData.education.length})
                </h3>
                <div className="space-y-3">
                  {cvData.education.map((edu, index) => (
                    <div key={index} className="text-sm">
                      <p className="font-medium text-white">
                        {edu.degree} - {edu.field}
                      </p>
                      <p className="text-gray-400">
                        {edu.school} ({edu.year})
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skills */}
            {cvData.skills.length > 0 && (
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                  Yetenekler
                </h3>
                <div className="flex flex-wrap gap-2">
                  {cvData.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 text-sm bg-purple-500/20 text-purple-300 rounded-full border border-purple-500/30"
                    >
                      {typeof skill === 'string' ? skill : skill.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Languages */}
            {cvData.languages.length > 0 && (
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                  Diller
                </h3>
                <div className="flex flex-wrap gap-2">
                  {cvData.languages.map((lang, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 text-sm bg-green-500/20 text-green-300 rounded-full border border-green-500/30"
                    >
                      {typeof lang === 'string' ? lang : lang.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => {
                if (siteId) {
                  router.push(`/dashboard`);
                  router.refresh();
                }
              }}
              className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 shadow-lg shadow-green-500/20"
            >
              Site Oluşturmaya Devam Et →
            </button>
            <button
              onClick={() => {
                setCvData(null);
                setFile(null);
                setSiteId(null);
                setError(null);
              }}
              className="px-4 py-3 bg-white/10 hover:bg-white/20 border border-white/10 text-white rounded-xl transition-colors duration-200"
            >
              Yeni CV Yükle
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
