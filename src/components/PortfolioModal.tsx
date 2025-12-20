"use client";

import { useState, useRef, useEffect } from "react";
import { X, Upload, Plus, Trash2, Image as ImageIcon, ArrowRight, Check } from "lucide-react";

interface PortfolioFile {
    file: File;
    previewUrl: string;
}

interface PortfolioModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSkip: () => void;
    onComplete: (files: PortfolioFile[]) => void;
    initialFiles?: PortfolioFile[];
}

const MAX_IMAGES = 10;
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export default function PortfolioModal({
    isOpen,
    onClose,
    onSkip,
    onComplete,
    initialFiles = [],
}: PortfolioModalProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [files, setFiles] = useState<PortfolioFile[]>(initialFiles);
    const [error, setError] = useState<string | null>(null);

    // Sync with initialFiles when modal opens
    useEffect(() => {
        if (isOpen) {
            setFiles(initialFiles);
            setError(null);
        }
    }, [isOpen, initialFiles]);

    if (!isOpen) return null;

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = e.target.files;
        if (!selectedFiles || selectedFiles.length === 0) return;

        const remainingSlots = MAX_IMAGES - files.length;
        if (selectedFiles.length > remainingSlots) {
            setError(`Maksimum ${MAX_IMAGES} görsel ekleyebilirsiniz. ${remainingSlots} slot kaldı.`);
            return;
        }

        setError(null);
        const newFiles: PortfolioFile[] = [];

        for (let i = 0; i < selectedFiles.length && i < remainingSlots; i++) {
            const file = selectedFiles[i];

            // Type check
            if (!ALLOWED_TYPES.includes(file.type)) {
                setError(`${file.name}: Desteklenmeyen format. PNG, JPG, WebP kullanın.`);
                continue;
            }

            // Size check
            if (file.size > MAX_FILE_SIZE) {
                setError(`${file.name}: 5MB'dan büyük olamaz.`);
                continue;
            }

            newFiles.push({
                file,
                previewUrl: URL.createObjectURL(file)
            });
        }

        setFiles(prev => [...prev, ...newFiles]);

        // Clear input
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleRemoveFile = (index: number) => {
        URL.revokeObjectURL(files[index].previewUrl);
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleComplete = () => {
        onComplete(files);
    };

    const handleSkip = () => {
        // Dosyaları temizle
        files.forEach(f => URL.revokeObjectURL(f.previewUrl));
        setFiles([]);
        onSkip();
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#1a1a1a] border border-white/10 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden animate-scale-in flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/10 flex-shrink-0">
                    <div>
                        <h2 className="text-xl font-bold text-white">Portfolyo Ekle</h2>
                        <p className="text-sm text-gray-400 mt-1">
                            İşlerinizi sergilemek için görsel ekleyin (opsiyonel)
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-400" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
                    {/* Upload Area */}
                    <div
                        onClick={() => files.length < MAX_IMAGES && fileInputRef.current?.click()}
                        className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer ${files.length >= MAX_IMAGES
                            ? "border-gray-700 bg-gray-800/30 cursor-not-allowed"
                            : "border-white/20 hover:border-purple-500/50 hover:bg-purple-500/5"
                            }`}
                    >
                        {files.length >= MAX_IMAGES ? (
                            <div className="flex flex-col items-center gap-3">
                                <ImageIcon className="w-10 h-10 text-gray-500" />
                                <p className="text-gray-500">Maksimum görsel sayısına ulaşıldı</p>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-3">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600/20 to-blue-600/20 flex items-center justify-center">
                                    <Upload className="w-7 h-7 text-purple-400" />
                                </div>
                                <div>
                                    <p className="text-white font-medium">Görselleri yüklemek için tıklayın</p>
                                    <p className="text-sm text-gray-500 mt-1">
                                        PNG, JPG, WebP • Maks 5MB • {MAX_IMAGES - files.length} slot kaldı
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        multiple
                        onChange={handleFileSelect}
                        className="hidden"
                    />

                    {/* Error */}
                    {error && (
                        <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Selected Images Grid */}
                    {files.length > 0 && (
                        <div className="mt-6">
                            <p className="text-sm text-gray-400 mb-3">Seçilen görseller ({files.length}/{MAX_IMAGES})</p>
                            <div className="grid grid-cols-3 gap-3">
                                {files.map((pf, index) => (
                                    <div key={index} className="relative group aspect-square rounded-xl overflow-hidden bg-gray-800">
                                        <img
                                            src={pf.previewUrl}
                                            alt={pf.file.name}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <button
                                                onClick={() => handleRemoveFile(index)}
                                                className="p-2 bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4 text-white" />
                                            </button>
                                        </div>
                                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                                            <p className="text-xs text-white/70 truncate">{pf.file.name}</p>
                                        </div>
                                    </div>
                                ))}

                                {/* Add More Button */}
                                {files.length < MAX_IMAGES && (
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="aspect-square rounded-xl border-2 border-dashed border-white/20 hover:border-purple-500/50 flex items-center justify-center transition-colors"
                                    >
                                        <Plus className="w-6 h-6 text-gray-500" />
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between p-6 border-t border-white/10 bg-white/5 flex-shrink-0">
                    <button
                        onClick={handleSkip}
                        className="px-6 py-2.5 text-gray-400 hover:text-white transition-colors"
                    >
                        {files.length > 0 ? "Temizle" : "Atla"}
                    </button>
                    <button
                        onClick={handleComplete}
                        className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold rounded-xl transition-all"
                    >
                        {files.length > 0 ? (
                            <>
                                <Check className="w-4 h-4" />
                                <span>{files.length} Görsel Ekle</span>
                            </>
                        ) : (
                            <>
                                <span>Portfolyosuz Devam Et</span>
                                <ArrowRight className="w-4 h-4" />
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
