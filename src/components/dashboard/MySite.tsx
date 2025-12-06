"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";

interface MySiteProps {
    site: any;
    onRefresh: () => void;
}

export default function MySite({ site, onRefresh }: MySiteProps) {
    const router = useRouter();
    const [generating, setGenerating] = useState(false);
    const [publishing, setPublishing] = useState(false);
    const [unpublishing, setUnpublishing] = useState(false);
    const [deletingPreview, setDeletingPreview] = useState(false);
    const [customPrompt, setCustomPrompt] = useState("");
    const [viewMode, setViewMode] = useState<"desktop" | "tablet" | "mobile">("desktop");

    // Blob URL oluştur - site htmlContent, cssContent, jsContent değiştiğinde güncellenir
    const iframeUrl = useMemo(() => {
        if (!site?.htmlContent) return '';

        // HTML'in içine CSS ve JS'i inject et
        let fullHtml = site.htmlContent;

        // CSS'i <head> içine ekle (eğer varsa)
        if (site.cssContent) {
            const styleTag = `<style>${site.cssContent}</style>`;
            // </head> etiketinden önce ekle
            if (fullHtml.includes('</head>')) {
                fullHtml = fullHtml.replace('</head>', `${styleTag}\n</head>`);
            } else {
                // head yoksa en başa ekle
                fullHtml = styleTag + fullHtml;
            }
        }

        // JS'i <body> sonuna ekle (eğer varsa)
        if (site.jsContent) {
            const scriptTag = `<script>${site.jsContent}</script>`;
            // </body> etiketinden önce ekle
            if (fullHtml.includes('</body>')) {
                fullHtml = fullHtml.replace('</body>', `${scriptTag}\n</body>`);
            } else {
                // body yoksa en sona ekle
                fullHtml = fullHtml + scriptTag;
            }
        }

        const blob = new Blob([fullHtml], { type: 'text/html' });
        return URL.createObjectURL(blob);
    }, [site?.htmlContent, site?.cssContent, site?.jsContent]);

    // Cleanup - component unmount olduğunda blob URL'i temizle
    useEffect(() => {
        return () => {
            if (iframeUrl) {
                URL.revokeObjectURL(iframeUrl);
            }
        };
    }, [iframeUrl]);

    const handleGenerateSite = async () => {
        if (!site) {
            alert("Lütfen önce CV yükleyin");
            return;
        }

        setGenerating(true);
        try {
            const response = await fetch("/api/site/generate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    siteId: site.id,
                    customPrompt: customPrompt.trim() || undefined,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                onRefresh();
                alert("Site başarıyla oluşturuldu!");
            } else {
                alert(data.error || "Site oluşturulamadı. Lütfen tekrar deneyin.");
            }
        } catch (error) {
            console.error("Site oluşturma hatası:", error);
            alert("Bir hata oluştu. Lütfen tekrar deneyin.");
        } finally {
            setGenerating(false);
        }
    };

    const handlePublish = async () => {
        if (!site) return;

        if (!site.htmlContent) {
            alert("Lütfen önce sitenizi oluşturun!");
            return;
        }

        if (!confirm("Sitenizi yayınlamak istediğinizden emin misiniz?")) {
            return;
        }

        setPublishing(true);
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

            if (response.ok) {
                alert(`Site başarıyla yayınlandı!\nURL: ${data.deployedUrl}`);
                onRefresh();
                window.open(data.deployedUrl, "_blank");
            } else {
                alert(data.error || "Site yayınlanamadı");
            }
        } catch (error) {
            console.error("Yayınlama hatası:", error);
            alert("Bir hata oluştu. Lütfen tekrar deneyin.");
        } finally {
            setPublishing(false);
        }
    };

    const handleUnpublish = async () => {
        if (!site) return;

        if (!confirm("Sitenizi yayından kaldırmak istediğinizden emin misiniz?")) {
            return;
        }

        setUnpublishing(true);
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

            if (response.ok) {
                alert("Site yayından kaldırıldı!");
                onRefresh();
            } else {
                alert(data.error || "Site yayından kaldırılamadı");
            }
        } catch (error) {
            console.error("Yayından kaldırma hatası:", error);
            alert("Bir hata oluştu. Lütfen tekrar deneyin.");
        } finally {
            setUnpublishing(false);
        }
    };

    const handleDeletePreview = async () => {
        if (!site) return;

        if (!confirm("Önizleme sitesini silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.")) {
            return;
        }

        setDeletingPreview(true);
        try {
            const response = await fetch(`/api/site/delete-preview?id=${site.id}`, {
                method: "DELETE",
            });

            const data = await response.json();

            if (response.ok) {
                alert("Önizleme sitesi başarıyla silindi!");
                onRefresh();
            } else {
                alert(data.error || "Önizleme silinemedi");
            }
        } catch (error) {
            console.error("Silme hatası:", error);
            alert("Bir hata oluştu. Lütfen tekrar deneyin.");
        } finally {
            setDeletingPreview(false);
        }
    };

    if (!site) {
        return (
            <div className="space-y-6">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Sitem</h2>
                    <p className="text-gray-400">Site bilgileriniz burada görüntülenecek</p>
                </div>
                <div className="bg-gray-800 rounded-xl border border-gray-700 p-8 text-center">
                    <p className="text-gray-400">Henüz bir siteniz yok. Lütfen önce CV yükleyin.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-white mb-2">Sitem</h2>
                <p className="text-gray-400">Site durumunuzu görüntüleyin ve yönetin</p>
            </div>

            {/* Site Status */}
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
                <h3 className="text-xl font-bold text-white mb-4">Site Durumu</h3>
                <div className="flex items-center gap-3 mb-4 flex-wrap">
                    <div
                        className={`px-4 py-2 rounded-full font-semibold ${site.status === "published"
                            ? "bg-green-600 text-white"
                            : "bg-yellow-600 text-white"
                            }`}
                    >
                        {site.status === "published" ? "✓ Yayında" : "○ Yayında Değil"}
                    </div>
                    {site.htmlContent && (
                        <>
                            <div className="px-4 py-2 bg-blue-600 text-white rounded-full font-semibold">
                                ✓ Site Oluşturuldu
                            </div>
                            {site.status !== "published" && (
                                <button
                                    onClick={handleDeletePreview}
                                    disabled={deletingPreview}
                                    className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white rounded-full font-semibold transition-colors duration-200"
                                >
                                    {deletingPreview ? "Siliniyor..." : "Ön İzlemeyi Sil"}
                                </button>
                            )}
                        </>
                    )}
                </div>

                {site.status === "published" && (site.deployedUrl || site.cloudflareUrl) && (
                    <div className="bg-green-900/30 border border-green-700 rounded-lg p-4 mb-4">
                        <p className="text-sm font-medium text-green-300 mb-2">Site URL:</p>
                        <a
                            href={site.deployedUrl || site.cloudflareUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-green-400 hover:text-green-300 underline break-all"
                        >
                            {site.deployedUrl || site.cloudflareUrl}
                        </a>
                    </div>
                )}
            </div>

            {/* Preview Section */}
            {site.htmlContent && (
                <div className="bg-gray-800 rounded-xl border border-gray-700 p-3">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-xl font-bold text-white">Site Önizleme</h3>
                        <div className="flex items-center gap-2 bg-gray-700 rounded-lg p-1">
                            <button
                                onClick={() => setViewMode("desktop")}
                                className={`px-3 py-1 rounded transition-colors ${viewMode === "desktop"
                                    ? "bg-blue-600 text-white"
                                    : "text-gray-400 hover:text-white"
                                    }`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </button>
                            <button
                                onClick={() => setViewMode("tablet")}
                                className={`px-3 py-1 rounded transition-colors ${viewMode === "tablet"
                                    ? "bg-blue-600 text-white"
                                    : "text-gray-400 hover:text-white"
                                    }`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                </svg>
                            </button>
                            <button
                                onClick={() => setViewMode("mobile")}
                                className={`px-3 py-1 rounded transition-colors ${viewMode === "mobile"
                                    ? "bg-blue-600 text-white"
                                    : "text-gray-400 hover:text-white"
                                    }`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div className="flex justify-center bg-gray-900 rounded-lg">
                        <div
                            className={`bg-white rounded shadow-xl transition-all duration-300 ${viewMode === "desktop"
                                ? "w-full h-[800px]"
                                : viewMode === "tablet"
                                    ? "w-2/3 h-[800px]"
                                    : "w-1/3 h-[800px]"
                                }`}
                        >
                            <iframe
                                src={iframeUrl}
                                className="w-full h-full rounded"
                                title="Site Preview"
                                sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Custom Prompt - Sadece site henüz oluşturulmamışsa göster */}
            {!site.htmlContent && (
                <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
                    <h3 className="text-xl font-bold text-white mb-3">
                        Özel Tasarım İstekleri
                    </h3>
                    <p className="text-sm text-gray-400 mb-3">
                        AI'ya sitenizin nasıl görünmesini istediğinizi anlatın.
                    </p>
                    <textarea
                        placeholder="Örnek: Modern ve minimalist bir tasarım, mor-mavi renk paleti..."
                        value={customPrompt}
                        onChange={(e) => setCustomPrompt(e.target.value)}
                        rows={4}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
                {site.htmlContent ? (
                    <>
                        {/* Site oluşturulmuş ama yayınlanmamış */}
                        {site.status !== "published" && (
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={handlePublish}
                                    disabled={publishing}
                                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-4 px-6 rounded-lg transition-all duration-200"
                                >
                                    {publishing ? "Yayınlanıyor..." : "Beğendim, Yayınla!"}
                                </button>
                                <button
                                    onClick={() => router.push("/editor")}
                                    className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-4 px-6 rounded-lg transition-colors duration-200"
                                >
                                    Editöre Git
                                </button>
                            </div>
                        )}

                        {/* Site yayınlanmış */}
                        {site.status === "published" && (
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={handleUnpublish}
                                    disabled={unpublishing}
                                    className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-bold py-4 px-6 rounded-lg transition-colors duration-200"
                                >
                                    {unpublishing ? "Kaldırılıyor..." : "Yayından Kaldır"}
                                </button>
                                <button
                                    onClick={() => router.push("/editor")}
                                    className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-4 px-6 rounded-lg transition-colors duration-200"
                                >
                                    Editöre Git
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <button
                        onClick={handleGenerateSite}
                        disabled={generating}
                        className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-4 px-6 rounded-lg transition-all duration-200"
                    >
                        {generating ? "AI ile siteniz oluşturuluyor..." : "AI ile Sitemi Oluştur →"}
                    </button>
                )}
            </div>
        </div>
    );
}
