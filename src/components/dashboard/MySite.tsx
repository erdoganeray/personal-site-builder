"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { hasUnpublishedChanges } from "@/lib/change-detection";
import { convertRelativeAssetsToAbsolute } from "@/lib/iframe-utils";
import { toast } from "@/components/ui/Toast";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

interface SubscriptionUsage {
    edits: {
        remaining: number;
        limit: number;
    };
}

interface MySiteProps {
    site: any;
    onRefresh: () => void;
}

export default function MySite({ site, onRefresh }: MySiteProps) {
    const router = useRouter();
    const [generating, setGenerating] = useState(false);
    const [deletingPreview, setDeletingPreview] = useState(false);
    const [customPrompt, setCustomPrompt] = useState("");
    const [viewMode, setViewMode] = useState<"desktop" | "tablet" | "mobile">("desktop");
    const [subscriptionUsage, setSubscriptionUsage] = useState<SubscriptionUsage | null>(null);

    // Confirm dialog state
    const [confirmDialog, setConfirmDialog] = useState<{
        isOpen: boolean;
        type: "deletePreviewPublished" | "deletePreview" | "rollback" | null;
    }>({ isOpen: false, type: null });

    // Fetch subscription usage
    useEffect(() => {
        const fetchSubscriptionUsage = async () => {
            try {
                const response = await fetch("/api/subscription/info");
                if (response.ok) {
                    const data = await response.json();
                    setSubscriptionUsage({
                        edits: {
                            remaining: data.usage.edits.remaining,
                            limit: data.usage.edits.limit,
                        },
                    });
                }
            } catch (error) {
                console.error("Error fetching subscription usage:", error);
            }
        };
        fetchSubscriptionUsage();
    }, []);

    // Check for unpublished changes
    const hasChanges = site ? hasUnpublishedChanges(site) : false;

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

        // Relative asset path'lerini absolute URL'lere çevir (blob iframe için gerekli)
        fullHtml = convertRelativeAssetsToAbsolute(fullHtml);

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
            toast.error("Lütfen önce CV yükleyin");
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
                toast.success("Site başarıyla oluşturuldu!");
            } else {
                toast.error(data.error || "Site oluşturulamadı. Lütfen tekrar deneyin.");
            }
        } catch (error) {
            console.error("Site oluşturma hatası:", error);
            toast.error("Bir hata oluştu. Lütfen tekrar deneyin.");
        } finally {
            setGenerating(false);
        }
    };

    const handleDeletePreview = async () => {
        if (!site) return;

        // Check if site is published - show extra warning
        if (site.status === "published") {
            setConfirmDialog({ isOpen: true, type: "deletePreviewPublished" });
        } else {
            setConfirmDialog({ isOpen: true, type: "deletePreview" });
        }
    };

    const handleRollback = () => {
        setConfirmDialog({ isOpen: true, type: "rollback" });
    };

    const handleConfirmAction = async () => {
        if (confirmDialog.type === "deletePreviewPublished" || confirmDialog.type === "deletePreview") {
            await executeDeletePreview();
        } else if (confirmDialog.type === "rollback") {
            await executeRollback();
        }
        setConfirmDialog({ isOpen: false, type: null });
    };

    const executeDeletePreview = async () => {
        setDeletingPreview(true);
        try {
            // If site is published, first unpublish it
            if (site.status === "published") {
                const unpublishResponse = await fetch("/api/site/unpublish", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ siteId: site.id }),
                });

                if (!unpublishResponse.ok) {
                    const unpublishData = await unpublishResponse.json();
                    toast.error(unpublishData.error || "Site yayından kaldırılamadı");
                    return;
                }
            }

            // Now delete the preview
            const response = await fetch(`/api/site/delete-preview?id=${site.id}`, {
                method: "DELETE",
            });

            const data = await response.json();

            if (response.ok) {
                toast.success("Önizleme sitesi başarıyla silindi!");
                onRefresh();
            } else {
                toast.error(data.error || "Önizleme silinemedi");
            }
        } catch (error) {
            console.error("Silme hatası:", error);
            toast.error("Bir hata oluştu. Lütfen tekrar deneyin.");
        } finally {
            setDeletingPreview(false);
        }
    };

    const executeRollback = async () => {
        try {
            const response = await fetch("/api/site/rollback", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ siteId: site.id }),
            });
            const data = await response.json();
            if (response.ok) {
                toast.success("Değişiklikler başarıyla geri alındı!");
                onRefresh();
            } else {
                toast.error(data.error || "Geri alma işlemi başarısız oldu");
            }
        } catch (error) {
            console.error("Rollback hatası:", error);
            toast.error("Bir hata oluştu. Lütfen tekrar deneyin.");
        }
    };

    if (!site) {
        return (
            <div className="space-y-6">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Sitem</h2>
                    <p className="text-gray-400">Site önizlemenizi görüntüleyin ve düzenleyin</p>
                </div>
                <div className="relative bg-[#1a1a1a]/60 backdrop-blur-xl rounded-2xl border border-white/10 p-8 text-center overflow-hidden">
                    {/* Background Gradient Effects */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px] -mr-32 -mt-32" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/10 rounded-full blur-[60px] -ml-24 -mb-24" />

                    <div className="relative z-10">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center mx-auto mb-4 border border-white/5">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">Henüz bir siteniz yok</h3>
                        <p className="text-gray-400 text-sm">Lütfen önce CV yükleyin veya bilgilerinizi doldurun.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="space-y-6">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Sitem</h2>
                    <p className="text-gray-400">Site önizlemenizi görüntüleyin ve düzenleyin</p>
                </div>

                {/* Unpublished Changes Warning - Only show when site is published */}
                {site?.status === "published" && hasChanges && (
                    <div className="relative bg-amber-500/10 backdrop-blur-xl border border-amber-500/30 rounded-2xl p-4 overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-[40px] -mr-16 -mt-16" />
                        <div className="flex items-start gap-3 relative z-10">
                            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center border border-amber-500/30 flex-shrink-0">
                                <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <p className="text-amber-300 font-semibold mb-1">
                                    Yayınlanan site son değişiklikleri içermiyor
                                </p>
                                <p className="text-sm text-amber-200/80 mb-3">
                                    Değişikliklerinizi yayınlamak veya geri almak için aşağıdaki butonları kullanın.
                                </p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleRollback}
                                        className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white font-semibold rounded-xl transition-all duration-200 text-sm flex items-center gap-2"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M19 12H5M12 19l-7-7 7-7" />
                                        </svg>
                                        Geri Dön
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Delete Preview Button */}
                {site.htmlContent && (
                    <div className="flex justify-end">
                        <button
                            onClick={handleDeletePreview}
                            disabled={deletingPreview}
                            className="px-5 py-2.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 hover:border-red-500/50 disabled:opacity-50 text-red-400 hover:text-red-300 font-semibold rounded-xl transition-all duration-200 flex items-center gap-2"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                            </svg>
                            {deletingPreview ? "Siliniyor..." : "Ön İzlemeyi Sil"}
                        </button>
                    </div>
                )}

                {/* Preview Section */}
                {site.htmlContent && (
                    <div className="relative bg-[#1a1a1a]/60 backdrop-blur-xl rounded-2xl border border-white/10 p-3 pt-10 overflow-hidden">
                        {/* Background Gradient Effects */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-[80px] -mr-32 -mt-32" />
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/5 rounded-full blur-[60px] -ml-24 -mb-24" />

                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center border border-white/5">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                                            <path d="M8 21h8M12 17v4" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-semibold text-white">Site Önizleme</h3>
                                </div>
                                <div className="flex items-center gap-1 bg-[#0f0f0f]/80 rounded-xl p-1 border border-white/5">
                                    <button
                                        onClick={() => setViewMode("desktop")}
                                        className={`px-3 py-2 rounded-lg transition-all duration-200 ${viewMode === "desktop"
                                            ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/20"
                                            : "text-gray-400 hover:text-white hover:bg-white/5"
                                            }`}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => setViewMode("tablet")}
                                        className={`px-3 py-2 rounded-lg transition-all duration-200 ${viewMode === "tablet"
                                            ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/20"
                                            : "text-gray-400 hover:text-white hover:bg-white/5"
                                            }`}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => setViewMode("mobile")}
                                        className={`px-3 py-2 rounded-lg transition-all duration-200 ${viewMode === "mobile"
                                            ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/20"
                                            : "text-gray-400 hover:text-white hover:bg-white/5"
                                            }`}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            <div className="flex justify-center bg-[#0a0a0a] rounded-lg mt-3 border border-white/5">
                                <div
                                    className={`bg-white rounded-lg shadow-2xl shadow-purple-500/10 transition-all duration-300 ${viewMode === "desktop"
                                        ? "w-full h-[800px]"
                                        : viewMode === "tablet"
                                            ? "w-2/3 h-[800px]"
                                            : "w-1/3 h-[800px]"
                                        }`}
                                >
                                    <iframe
                                        src={iframeUrl}
                                        className="w-full h-full rounded-lg"
                                        title="Site Preview"
                                        sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Custom Prompt - Sadece site henüz oluşturulmamışsa göster */}
                {!site.htmlContent && (
                    <div className="relative bg-[#1a1a1a]/60 backdrop-blur-xl rounded-2xl border border-white/10 p-6 overflow-hidden">
                        {/* Background Gradient Effects */}
                        <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/10 rounded-full blur-[60px] -mr-24 -mt-24" />
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full blur-[40px] -ml-16 -mb-16" />

                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center border border-white/5">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M12 3l1.912 5.813a2 2 0 001.275 1.275L21 12l-5.813 1.912a2 2 0 00-1.275 1.275L12 21l-1.912-5.813a2 2 0 00-1.275-1.275L3 12l5.813-1.912a2 2 0 001.275-1.275L12 3z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-white">
                                        Özel Tasarım İstekleri
                                    </h3>
                                    <p className="text-sm text-gray-400">
                                        AI'ya sitenizin nasıl görünmesini istediğinizi anlatın.
                                    </p>
                                </div>
                            </div>

                            <textarea
                                placeholder="Örnek: Modern ve minimalist bir tasarım, mor-mavi renk paleti..."
                                value={customPrompt}
                                onChange={(e) => setCustomPrompt(e.target.value)}
                                rows={4}
                                className="w-full px-4 py-3 bg-[#0f0f0f]/80 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/30 resize-none placeholder:text-gray-500 transition-all duration-300"
                            />

                            {/* Generate Button */}
                            <button
                                onClick={handleGenerateSite}
                                disabled={generating}
                                className="w-full mt-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 flex items-center justify-center gap-2"
                            >
                                {generating ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        <span>AI ile siteniz oluşturuluyor...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>AI ile Sitemi Oluştur</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M5 12h14M12 5l7 7-7 7" />
                                        </svg>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Confirm Dialog */}
            <ConfirmDialog
                isOpen={confirmDialog.isOpen}
                onClose={() => setConfirmDialog({ isOpen: false, type: null })}
                onConfirm={handleConfirmAction}
                title={
                    confirmDialog.type === "deletePreviewPublished" ? "⚠️ Site Yayında!" :
                        confirmDialog.type === "deletePreview" ? "Önizlemeyi Sil" :
                            "Değişiklikleri Geri Al"
                }
                message={
                    confirmDialog.type === "deletePreviewPublished"
                        ? "Önizlemeyi silmek, sitenizi de yayından kaldıracaktır. Bu işlem geri alınamaz. Devam etmek istiyor musunuz?"
                        : confirmDialog.type === "deletePreview"
                            ? "Önizleme sitesini silmek istediğinizden emin misiniz? Bu işlem geri alınamaz."
                            : "Değişiklikleri geri almak istediğinizden emin misiniz? Bu işlem geri alınamaz."
                }
                confirmText={
                    confirmDialog.type === "rollback" ? "Geri Al" : "Sil"
                }
                variant={confirmDialog.type === "deletePreviewPublished" ? "danger" : "warning"}
                loading={deletingPreview}
            />
        </>
    );
}
