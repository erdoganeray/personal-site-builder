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
  deployedUrl?: string | null;
  cloudflareUrl?: string | null;
}

interface RevisionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (request: string) => void;
  isLoading: boolean;
}

function RevisionModal({ isOpen, onClose, onSubmit, isLoading }: RevisionModalProps) {
  const [revisionRequest, setRevisionRequest] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (revisionRequest.trim()) {
      onSubmit(revisionRequest);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Revize İsteği</h2>
            <button
              onClick={onClose}
              disabled={isLoading}
              className="text-gray-500 hover:text-gray-700 disabled:opacity-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ne değiştirmek istersiniz?
              </label>
              <textarea
                value={revisionRequest}
                onChange={(e) => setRevisionRequest(e.target.value)}
                disabled={isLoading}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                rows={6}
                placeholder="Örnek: Renkleri daha canlı yap, başlığı büyüt, iletişim bölümünü aşağı al..."
                required
              />
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <div className="flex items-start gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div className="text-sm text-yellow-800">
                  <p className="font-medium mb-1">Önemli Bilgi:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Revize işlemi 30-60 saniye sürebilir</li>
                    <li>Revize hakkınız bir kez kullanılacak</li>
                    <li>Yapay zeka isteğinizi anlamaya çalışacak</li>
                    <li>Mevcut bilgileriniz korunacak</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                İptal
              </button>
              <button
                type="submit"
                disabled={isLoading || !revisionRequest.trim()}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                    <span>Revize Ediliyor...</span>
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Revize Et</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function PreviewPage({ params }: { params: Promise<{ siteId: string }> }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [site, setSite] = useState<Site | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deviceView, setDeviceView] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isRevisionModalOpen, setIsRevisionModalOpen] = useState(false);
  const [isRevising, setIsRevising] = useState(false);
  const [revisionMessage, setRevisionMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [publishing, setPublishing] = useState(false);
  const [unpublishing, setUnpublishing] = useState(false);
  
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

  const handleRevisionSubmit = async (revisionRequest: string) => {
    setIsRevising(true);
    setRevisionMessage(null);

    try {
      const response = await fetch("/api/site/revise", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          siteId,
          revisionRequest,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Revize işlemi başarısız oldu");
      }

      // Başarılı revize
      setRevisionMessage({
        type: 'success',
        text: `Revize başarılı! ${data.changes || 'Site güncellendi.'}`,
      });
      
      // Modal'ı kapat
      setIsRevisionModalOpen(false);
      
      // Site'ı yeniden yükle
      await fetchSite();

    } catch (err) {
      console.error("Revize hatası:", err);
      setRevisionMessage({
        type: 'error',
        text: err instanceof Error ? err.message : "Revize işlemi başarısız oldu",
      });
    } finally {
      setIsRevising(false);
    }
  };

  const handlePublish = async () => {
    if (!site) return;

    if (!confirm("Sitenizi yayınlamak istediğinizden emin misiniz? Bu işlem sitenizi Cloudflare'de canlıya alacak.")) {
      return;
    }

    setPublishing(true);
    setRevisionMessage(null);

    try {
      const response = await fetch("/api/site/publish", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          siteId: site.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Site yayınlanamadı");
      }

      // Başarılı yayınlama
      setRevisionMessage({
        type: 'success',
        text: `Site başarıyla yayınlandı! URL: ${data.deployedUrl}`,
      });
      
      // Site'ı yeniden yükle
      await fetchSite();

      // Kullanıcıya yayınlanan siteyi göster
      setTimeout(() => {
        window.open(data.deployedUrl, '_blank');
      }, 1500);

    } catch (err) {
      console.error("Yayınlama hatası:", err);
      setRevisionMessage({
        type: 'error',
        text: err instanceof Error ? err.message : "Site yayınlanamadı",
      });
    } finally {
      setPublishing(false);
    }
  };

  const handleUnpublish = async () => {
    if (!site) return;

    if (!confirm("Sitenizi yayından kaldırmak istediğinizden emin misiniz? Site artık canlıda olmayacak.")) {
      return;
    }

    setUnpublishing(true);
    setRevisionMessage(null);

    try {
      const response = await fetch("/api/site/unpublish", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          siteId: site.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Site yayından kaldırılamadı");
      }

      // Başarılı
      setRevisionMessage({
        type: 'success',
        text: "Site yayından kaldırıldı!",
      });
      
      // Site'ı yeniden yükle
      await fetchSite();

    } catch (err) {
      console.error("Yayından kaldırma hatası:", err);
      setRevisionMessage({
        type: 'error',
        text: err instanceof Error ? err.message : "Site yayından kaldırılamadı",
      });
    } finally {
      setUnpublishing(false);
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
                  onClick={() => setIsRevisionModalOpen(true)}
                  className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition duration-200 flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <span>Revize İste ({site.maxRevisions - site.revisionCount} hak)</span>
                </button>
              )}

              {site.status !== 'published' ? (
                <button
                  onClick={handlePublish}
                  disabled={publishing}
                  className="px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg transition duration-200 flex items-center gap-2 font-medium disabled:cursor-not-allowed"
                >
                  {publishing ? (
                    <>
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Yayınlanıyor...</span>
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Beğendim, Yayınla!</span>
                    </>
                  )}
                </button>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="px-4 py-2 bg-green-100 border border-green-300 text-green-800 rounded-lg flex items-center gap-2 font-medium">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Yayında</span>
                  </div>
                  {(site.deployedUrl || site.cloudflareUrl) && (
                    <a
                      href={site.deployedUrl || site.cloudflareUrl || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition duration-200 flex items-center gap-2 font-medium"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      <span>Siteyi Aç</span>
                    </a>
                  )}
                  <button
                    onClick={handleUnpublish}
                    disabled={unpublishing}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white rounded-lg transition duration-200 flex items-center gap-2 font-medium disabled:cursor-not-allowed"
                  >
                    {unpublishing ? (
                      <>
                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Kaldırılıyor...</span>
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                        </svg>
                        <span>Yayından Kaldır</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Preview Content */}
      <div className="max-w-7xl mx-auto p-6">
        {/* Revize Mesajı */}
        {revisionMessage && (
          <div className={`mb-6 rounded-lg p-4 ${
            revisionMessage.type === 'success' 
              ? 'bg-green-50 border border-green-200' 
              : 'bg-red-50 border border-red-200'
          }`}>
            <div className="flex items-start gap-3">
              {revisionMessage.type === 'success' ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              <div className="flex-1">
                <p className={`text-sm font-medium ${
                  revisionMessage.type === 'success' ? 'text-green-900' : 'text-red-900'
                }`}>
                  {revisionMessage.text}
                </p>
              </div>
              <button
                onClick={() => setRevisionMessage(null)}
                className={`${
                  revisionMessage.type === 'success' ? 'text-green-600 hover:text-green-800' : 'text-red-600 hover:text-red-800'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Device Selector (Optional) */}
          <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 flex items-center justify-center gap-2">
            <span className="text-sm text-gray-600">Önizleme:</span>
            <div className="flex gap-2">
              <button 
                onClick={() => setDeviceView('desktop')}
                className={`px-3 py-1 text-xs rounded transition duration-200 ${
                  deviceView === 'desktop' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Desktop
              </button>
              <button 
                onClick={() => setDeviceView('tablet')}
                className={`px-3 py-1 text-xs rounded transition duration-200 ${
                  deviceView === 'tablet' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Tablet
              </button>
              <button 
                onClick={() => setDeviceView('mobile')}
                className={`px-3 py-1 text-xs rounded transition duration-200 ${
                  deviceView === 'mobile' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Mobile
              </button>
            </div>
          </div>

          {/* iframe with generated HTML */}
          <div className="relative bg-gray-100 flex justify-center items-start p-6" style={{ minHeight: '800px' }}>
            <div 
              className="bg-white shadow-2xl transition-all duration-300 ease-in-out"
              style={{
                width: deviceView === 'desktop' ? '100%' : deviceView === 'tablet' ? '768px' : '375px',
                height: '800px',
                maxWidth: '100%'
              }}
            >
              <iframe
                src={iframeUrl}
                className="w-full h-full border-0"
                title="Site Preview"
                sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
              />
            </div>
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

      {/* Revize Modal */}
      <RevisionModal
        isOpen={isRevisionModalOpen}
        onClose={() => setIsRevisionModalOpen(false)}
        onSubmit={handleRevisionSubmit}
        isLoading={isRevising}
      />
    </div>
  );
}
