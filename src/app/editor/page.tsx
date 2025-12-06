"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";

export default function EditorPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [selectedDevice, setSelectedDevice] = useState<"computer" | "tablet" | "phone">("computer");
    const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([]);
    const [inputValue, setInputValue] = useState("");
    const [site, setSite] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isRevising, setIsRevising] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [pendingRevision, setPendingRevision] = useState<{ changes: string[]; originalMessage: string } | null>(null);
    
    const MAX_CHAR_LIMIT = 500;

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        }
    }, [status, router]);

    useEffect(() => {
        if (session) {
            fetchSite();
        }
    }, [session]);

    const fetchSite = async () => {
        try {
            const response = await fetch("/api/site/list");
            const data = await response.json();
            
            console.log("Editor - API Response:", data);
            
            if (response.ok && data.sites && data.sites.length > 0) {
                const userSite = data.sites[0];
                console.log("Editor - Site data:", userSite);
                console.log("Editor - Has htmlContent:", userSite?.htmlContent ? "YES" : "NO");
                setSite(userSite);
            }
        } catch (error) {
            console.error("Site yükleme hatası:", error);
        } finally {
            setLoading(false);
        }
    };

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

    if (status === "loading" || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
                <div className="text-white text-xl">Loading...</div>
            </div>
        );
    }

    if (!session) {
        return null;
    }

    const handleSendMessage = async () => {
        if (inputValue.trim() && !isAnalyzing && !isRevising) {
            const userMessage = inputValue.trim();
            setMessages(prev => [...prev, { role: "user", content: userMessage }]);
            setInputValue("");
            setIsAnalyzing(true);

            try {
                // Analyze the message with Gemini
                const analyzeResponse = await fetch("/api/site/chat-analyze", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        siteId: site.id,
                        message: userMessage
                    })
                });

                const analyzeData = await analyzeResponse.json();

                if (!analyzeResponse.ok) {
                    throw new Error(analyzeData.error || "Analiz başarısız oldu");
                }

                // Add assistant response to chat
                setMessages(prev => [...prev, { role: "assistant", content: analyzeData.response }]);

                // If it's a revision request, show confirmation modal
                if (analyzeData.isRevision && analyzeData.changes) {
                    setPendingRevision({
                        changes: analyzeData.changes,
                        originalMessage: userMessage
                    });
                    setShowConfirmModal(true);
                }
            } catch (error) {
                console.error("Mesaj gönderme hatası:", error);
                setMessages(prev => [...prev, {
                    role: "assistant",
                    content: "Üzgünüm, mesajınızı işlerken bir hata oluştu. Lütfen tekrar deneyin."
                }]);
            } finally {
                setIsAnalyzing(false);
            }
        }
    };

    const handleConfirmRevision = async () => {
        if (!pendingRevision || !site) return;

        setShowConfirmModal(false);
        setIsRevising(true);
        setMessages(prev => [...prev, {
            role: "assistant",
            content: "Değişiklikler uygulanıyor, lütfen bekleyin..."
        }]);

        try {
            const reviseResponse = await fetch("/api/site/revise", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    siteId: site.id,
                    revisionRequest: pendingRevision.originalMessage
                })
            });

            const reviseData = await reviseResponse.json();

            if (!reviseResponse.ok) {
                throw new Error(reviseData.error || "Revize başarısız oldu");
            }

            // Update site data to refresh preview
            await fetchSite();

            setMessages(prev => [...prev, {
                role: "assistant",
                content: `✅ Değişiklikler başarıyla uygulandı! ${reviseData.changes || ""}\n\nKalan revize hakkınız: ${reviseData.site.maxRevisions - reviseData.site.revisionCount}`
            }]);

        } catch (error) {
            console.error("Revize hatası:", error);
            setMessages(prev => [...prev, {
                role: "assistant",
                content: `❌ Değişiklikler uygulanırken bir hata oluştu: ${error instanceof Error ? error.message : "Bilinmeyen hata"}`
            }]);
        } finally {
            setIsRevising(false);
            setPendingRevision(null);
        }
    };

    const handleCancelRevision = () => {
        setShowConfirmModal(false);
        setPendingRevision(null);
        setMessages(prev => [...prev, {
            role: "assistant",
            content: "Değişiklikler iptal edildi."
        }]);
    };

    const deviceSizes = {
        computer: "w-full h-full",
        tablet: "w-2/3 h-full",
        phone: "w-1/3 h-full"
    };

    const hasPreviewContent = site?.htmlContent;

    return (
        <div className="h-screen flex flex-col bg-gray-900">
            {/* Top Navigation Menu */}
            <nav className="bg-gray-800 border-b border-gray-700 px-6 py-3 flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors">
                        ← Geri
                    </Link>
                    <h1 className="text-xl font-bold text-white">Site Editörü</h1>
                    
                    {/* Device Selector in Navigation - Only show if there's content */}
                    {hasPreviewContent && (
                        <div className="flex items-center gap-2 bg-gray-700 rounded-lg p-1">
                            <button
                                onClick={() => setSelectedDevice("computer")}
                                className={`px-3 py-1 rounded transition-colors ${
                                    selectedDevice === "computer"
                                        ? "bg-blue-600 text-white"
                                        : "text-gray-400 hover:text-white"
                                }`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </button>
                            <button
                                onClick={() => setSelectedDevice("tablet")}
                                className={`px-3 py-1 rounded transition-colors ${
                                    selectedDevice === "tablet"
                                        ? "bg-blue-600 text-white"
                                        : "text-gray-400 hover:text-white"
                                }`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                </svg>
                            </button>
                            <button
                                onClick={() => setSelectedDevice("phone")}
                                className={`px-3 py-1 rounded transition-colors ${
                                    selectedDevice === "phone"
                                        ? "bg-blue-600 text-white"
                                        : "text-gray-400 hover:text-white"
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
                    <div className="flex items-center gap-2">
                        <span className="text-gray-400 text-sm">Kalan Revize Hakkı:</span>
                        <span className="text-white font-bold bg-purple-600 px-3 py-1 rounded-full text-sm">
                            {site ? site.maxRevisions - site.revisionCount : 0}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-gray-400 text-sm">Plan:</span>
                        <span className="text-white font-medium text-sm">Free</span>
                    </div>
                    <Link
                        href="/dashboard"
                        className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg transition-colors"
                    >
                        Dashboard
                    </Link>
                </div>
            </nav>

            {/* Main Content Area */}
            <div className="flex-1 flex overflow-hidden">
                {/* Preview Area (Center - Large) */}
                <div className="flex-1 flex flex-col bg-gray-800 p-3">
                    {/* Preview Container */}
                    <div className="flex-1 flex justify-center bg-gray-900 rounded-lg overflow-hidden">
                        {hasPreviewContent ? (
                            <div className={`${deviceSizes[selectedDevice]} bg-white rounded shadow-xl transition-all duration-300`}>
                                <iframe
                                    src={iframeUrl}
                                    className="w-full h-full rounded"
                                    title="Site Preview"
                                    sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
                                />
                            </div>
                        ) : (
                            <div className="flex items-center justify-center w-full">
                                <div className="text-center text-gray-400 max-w-md">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mx-auto mb-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    <h3 className="text-2xl font-bold text-white mb-2">Henüz Site Oluşturulmamış</h3>
                                    <p className="mb-6">Site önizlemesini görmek için önce Dashboard'dan sitenizi oluşturun.</p>
                                    <Link
                                        href="/dashboard"
                                        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-lg transition-all duration-200 inline-block"
                                    >
                                        Dashboard'a Git
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Chat/Revision Area (Right Side) */}
                <div className="w-96 bg-gray-800 border-l border-gray-700 flex flex-col">
                    {/* Chat Header */}
                    <div className="p-4 border-b border-gray-700">
                        <h2 className="text-lg font-semibold text-white">Revize Talepleriniz</h2>
                        <p className="text-sm text-gray-400 mt-1">Site üzerinde değişiklik yapmak için buradan yazabilirsiniz</p>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.length === 0 ? (
                            <div className="text-center text-gray-500 mt-8">
                                <p>Henüz revize talebi yok</p>
                                <p className="text-sm mt-2">Değişiklik yapmak için aşağıdan mesaj gönderin</p>
                                <div className="mt-6 text-left bg-gray-700 p-4 rounded-lg text-xs space-y-2">
                                    <p className="text-white font-semibold mb-2">💡 Örnek talepler:</p>
                                    <p className="text-gray-300">• "Eğitim bölümünü kaldır"</p>
                                    <p className="text-gray-300">• "Ana rengi maviye çevir"</p>
                                    <p className="text-gray-300">• "Portfolio bölümünü üste taşı"</p>
                                    <p className="text-gray-300">• "Başlık fontunu büyüt"</p>
                                </div>
                            </div>
                        ) : (
                            messages.map((message, index) => (
                                <div
                                    key={index}
                                    className={`p-3 rounded-lg ${
                                        message.role === "user"
                                            ? "bg-purple-600 text-white ml-4"
                                            : "bg-gray-700 text-gray-200 mr-4"
                                    }`}
                                >
                                    <p className="text-sm whitespace-pre-line">{message.content}</p>
                                </div>
                            ))
                        )}
                        {isAnalyzing && (
                            <div className="bg-gray-700 text-gray-200 mr-4 p-3 rounded-lg">
                                <p className="text-sm">Analiz ediliyor...</p>
                            </div>
                        )}
                        
                        {/* Inline Confirmation Card */}
                        {showConfirmModal && pendingRevision && (
                            <div className="bg-gradient-to-br from-blue-900 to-purple-900 border border-purple-500 rounded-lg p-4 mr-4 space-y-3">
                                <h4 className="text-white font-bold text-sm">📋 Değişiklikleri Onayla</h4>
                                <p className="text-gray-200 text-xs">Aşağıdaki değişiklikler yapılacak:</p>
                                <ul className="list-disc list-inside space-y-1 text-gray-100 text-xs">
                                    {pendingRevision.changes.map((change, idx) => (
                                        <li key={idx}>{change}</li>
                                    ))}
                                </ul>
                                <div className="bg-yellow-900 bg-opacity-40 border border-yellow-600 rounded p-2">
                                    <p className="text-yellow-200 text-xs">
                                        ⚠️ Bu işlem bir revize hakkı kullanacaktır.
                                        {site && ` Kalan hakkınız: ${site.maxRevisions - site.revisionCount - 1}`}
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
                    <div className="p-4 border-t border-gray-700">
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
                                placeholder="Revize talebinizi yazın... (Ör: Eğitim bölümünü kaldır, renkleri değiştir)"
                                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-purple-500 placeholder-gray-400 resize-none"
                                rows={3}
                                disabled={isAnalyzing || isRevising || !site?.htmlContent}
                            />
                            <div className="flex justify-between items-center">
                                <span className={`text-xs ${inputValue.length > MAX_CHAR_LIMIT * 0.9 ? 'text-red-400' : 'text-gray-500'}`}>
                                    {inputValue.length} / {MAX_CHAR_LIMIT}
                                </span>
                                <button
                                    onClick={handleSendMessage}
                                    disabled={!inputValue.trim() || isAnalyzing || isRevising || !site?.htmlContent}
                                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed text-sm"
                                >
                                    {isAnalyzing ? "Analiz Ediliyor..." : isRevising ? "Uygulanıyor..." : "Gönder"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
