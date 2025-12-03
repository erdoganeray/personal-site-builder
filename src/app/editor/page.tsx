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

    const handleSendMessage = () => {
        if (inputValue.trim()) {
            setMessages([...messages, { role: "user", content: inputValue }]);
            setInputValue("");
            // TODO: API call will be added here
        }
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
                        <span className="text-white font-bold bg-purple-600 px-3 py-1 rounded-full text-sm">5</span>
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
                                    <p className="text-sm">{message.content}</p>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Input Area */}
                    <div className="p-4 border-t border-gray-700">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                                placeholder="Revize talebinizi yazın..."
                                className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-purple-500 placeholder-gray-400"
                            />
                            <button
                                onClick={handleSendMessage}
                                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                            >
                                Gönder
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
