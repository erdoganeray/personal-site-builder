"use client";

import { useUploadThing } from "@/lib/uploadthing";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CVUploader() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const { startUpload } = useUploadThing("pdfUploader", {
    onClientUploadComplete: (res) => {
      console.log("Upload başarılı:", res);
      setProgress(100);
      setUploading(false);
      
      // Site kaydını oluştur
      if (res && res[0]) {
        saveSite(res[0].url);
      }
    },
    onUploadError: (error: Error) => {
      console.error("Upload hatası:", error);
      setError(error.message);
      setUploading(false);
    },
    onUploadProgress: (p) => {
      setProgress(p);
    },
  });

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
    setError(null);

    try {
      await startUpload([file]);
    } catch (err) {
      setError("Yükleme başarısız oldu");
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

      if (response.ok) {
        const data = await response.json();
        router.push(`/dashboard`);
        router.refresh();
      } else {
        setError("Site kaydı oluşturulamadı");
      }
    } catch (err) {
      setError("Bir hata oluştu");
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
              disabled={uploading}
            />
          </label>
        </div>

        {/* Progress Bar */}
        {uploading && (
          <div className="w-full">
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Yükleniyor...
              </span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {progress}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
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
          disabled={!file || uploading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
        >
          {uploading ? "Yükleniyor..." : "CV'yi Yükle"}
        </button>
      </div>
    </div>
  );
}
