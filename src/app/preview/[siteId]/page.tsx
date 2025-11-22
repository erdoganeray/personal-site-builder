"use client";

import { use, useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface Site {
  id: string;
  title: string;
  htmlContent: string | null;
  status: string;
  revisionCount: number;
  maxRevisions: number;
}

export default function PreviewPage({ params }: { params: Promise<{ siteId: string }> }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [site, setSite] = useState<Site | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Unwrap params Promise
  const { siteId } = use(params);

  // Blob URL oluştur - site htmlContent değiştiğinde güncellenir
  const iframeUrl = useMemo(() => {
    if (!site?.htmlContent) return '';
    
    const blob = new Blob([site.htmlContent], { type: 'text/html' });
    return URL.createObjectURL(blob);
  }, [site?.htmlContent]);

  // Cleanup - component unmount olduğunda blob URL'i temizle
  useEffect(() => {
    return () => {
      if (iframeUrl) {
        URL.revokeObjectURL(iframeUrl);
      }
    };
  }, [iframeUrl]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (status === "authenticated") {
      fetchSite();
    }
  }, [status, siteId]);

  const fetchSite = async () => {
    try {
      // Önce site'ı database'den çek
      const listResponse = await fetch("/api/site/list");
      if (!listResponse.ok) {
        setError("Site yüklenemedi");
        setLoading(false);
        return;
      }

      const listData = await listResponse.json();
      const foundSite = listData.sites?.find((s: any) => s.id === siteId);
      
      if (!foundSite) {
        setError("Site bulunamadı");
        setLoading(false);
        return;
      }

      // Eğer site'ın HTML içeriği yoksa, generate et
      if (!foundSite.htmlContent) {
        setError("Site henüz oluşturulmamış. Lütfen dashboard'dan site oluşturun.");
        setLoading(false);
        return;
      }

      // Site'ı set et
      setSite(foundSite);
    } catch (err) {
      console.error("Site yükleme hatası:", err);
      setError("Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white text-xl">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error || !site) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="bg-red-500 bg-opacity-10 border border-red-500 rounded-lg p-8 max-w-md">
          <h2 className="text-red-500 text-2xl font-bold mb-4">Hata</h2>
          <p className="text-white mb-4">{error || "Site bulunamadı"}</p>
          <button
            onClick={() => router.push("/dashboard")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition duration-200"
          >
            Dashboard'a Dön
          </button>
        </div>
      </div>
    );
  }

  if (!site.htmlContent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="bg-yellow-500 bg-opacity-10 border border-yellow-500 rounded-lg p-8 max-w-md">
          <h2 className="text-yellow-500 text-2xl font-bold mb-4">Site Henüz Oluşturulmamış</h2>
          <p className="text-white mb-4">Bu site için henüz HTML içeriği oluşturulmamış.</p>
          <button
            onClick={() => router.push("/dashboard")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition duration-200"
          >
            Dashboard'a Dön
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Preview Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push("/dashboard")}
                className="text-gray-600 hover:text-gray-900 flex items-center gap-2 transition duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>Dashboard</span>
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-lg font-semibold text-gray-900">{site.title}</h1>
              <span className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                Preview
              </span>
            </div>

            <div className="flex items-center gap-3">
              {site.revisionCount < site.maxRevisions && (
                <button
                  onClick={() => {
                    // TODO: Revize sayfasına yönlendir
                    alert("Revize özelliği yakında eklenecek!");
                  }}
                  className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition duration-200 flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <span>Revize İste ({site.maxRevisions - site.revisionCount} hak)</span>
                </button>
              )}

              <button
                onClick={() => {
                  // TODO: Yayınlama işlemi
                  alert("Yayınlama özelliği yakında eklenecek!");
                }}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition duration-200 flex items-center gap-2 font-medium"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Beğendim, Yayınla!</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Content */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Device Selector (Optional) */}
          <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 flex items-center justify-center gap-2">
            <span className="text-sm text-gray-600">Önizleme:</span>
            <div className="flex gap-2">
              <button className="px-3 py-1 text-xs bg-blue-600 text-white rounded">
                Desktop
              </button>
              <button className="px-3 py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300">
                Tablet
              </button>
              <button className="px-3 py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300">
                Mobile
              </button>
            </div>
          </div>

          {/* iframe with generated HTML */}
          <div className="relative bg-white" style={{ height: '800px', overflow: 'auto' }}>
            <iframe
              src={iframeUrl}
              className="w-full border-0"
              style={{ height: '100%', minHeight: '800px', display: 'block' }}
              title="Site Preview"
              sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
            />
          </div>
        </div>

        {/* Info Footer */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-blue-900 mb-1">Önizleme Hakkında</h3>
              <p className="text-sm text-blue-800">
                Bu sitenizin önizlemesidir. Eğer beğendiyseniz "Yayınla" butonuna tıklayarak
                sitenizi canlıya alabilirsiniz. Değişiklik yapmak isterseniz{" "}
                {site.revisionCount < site.maxRevisions ? (
                  <span className="font-medium">
                    "Revize İste" butonunu kullanabilirsiniz (kalan: {site.maxRevisions - site.revisionCount})
                  </span>
                ) : (
                  <span className="font-medium text-red-600">
                    revize hakkınız kalmadı
                  </span>
                )}.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
