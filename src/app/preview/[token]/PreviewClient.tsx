"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    Monitor,
    Tablet,
    Smartphone,
    Globe,
    ArrowLeft,
    Sparkles,
} from "lucide-react";

interface PreviewClientProps {
    token: string;
    siteTitle: string;
    htmlContent: string;
    cssContent: string;
    jsContent: string;
}

type ViewMode = "desktop" | "tablet" | "mobile";

export default function PreviewClient({
    token,
    siteTitle,
    htmlContent,
    cssContent,
    jsContent,
}: PreviewClientProps) {
    const router = useRouter();
    const [viewMode, setViewMode] = useState<ViewMode>("desktop");

    // Combine HTML, CSS, JS into srcDoc
    const srcDoc = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>${cssContent}</style>
    </head>
    <body>
      ${htmlContent.replace(/<!DOCTYPE html>[\s\S]*?<body[^>]*>/i, "").replace(/<\/body>[\s\S]*<\/html>/i, "")}
      <script>${jsContent}</script>
    </body>
    </html>
  `;

    const getIframeWidth = () => {
        switch (viewMode) {
            case "mobile":
                return "375px";
            case "tablet":
                return "768px";
            default:
                return "100%";
        }
    };

    const handlePublish = () => {
        // Redirect to register page with token
        router.push(`/register?token=${token}`);
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
            {/* Header */}
            <header className="bg-[#0a0a0a] border-b border-white/10 px-4 py-3 flex items-center justify-between sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span className="text-sm hidden sm:inline">Ana Sayfa</span>
                    </Link>
                    <div className="h-6 w-px bg-white/10" />
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-blue-600 flex items-center justify-center">
                            <Sparkles className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-white font-medium truncate max-w-[200px]">
                            {siteTitle}
                        </span>
                    </div>
                </div>

                {/* View Mode Buttons */}
                <div className="flex items-center gap-2">
                    <div className="hidden sm:flex items-center gap-1 bg-white/5 rounded-lg p-1">
                        <button
                            onClick={() => setViewMode("desktop")}
                            className={`p-2 rounded transition-colors ${viewMode === "desktop"
                                    ? "bg-white/10 text-white"
                                    : "text-gray-400 hover:text-white"
                                }`}
                            title="Masaüstü"
                        >
                            <Monitor className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setViewMode("tablet")}
                            className={`p-2 rounded transition-colors ${viewMode === "tablet"
                                    ? "bg-white/10 text-white"
                                    : "text-gray-400 hover:text-white"
                                }`}
                            title="Tablet"
                        >
                            <Tablet className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setViewMode("mobile")}
                            className={`p-2 rounded transition-colors ${viewMode === "mobile"
                                    ? "bg-white/10 text-white"
                                    : "text-gray-400 hover:text-white"
                                }`}
                            title="Mobil"
                        >
                            <Smartphone className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Publish Button */}
                    <button
                        onClick={handlePublish}
                        className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold rounded-xl transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-purple-500/25"
                    >
                        <Globe className="w-4 h-4" />
                        <span>Yayınla</span>
                    </button>
                </div>
            </header>

            {/* Preview Container */}
            <div className="flex-1 flex items-start justify-center p-4 bg-[#0f0f0f] overflow-auto">
                <div
                    className={`bg-white rounded-lg shadow-2xl overflow-hidden transition-all duration-300 ${viewMode === "desktop" ? "w-full max-w-[1400px]" : ""
                        }`}
                    style={{
                        width: getIframeWidth(),
                        height: "calc(100vh - 100px)",
                    }}
                >
                    <iframe
                        srcDoc={srcDoc}
                        className="w-full h-full border-0"
                        title="Site Preview"
                    />
                </div>
            </div>

            {/* Info Banner */}
            <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 border-t border-white/10 px-4 py-3">
                <div className="max-w-4xl mx-auto flex items-center justify-center gap-2 text-center">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <p className="text-sm text-gray-300">
                        <span className="text-white font-medium">Siteniz hazır!</span>{" "}
                        Yayınlamak ve kendi alan adınızı almak için{" "}
                        <button
                            onClick={handlePublish}
                            className="text-purple-400 hover:text-purple-300 font-medium underline underline-offset-2"
                        >
                            kayıt olun
                        </button>
                        .
                    </p>
                </div>
            </div>
        </div>
    );
}
