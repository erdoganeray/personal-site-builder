"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Paperclip, ArrowRight, FileText, X, Loader2, AlertCircle, ImagePlus } from "lucide-react";
import PortfolioModal from "./PortfolioModal";

// UUID generator for anonymous session token
function generateToken(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// Storage key for anonymous session
const ANONYMOUS_SESSION_KEY = 'profilly_anonymous_session';

interface PortfolioFile {
    file: File;
    previewUrl: string;
}

interface HeroPromptSectionProps {
    className?: string;
}

export default function HeroPromptSection({ className = "" }: HeroPromptSectionProps) {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const portfolioInputRef = useRef<HTMLInputElement>(null);

    const [prompt, setPrompt] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState({ step: 0, message: "" });
    const [error, setError] = useState<string | null>(null);
    const [showCVWarning, setShowCVWarning] = useState(false);

    // Portfolio state - dosyaları işlemeden önce topla
    const [portfolioFiles, setPortfolioFiles] = useState<PortfolioFile[]>([]);
    const [showPortfolioModal, setShowPortfolioModal] = useState(false);

    // Get or create anonymous session token
    const getOrCreateSessionToken = useCallback(() => {
        if (typeof window === 'undefined') return '';

        let token = localStorage.getItem(ANONYMOUS_SESSION_KEY);
        if (!token) {
            token = generateToken();
            localStorage.setItem(ANONYMOUS_SESSION_KEY, token);
        }
        return token;
    }, []);

    // Handle file selection
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            if (selectedFile.type !== "application/pdf") {
                setError("Sadece PDF dosyaları desteklenmektedir.");
                return;
            }
            if (selectedFile.size > 5 * 1024 * 1024) {
                setError("Dosya boyutu 5MB'dan büyük olamaz.");
                return;
            }
            setFile(selectedFile);
            setError(null);
            setShowCVWarning(false);
        }
    };

    // Handle file removal
    const handleRemoveFile = () => {
        setFile(null);
        // Portfolyo dosyalarını da temizle
        portfolioFiles.forEach(pf => URL.revokeObjectURL(pf.previewUrl));
        setPortfolioFiles([]);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    // Handle portfolio files from modal
    const handlePortfolioComplete = (files: PortfolioFile[]) => {
        // Eski blob URL'leri temizle
        portfolioFiles.forEach(pf => URL.revokeObjectURL(pf.previewUrl));
        setPortfolioFiles(files);
        setShowPortfolioModal(false);
    };

    // Drag and drop handlers
    const handleDragEnter = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const droppedFile = e.dataTransfer.files?.[0];
        if (droppedFile) {
            if (droppedFile.type !== "application/pdf") {
                setError("Sadece PDF dosyaları desteklenmektedir.");
                return;
            }
            if (droppedFile.size > 5 * 1024 * 1024) {
                setError("Dosya boyutu 5MB'dan büyük olamaz.");
                return;
            }
            setFile(droppedFile);
            setError(null);
            setShowCVWarning(false);
        }
    };

    // Main generate handler - tüm işlemleri tek seferde yapıyor
    const handleGenerate = async () => {
        // CV check
        if (!file) {
            setShowCVWarning(true);
            return;
        }

        setError(null);
        setShowCVWarning(false);
        setIsProcessing(true);

        try {
            const token = getOrCreateSessionToken();

            // Step 1: Upload CV
            setProgress({ step: 1, message: "CV yükleniyor..." });

            const uploadFormData = new FormData();
            uploadFormData.append("file", file);
            uploadFormData.append("anonymousSessionToken", token);
            if (prompt) {
                uploadFormData.append("customPrompt", prompt);
            }

            const uploadResponse = await fetch("/api/anonymous/upload", {
                method: "POST",
                body: uploadFormData,
            });

            if (!uploadResponse.ok) {
                const errorData = await uploadResponse.json();
                throw new Error(errorData.error || "CV yüklenemedi");
            }

            const { siteId } = await uploadResponse.json();

            // Step 2: Upload portfolio images (if any)
            let portfolioUrls: string[] = [];
            if (portfolioFiles.length > 0) {
                setProgress({ step: 2, message: `Portfolyo yükleniyor (${portfolioFiles.length} görsel)...` });

                const portfolioFormData = new FormData();
                portfolioFormData.append("anonymousSessionToken", token);
                portfolioFiles.forEach(pf => {
                    portfolioFormData.append("files", pf.file);
                });

                const portfolioResponse = await fetch("/api/anonymous/portfolio", {
                    method: "POST",
                    body: portfolioFormData,
                });

                if (portfolioResponse.ok) {
                    const portfolioData = await portfolioResponse.json();
                    if (portfolioData.uploads) {
                        portfolioUrls = portfolioData.uploads.map((u: any) => u.url);
                    }
                }
                // Portfolio upload başarısız olsa bile devam et
            }

            // Step 3: Analyze CV
            setProgress({ step: 3, message: "CV analiz ediliyor..." });

            const analyzeResponse = await fetch("/api/anonymous/analyze", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ anonymousSessionToken: token, siteId }),
            });

            if (!analyzeResponse.ok) {
                const errorData = await analyzeResponse.json();
                throw new Error(errorData.error || "CV analiz edilemedi");
            }

            // Step 4: Generate site
            setProgress({ step: 4, message: "Siteniz oluşturuluyor..." });

            const generateResponse = await fetch("/api/anonymous/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    anonymousSessionToken: token,
                    siteId,
                    customPrompt: prompt || undefined,
                    portfolioUrls: portfolioUrls.length > 0 ? portfolioUrls : undefined
                }),
            });

            if (!generateResponse.ok) {
                const errorData = await generateResponse.json();
                throw new Error(errorData.error || "Site oluşturulamadı");
            }

            // Success! Redirect to preview
            setProgress({ step: 5, message: "Yönlendiriliyor..." });
            router.push(`/preview/${token}`);

        } catch (err) {
            console.error("Generation error:", err);
            setError(err instanceof Error ? err.message : "Bir hata oluştu. Lütfen tekrar deneyin.");
            setIsProcessing(false);
        }
    };

    // Role suggestion click handler
    const handleRoleSuggestion = (role: string) => {
        setPrompt(role);
    };

    const roleSuggestions = [
        { icon: "💻", label: "Yazılım Mühendisi" },
        { icon: "🎨", label: "Kreatif Direktör" },
        { icon: "📱", label: "Pazarlama Uzmanı" },
        { icon: "🚀", label: "Ürün Yöneticisi" }
    ];

    return (
        <div className={`max-w-3xl mx-auto ${className}`}>
            {/* Portfolio Modal - işlem başlamadan önce açılır */}
            <PortfolioModal
                isOpen={showPortfolioModal}
                onClose={() => setShowPortfolioModal(false)}
                onSkip={() => setShowPortfolioModal(false)}
                onComplete={handlePortfolioComplete}
                initialFiles={portfolioFiles}
            />

            {/* Processing Overlay */}
            {isProcessing && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
                    <div className="bg-[#1a1a1a] border border-white/10 rounded-3xl p-8 max-w-md w-full mx-4 text-center">
                        <div className="mb-6">
                            <Loader2 className="w-12 h-12 text-purple-400 animate-spin mx-auto" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">
                            Siteniz Hazırlanıyor
                        </h3>
                        <p className="text-gray-400 mb-6">{progress.message}</p>

                        {/* Progress Steps */}
                        <div className="flex justify-center gap-2">
                            {[1, 2, 3, 4, 5].map((step) => (
                                <div
                                    key={step}
                                    className={`w-2 h-2 rounded-full transition-colors ${progress.step >= step ? 'bg-purple-500' : 'bg-gray-600'
                                        }`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Main Input Container */}
            <div
                className={`relative group ${isDragging ? 'ring-2 ring-purple-500' : ''}`}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
            >
                <div className={`flex flex-col gap-3 bg-[#1a1a1a]/80 backdrop-blur-xl border rounded-2xl p-4 shadow-2xl transition-all duration-300 ${isDragging ? 'border-purple-500' : 'border-white/10 hover:border-purple-500/30'
                    }`}>

                    {/* File Selected Indicator with Portfolio Button */}
                    {file && (
                        <div className="flex items-center gap-2">
                            {/* CV Chip */}
                            <div className="flex items-center gap-2 px-3 py-2 bg-purple-500/10 border border-purple-500/30 rounded-xl flex-1 min-w-0">
                                <FileText className="w-4 h-4 text-purple-400 flex-shrink-0" />
                                <span className="text-sm text-purple-300 truncate">{file.name}</span>
                                <button
                                    onClick={handleRemoveFile}
                                    className="p-1 hover:bg-white/10 rounded-lg transition-colors flex-shrink-0"
                                >
                                    <X className="w-4 h-4 text-gray-400 hover:text-white" />
                                </button>
                            </div>

                            {/* Portfolio Add Button */}
                            <button
                                onClick={() => setShowPortfolioModal(true)}
                                className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-all flex-shrink-0 ${portfolioFiles.length > 0
                                    ? 'bg-blue-500/10 border-blue-500/30 text-blue-300'
                                    : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white hover:border-purple-500/30'
                                    }`}
                                disabled={isProcessing}
                            >
                                <ImagePlus className="w-4 h-4" />
                                <span className="text-sm hidden sm:inline">
                                    {portfolioFiles.length > 0
                                        ? `${portfolioFiles.length} Görsel`
                                        : 'Portfolyo'
                                    }
                                </span>
                            </button>
                        </div>
                    )}

                    {/* Portfolio Preview Thumbnails - if files selected */}
                    {portfolioFiles.length > 0 && (
                        <div className="flex items-center gap-2 overflow-x-auto pb-1">
                            {portfolioFiles.slice(0, 5).map((pf, idx) => (
                                <div key={idx} className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 border border-white/10">
                                    <img src={pf.previewUrl} alt="" className="w-full h-full object-cover" />
                                </div>
                            ))}
                            {portfolioFiles.length > 5 && (
                                <div className="w-12 h-12 rounded-lg flex-shrink-0 bg-white/5 flex items-center justify-center text-xs text-gray-400">
                                    +{portfolioFiles.length - 5}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Input Row */}
                    <div className="flex items-center gap-3">
                        {/* Sparkles Icon */}
                        <div className="flex-shrink-0">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
                                <Sparkles className="w-5 h-5 text-purple-400" />
                            </div>
                        </div>

                        {/* Input Field */}
                        <input
                            type="text"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="Yazılım mühendisiyim. Modern, karanlık temalı ve projelerimi vitrinleyebileceğim minimalist bir portfolyo sitesi oluştur..."
                            className="flex-1 bg-transparent text-white text-base md:text-lg placeholder-gray-500 focus:outline-none py-2"
                            disabled={isProcessing}
                        />

                        {/* File Upload Button */}
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className={`flex-shrink-0 p-2.5 rounded-xl transition-colors ${file ? 'bg-purple-500/20 text-purple-400' : 'hover:bg-white/5 group/upload'
                                }`}
                            disabled={isProcessing}
                        >
                            <Paperclip className={`w-5 h-5 ${file ? 'text-purple-400' : 'text-gray-400 group-hover/upload:text-purple-400'} transition-colors`} />
                        </button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".pdf"
                            onChange={handleFileChange}
                            className="hidden"
                        />

                        {/* Generate Button */}
                        <button
                            onClick={handleGenerate}
                            disabled={isProcessing}
                            className="flex-shrink-0 flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 disabled:from-purple-800 disabled:to-blue-800 text-white font-semibold rounded-xl transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-purple-500/25"
                        >
                            <span className="hidden sm:inline">Oluştur</span>
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* CV Warning */}
                {showCVWarning && (
                    <div className="absolute -bottom-14 left-0 right-0 flex items-center justify-center gap-2 text-amber-400 text-sm animate-fade-in">
                        <AlertCircle className="w-4 h-4" />
                        <span>Lütfen önce CV dosyanızı yükleyin</span>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="absolute -bottom-14 left-0 right-0 flex items-center justify-center gap-2 text-red-400 text-sm animate-fade-in">
                        <AlertCircle className="w-4 h-4" />
                        <span>{error}</span>
                    </div>
                )}
            </div>

            {/* Supported formats text */}
            <p className="text-xs text-gray-500 text-center mt-3">
                {isDragging
                    ? "PDF dosyasını buraya bırakın"
                    : "Desteklenen formatlar: PDF (Maks 5MB)"}
            </p>

            {/* Role Suggestions */}
            <div className="flex flex-wrap justify-center gap-3 mt-6">
                {roleSuggestions.map((role, i) => (
                    <button
                        key={i}
                        onClick={() => handleRoleSuggestion(`${role.label} olarak çalışıyorum. Profesyonel bir kişisel web sitesi oluştur.`)}
                        disabled={isProcessing}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-500/30 rounded-full text-sm text-gray-300 hover:text-white transition-all disabled:opacity-50"
                    >
                        <span>{role.icon}</span>
                        <span>{role.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}
