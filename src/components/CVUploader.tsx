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
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
        CV Yükle
      </h2>
      <p className="text-gray-600 dark:text-gray-300 mb-6">
        PDF formatında CV'nizi yükleyin ve AI ile kişisel web sitenizi oluşturun
      </p>

      {!cvData ? (
        <div className="space-y-4">
          {/* File Input */}
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="dropzone-file"
              className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-800 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg
                  className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
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
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Dosya seçmek için tıklayın</span>
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  PDF (MAX. 4MB)
                </p>
                {file && (
                  <p className="mt-2 text-sm text-green-600 dark:text-green-400">
                    ✓ {file.name}
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
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {uploading ? "Yükleniyor..." : "CV analiz ediliyor..."}
                </span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {uploading ? `${progress}%` : ""}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div
                  className={`${
                    analyzing ? "bg-purple-600" : "bg-blue-600"
                  } h-2.5 rounded-full transition-all duration-300 ${
                    analyzing ? "animate-pulse" : ""
                  }`}
                  style={{ width: uploading ? `${progress}%` : "100%" }}
                ></div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400">
              {error}
            </div>
          )}

          {/* Upload Button */}
          <button
            onClick={handleUpload}
            disabled={!file || uploading || analyzing}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
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
          <div className="p-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400">
            ✓ CV başarıyla analiz edildi!
          </div>

          {/* CV Data Display */}
          <div className="space-y-4">
            {/* Personal Info */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Kişisel Bilgiler
              </h3>
              <div className="space-y-2 text-sm">
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>Ad Soyad:</strong> {cvData.personalInfo.name}
                </p>
                {cvData.personalInfo.title && (
                  <p className="text-gray-700 dark:text-gray-300">
                    <strong>Ünvan:</strong> {cvData.personalInfo.title}
                  </p>
                )}
                {cvData.personalInfo.email && (
                  <p className="text-gray-700 dark:text-gray-300">
                    <strong>Email:</strong> {cvData.personalInfo.email}
                  </p>
                )}
                {cvData.personalInfo.phone && (
                  <p className="text-gray-700 dark:text-gray-300">
                    <strong>Telefon:</strong> {cvData.personalInfo.phone}
                  </p>
                )}
                {cvData.personalInfo.location && (
                  <p className="text-gray-700 dark:text-gray-300">
                    <strong>Konum:</strong> {cvData.personalInfo.location}
                  </p>
                )}
              </div>
            </div>

            {/* Summary */}
            {cvData.summary && (
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Özet
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {cvData.summary}
                </p>
              </div>
            )}

            {/* Experience */}
            {cvData.experience.length > 0 && (
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  İş Deneyimi ({cvData.experience.length})
                </h3>
                <div className="space-y-3">
                  {cvData.experience.map((exp, index) => (
                    <div key={index} className="text-sm">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {exp.position} - {exp.company}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        {exp.duration}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {cvData.education.length > 0 && (
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Eğitim ({cvData.education.length})
                </h3>
                <div className="space-y-3">
                  {cvData.education.map((edu, index) => (
                    <div key={index} className="text-sm">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {edu.degree} - {edu.field}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        {edu.school} ({edu.year})
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skills */}
            {cvData.skills.length > 0 && (
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Yetenekler
                </h3>
                <div className="flex flex-wrap gap-2">
                  {cvData.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Languages */}
            {cvData.languages.length > 0 && (
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Diller
                </h3>
                <div className="flex flex-wrap gap-2">
                  {cvData.languages.map((lang, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 text-sm bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full"
                    >
                      {lang}
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
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
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
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              Yeni CV Yükle
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
