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
                    <p className="text-gray-400">Site bilgileriniz burada görüntülenecek</p>
                </div>
                <div className="bg-gray-800 rounded-xl border border-gray-700 p-8 text-center">
                    <p className="text-gray-400">Henüz bir siteniz yok. Lütfen önce CV yükleyin.</p>
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
                <div className="bg-yellow-900/30 border border-yellow-700 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                        <svg className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <div className="flex-1">
                            <p className="text-yellow-300 font-semibold mb-1">
                                ⚠️ Yayınlanan site son değişiklikleri içermiyor
                            </p>
                            <p className="text-sm text-yellow-200 mb-3">
                                Değişikliklerinizi yayınlamak veya geri almak için aşağıdaki butonları kullanın.
                            </p>
                            <div className="flex gap-2">
                                <button
                                    onClick={handleRollback}
                                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors duration-200 text-sm"
                                >
                                    ← Geri Dön
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
                        className="px-6 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors duration-200"
                    >
                        {deletingPreview ? "Siliniyor..." : "Ön İzlemeyi Sil"}
                    </button>
                </div>
            )}

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

                    {/* Generate Button */}
                    <button
                        onClick={handleGenerateSite}
                        disabled={generating}
                        className="w-full mt-4 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-4 px-6 rounded-lg transition-all duration-200"
                    >
                        {generating ? "AI ile siteniz oluşturuluyor..." : "AI ile Sitemi Oluştur →"}
                    </button>
                </div>
            )}
        </div>

            {/* Confirm Dialog */ }
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
