"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { hasUnpublishedChanges } from "@/lib/change-detection";
import { convertRelativeAssetsToAbsolute } from "@/lib/iframe-utils";
import ChangeDetailsPanel from "@/components/dashboard/ChangeDetailsPanel";
import { getSuggestionsForSite } from "@/lib/chat-suggestions";
import { toast } from "@/components/ui/Toast";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

interface SubscriptionInfo {
    editsUsed: number;
    editsLimit: number;
    editsRemaining: number;
    resetDate: Date;
}

export default function EditorPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [selectedDevice, setSelectedDevice] = useState<"computer" | "tablet" | "phone">("computer");
    const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([]);
    const [inputValue, setInputValue] = useState("");
    const [site, setSite] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isRevising, setIsRevising] = useState(false);
    const [publishing, setPublishing] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [pendingMessage, setPendingMessage] = useState("");
    const [subscription, setSubscription] = useState<SubscriptionInfo>({
        editsUsed: 0,
        editsLimit: 10,
        editsRemaining: 10,
        resetDate: new Date(),
    });

    const MAX_CHAR_LIMIT = 500;

    // Confirm dialog state
    const [confirmDialog, setConfirmDialog] = useState<{
        isOpen: boolean;
        type: "republish" | "rollback" | null;
    }>({ isOpen: false, type: null });

    // Check for unpublished changes
    const hasChanges = site ? hasUnpublishedChanges(site) : false;

    // Get smart suggestions
    const suggestions = useMemo(() => {
        if (!site?.designPlan || !site?.cvContent) return null;
        return getSuggestionsForSite(site.designPlan, site.cvContent);
    }, [site?.designPlan, site?.cvContent]);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        }
    }, [status, router]);

    useEffect(() => {
        if (session) {
            fetchSite();
            fetchSubscriptionInfo();
        }
    }, [session]);

    const fetchSite = async () => {
        try {
            const response = await fetch("/api/site/list");
            const data = await response.json();

            if (response.ok && data.sites && data.sites.length > 0) {
                const userSite = data.sites[0];
                setSite(userSite);
            }
        } catch (error) {
            console.error("Site yükleme hatası:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchSubscriptionInfo = async () => {
        try {
            const response = await fetch("/api/subscription/info");
            const data = await response.json();

            if (response.ok && data.usage?.edits) {
                setSubscription({
                    editsUsed: data.usage.edits.used,
                    editsLimit: data.usage.edits.limit,
                    editsRemaining: data.usage.edits.remaining,
                    resetDate: new Date(data.usage.edits.resetDate),
                });
            }
        } catch (error) {
            console.error("Subscription bilgisi yüklenemedi:", error);
        }
    };

    const handleRepublish = () => {
        setConfirmDialog({ isOpen: true, type: "republish" });
    };

    const executeRepublish = async () => {
        setPublishing(true);
        try {
            const response = await fetch("/api/site/publish", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ siteId: site.id }),
            });
            const data = await response.json();
            if (response.ok) {
                toast.success(`Site başarıyla yeniden yayınlandı!`, {
                    description: data.cloudflareUrl
                });
                fetchSite();
            } else {
                toast.error(data.error || "Site yayınlanamadı");
            }
        } catch (error) {
            console.error("Yayınlama hatası:", error);
            toast.error("Bir hata oluştu. Lütfen tekrar deneyin.");
        } finally {
            setPublishing(false);
        }
    };

    const handleRollback = () => {
        setConfirmDialog({ isOpen: true, type: "rollback" });
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
                fetchSite();
            } else {
                toast.error(data.error || "Geri alma işlemi başarısız oldu");
            }
        } catch (error) {
            console.error("Rollback hatası:", error);
            toast.error("Bir hata oluştu. Lütfen tekrar deneyin.");
        }
    };

    const handleConfirmAction = async () => {
        if (confirmDialog.type === "republish") {
            await executeRepublish();
        } else if (confirmDialog.type === "rollback") {
            await executeRollback();
        }
        setConfirmDialog({ isOpen: false, type: null });
    };


    // Blob URL oluştur
    const iframeUrl = useMemo(() => {
        if (!site?.htmlContent) return "";

        let fullHtml = site.htmlContent;

        if (site.cssContent) {
            const styleTag = `<style>${site.cssContent}</style>`;
            if (fullHtml.includes("</head>")) {
                fullHtml = fullHtml.replace("</head>", `${styleTag}\n</head>`);
            } else {
                fullHtml = styleTag + fullHtml;
            }
        }

        if (site.jsContent) {
            const scriptTag = `<script>${site.jsContent}</script>`;
            if (fullHtml.includes("</body>")) {
                fullHtml = fullHtml.replace("</body>", `${scriptTag}\n</body>`);
            } else {
                fullHtml = fullHtml + scriptTag;
            }
        }

        fullHtml = convertRelativeAssetsToAbsolute(fullHtml);

        const blob = new Blob([fullHtml], { type: "text/html" });
        return URL.createObjectURL(blob);
    }, [site?.htmlContent, site?.cssContent, site?.jsContent]);

    useEffect(() => {
        return () => {
            if (iframeUrl) {
                URL.revokeObjectURL(iframeUrl);
            }
        };
    }, [iframeUrl]);

    if (status === "loading" || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
                <div className="text-white text-xl">Loading...</div>
            </div>
        );
    }

    if (!session) {
        return null;
    }

    const handleSendMessage = async () => {
        if (inputValue.trim() && !isRevising) {
            const userMessage = inputValue.trim();
            setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
            setInputValue("");
            setIsRevising(true);

            try {
                // First, analyze the message with LLM
                const reviseResponse = await fetch("/api/site/revise", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        siteId: site.id,
                        message: userMessage,
                    }),
                });

                const reviseData = await reviseResponse.json();

                // Handle quota exceeded error
                if (!reviseResponse.ok) {
                    if (reviseData.error?.includes("düzenleme hakkınız doldu")) {
                        const resetDate = new Date(reviseData.resetDate).toLocaleDateString("tr-TR");
                        setMessages((prev) => [
                            ...prev,
                            {
                                role: "assistant",
                                content: `⚠️ ${reviseData.error}\n\nYeni ay başında hakkınız yenilenecek: ${resetDate}`,
                            },
                        ]);
                        return;
                    }

                    throw new Error(reviseData.error || "Revize başarısız oldu");
                }

                // Check if this requires confirmation (actual revision operations)
                const requiresConfirmation =
                    reviseData.success &&
                    !reviseData.redirectToMyInfo &&
                    reviseData.operation?.type !== "UNSUPPORTED" &&
                    reviseData.operation?.type !== "CHAT";

                if (requiresConfirmation) {
                    // Show confirmation modal for actual revisions
                    setPendingMessage(userMessage);
                    setShowConfirmModal(true);
                    setIsRevising(false);

                    // Store the analysis result temporarily
                    (window as any).__pendingReviseData = reviseData;
                } else {
                    // No confirmation needed - handle immediately
                    if (reviseData.redirectToMyInfo) {
                        // MyInfo redirect
                        setMessages((prev) => [
                            ...prev,
                            {
                                role: "assistant",
                                content: reviseData.message,
                            },
                        ]);
                    } else {
                        // Unsupported or conversational message
                        setMessages((prev) => [
                            ...prev,
                            {
                                role: "assistant",
                                content: reviseData.message,
                            },
                        ]);
                    }
                }
            } catch (error) {
                console.error("Revize hatası:", error);
                setMessages((prev) => [
                    ...prev,
                    {
                        role: "assistant",
                        content: `❌ Bir hata oluştu: ${error instanceof Error ? error.message : "Bilinmeyen hata"}`,
                    },
                ]);
            } finally {
                if (!showConfirmModal) {
                    setIsRevising(false);
                }
            }
        }
    };

    const handleConfirmRevision = async () => {
        if (!pendingMessage || !site) return;

        setShowConfirmModal(false);
        setIsRevising(true);

        try {
            // Get the stored analysis result
            const reviseData = (window as any).__pendingReviseData;
            delete (window as any).__pendingReviseData;

            // Update subscription info
            if (reviseData.subscription) {
                setSubscription(reviseData.subscription);
            }

            // Refresh site to show changes
            await fetchSite();

            const remainingText = `\n\nKalan düzenleme hakkınız: ${reviseData.subscription.editsRemaining}/${reviseData.subscription.editsLimit}`;
            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content: reviseData.message + remainingText,
                },
            ]);
        } catch (error) {
            console.error("Revize hatası:", error);
            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content: `❌ Bir hata oluştu: ${error instanceof Error ? error.message : "Bilinmeyen hata"}`,
                },
            ]);
        } finally {
            setIsRevising(false);
            setPendingMessage("");
        }
    };

    const handleCancelRevision = () => {
        setShowConfirmModal(false);
        setPendingMessage("");
        delete (window as any).__pendingReviseData;
        setMessages((prev) => [
            ...prev,
            {
                role: "assistant",
                content: "İşlem iptal edildi.",
            },
        ]);
    };

    const deviceSizes = {
        computer: "w-full h-full",
        tablet: "w-[768px] h-full",
        phone: "w-[375px] h-full",
    };

    const hasPreviewContent = site?.htmlContent;

    return (
        <>
            <div className="h-screen flex flex-col bg-[#0a0a0a]">
                {/* Top Navigation Menu */}
                <nav className="bg-gray-900/80 backdrop-blur-md border-b border-white/10 px-6 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors">
                            ← Geri
                        </Link>
                        <h1 className="text-xl font-bold text-white">Site Editörü</h1>

                        {/* Device Selector */}
                        {hasPreviewContent && (
                            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl p-1">
                                <button
                                    onClick={() => setSelectedDevice("computer")}
                                    className={`px-3 py-1.5 rounded-lg transition-all ${selectedDevice === "computer" ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/25" : "text-gray-400 hover:text-white hover:bg-white/5"
                                        }`}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => setSelectedDevice("tablet")}
                                    className={`px-3 py-1.5 rounded-lg transition-all ${selectedDevice === "tablet" ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/25" : "text-gray-400 hover:text-white hover:bg-white/5"
                                        }`}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => setSelectedDevice("phone")}
                                    className={`px-3 py-1.5 rounded-lg transition-all ${selectedDevice === "phone" ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/25" : "text-gray-400 hover:text-white hover:bg-white/5"
                                        }`}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                    </svg>
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-6">
                        {/* Quota Display */}
                        <div className="flex items-center gap-2">
                            <span className="text-gray-400 text-sm">Kalan Düzenleme:</span>
                            {loading ? (
                                <span className="text-white font-bold bg-gray-600 px-3 py-1 rounded-full text-sm animate-pulse">
                                    ...
                                </span>
                            ) : (
                                <span className="text-white font-bold bg-gradient-to-r from-purple-600 to-blue-600 px-3 py-1 rounded-full text-sm shadow-lg shadow-purple-500/25">
                                    {subscription.editsRemaining}/{subscription.editsLimit}
                                </span>
                            )}
                        </div>
                        <Link href="/dashboard" className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm rounded-xl transition-all">
                            Dashboard
                        </Link>
                    </div>
                </nav>

                {/* Main Content Area */}
                <div className="flex-1 flex overflow-hidden">
                    {/* Preview Area */}
                    <div className="flex-1 flex flex-col bg-[#0d0d0d] p-3">
                        <div className="flex-1 flex justify-center bg-[#0a0a0a] rounded-2xl overflow-hidden border border-white/5">
                            {hasPreviewContent ? (
                                <div className={`${deviceSizes[selectedDevice]} bg-white rounded shadow-xl transition-all duration-300`}>
                                    <iframe src={iframeUrl} className="w-full h-full rounded" title="Site Preview" sandbox="allow-same-origin allow-scripts allow-forms allow-popups" />
                                </div>
                            ) : (
                                <div className="flex items-center justify-center w-full">
                                    <div className="text-center text-gray-400 max-w-md">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mx-auto mb-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                        <h3 className="text-2xl font-bold text-white mb-2">Henüz Site Oluşturulmamış</h3>
                                        <p className="mb-6">Site önizlemesini görmek için önce Dashboard'dan sitenizi oluşturun.</p>
                                        <Link href="/dashboard" className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-purple-500/25 transform hover:scale-105 active:scale-95 inline-block">
                                            Dashboard'a Git
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Chat/Revision Area */}
                    <div className="w-80 bg-[#0d0d0d] border-l border-white/10 flex flex-col">
                        {/* Unpublished Changes Warning - Only show when site is published */}
                        {site?.status === "published" && hasChanges && (
                            <div className="bg-gradient-to-br from-yellow-900/20 to-orange-900/20 backdrop-blur-sm border-b border-yellow-500/20 p-4">
                                <div className="flex items-start gap-2">
                                    <svg className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                    <div className="flex-1">
                                        <p className="text-yellow-300 font-semibold text-sm mb-3">⚠️ Yayınlanan site son değişiklikleri içermiyor</p>
                                        <button
                                            onClick={handleRepublish}
                                            disabled={publishing}
                                            className="w-full bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-600 text-white font-semibold py-2 px-3 rounded-lg transition-colors duration-200 text-xs mb-2"
                                        >
                                            {publishing ? "Yayınlanıyor..." : "Yeniden Yayınla"}
                                        </button>
                                        <button
                                            onClick={handleRollback}
                                            className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-3 rounded-lg transition-colors duration-200 text-xs"
                                        >
                                            ← Geri Dön
                                        </button>
                                        <ChangeDetailsPanel site={site} />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Chat Header */}
                        <div className="p-4 border-b border-white/10">
                            <h2 className="text-lg font-semibold text-white">Site Düzenleyici</h2>
                            <p className="text-sm text-gray-400 mt-1">Sitenizde değişiklik yapmak için mesaj gönderin</p>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.length === 0 ? (
                                <div className="text-center text-gray-500 mt-8">
                                    <p>Henüz mesaj yok</p>
                                    <p className="text-sm mt-2">Değişiklik yapmak için aşağıdan mesaj gönderin</p>

                                    {/* Smart Suggestions */}
                                    {suggestions && (
                                        <div className="mt-6 text-left bg-white/5 border border-white/10 backdrop-blur-sm p-4 rounded-xl text-xs space-y-3">
                                            <p className="text-white font-semibold mb-2">💡 Önerilen değişiklikler:</p>

                                            {suggestions.componentOperations.length > 0 && (
                                                <div>
                                                    <p className="text-gray-400 text-xs mb-1">Component İşlemleri:</p>
                                                    {suggestions.componentOperations.map((suggestion, idx) => (
                                                        <button
                                                            key={idx}
                                                            onClick={() => setInputValue(suggestion)}
                                                            className="block w-full text-left text-gray-300 hover:text-white hover:bg-purple-500/20 p-2 rounded-lg transition-all border border-transparent hover:border-purple-500/30"
                                                        >
                                                            • {suggestion}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}

                                            {suggestions.themeChanges.length > 0 && (
                                                <div>
                                                    <p className="text-gray-400 text-xs mb-1">Tema Değişiklikleri:</p>
                                                    {suggestions.themeChanges.slice(0, 2).map((suggestion, idx) => (
                                                        <button
                                                            key={idx}
                                                            onClick={() => setInputValue(suggestion)}
                                                            className="block w-full text-left text-gray-300 hover:text-white hover:bg-purple-500/20 p-2 rounded-lg transition-all border border-transparent hover:border-purple-500/30"
                                                        >
                                                            • {suggestion}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                messages.map((message, index) => (
                                    <div key={index} className={`p-3 rounded-xl ${message.role === "user" ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white ml-4 shadow-lg shadow-purple-500/20" : "bg-white/5 border border-white/10 text-gray-200 mr-4"}`}>
                                        <p className="text-sm whitespace-pre-line">{message.content}</p>
                                    </div>
                                ))
                            )}
                            {isRevising && (
                                <div className="bg-white/5 border border-white/10 text-gray-200 mr-4 p-3 rounded-xl">
                                    <p className="text-sm">İşleniyor...</p>
                                </div>
                            )}

                            {/* Confirmation Modal */}
                            {showConfirmModal && pendingMessage && (
                                <div className="bg-gradient-to-br from-blue-900 to-purple-900 border border-purple-500 rounded-lg p-4 mr-4 space-y-3">
                                    <h4 className="text-white font-bold text-sm">📋 Değişikliği Onayla</h4>
                                    <p className="text-gray-200 text-xs">Bu değişikliği uygulamak istediğinizden emin misiniz?</p>
                                    <div className="bg-gray-800 rounded p-2">
                                        <p className="text-gray-100 text-xs italic">"{pendingMessage}"</p>
                                    </div>
                                    <div className="bg-yellow-900 bg-opacity-40 border border-yellow-600 rounded p-2">
                                        <p className="text-yellow-200 text-xs">
                                            ⚠️ Bu işlem bir düzenleme hakkı kullanacaktır.
                                            {subscription && ` Kalan hakkınız: ${Math.max(0, subscription.editsRemaining - 1)}`}
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={handleCancelRevision}
                                            className="flex-1 px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white text-xs rounded transition-colors"
                                        >
                                            İptal
                                        </button>
                                        <button
                                            onClick={handleConfirmRevision}
                                            className="flex-1 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs rounded transition-colors font-semibold"
                                        >
                                            Onayla
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input Area */}
                        <div className="p-4 border-t border-white/10">
                            <div className="space-y-2">
                                <textarea
                                    value={inputValue}
                                    onChange={(e) => {
                                        if (e.target.value.length <= MAX_CHAR_LIMIT) {
                                            setInputValue(e.target.value);
                                        }
                                    }}
                                    onKeyPress={(e) => {
                                        if (e.key === "Enter" && !e.shiftKey) {
                                            e.preventDefault();
                                            handleSendMessage();
                                        }
                                    }}
                                    placeholder="Değişiklik talebinizi yazın... (Ör: Portfolio bölümünü kaldır, renkleri mavi yap)"
                                    className="w-full px-4 py-3 bg-[#1a1a1a] text-white rounded-xl border border-white/10 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30 placeholder-gray-500 resize-none transition-all"
                                    rows={3}
                                    disabled={isRevising || !site?.htmlContent}
                                />
                                <div className="flex justify-between items-center">
                                    <span className={`text-xs ${inputValue.length > MAX_CHAR_LIMIT * 0.9 ? "text-red-400" : "text-gray-500"}`}>
                                        {inputValue.length} / {MAX_CHAR_LIMIT}
                                    </span>
                                    <button
                                        onClick={handleSendMessage}
                                        disabled={!inputValue.trim() || isRevising || !site?.htmlContent}
                                        className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm font-semibold shadow-lg shadow-purple-500/25 transform hover:scale-105 active:scale-95"
                                    >
                                        {isRevising ? "İşleniyor..." : "Gönder"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Confirm Dialog */}
            <ConfirmDialog
                isOpen={confirmDialog.isOpen}
                onClose={() => setConfirmDialog({ isOpen: false, type: null })}
                onConfirm={handleConfirmAction}
                title={
                    confirmDialog.type === "republish" ? "Siteyi Yeniden Yayınla" :
                        "Değişiklikleri Geri Al"
                }
                message={
                    confirmDialog.type === "republish"
                        ? "Sitenizi yeniden yayınlamak istediğinizden emin misiniz?"
                        : "Değişiklikleri geri almak istediğinizden emin misiniz? Bu işlem geri alınamaz."
                }
                confirmText={
                    confirmDialog.type === "republish" ? "Yayınla" : "Geri Al"
                }
                variant={
                    confirmDialog.type === "republish" ? "info" : "danger"
                }
                loading={publishing}
            />
        </>
    );
}
