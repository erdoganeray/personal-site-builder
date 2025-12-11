"use client";

import { useState, useRef } from "react";

interface UploadProgress {
    fileName: string;
    fileSize: number;
    progress: number;
    status: 'uploading' | 'success' | 'error';
    error?: string;
    url?: string;
    xhr?: XMLHttpRequest;
}

interface PortfolioUploaderProps {
    currentCount: number;
    maxCount?: number;
    onUploadComplete: (urls: string[]) => void;
    disabled?: boolean;
    existingFiles?: Array<{ fileName: string; fileSize: number }>;  // NEW: For duplicate detection
}

export default function PortfolioUploader({
    currentCount,
    maxCount = 10,
    onUploadComplete,
    disabled = false,
    existingFiles = []
}: PortfolioUploaderProps) {
    const [uploads, setUploads] = useState<UploadProgress[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const remainingSlots = maxCount - currentCount;

    // Format file size helper
    const formatFileSize = (bytes: number): string => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    const handleFileSelect = (files: FileList | null) => {
        if (!files || files.length === 0) return;

        const fileArray = Array.from(files);

        // Check if adding these files would exceed the limit
        if (currentCount + fileArray.length > maxCount) {
            alert(`Maksimum ${maxCount} adet portfolio fotoğrafı ekleyebilirsiniz. Şu anda ${currentCount} fotoğrafınız var. ${remainingSlots} adet daha ekleyebilirsiniz.`);
            return;
        }

        // Validate files
        const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
        const maxSize = 5 * 1024 * 1024; // 5MB

        const validFiles: File[] = [];
        const errors: string[] = [];
        const duplicates: string[] = [];

        fileArray.forEach(file => {
            // Check for duplicates
            const isDuplicate = existingFiles.some(
                existing => existing.fileName === file.name && existing.fileSize === file.size
            );

            if (isDuplicate) {
                duplicates.push(file.name);
            } else if (!allowedTypes.includes(file.type)) {
                errors.push(`${file.name}: Sadece JPEG, PNG ve WebP formatları desteklenmektedir`);
            } else if (file.size > maxSize) {
                errors.push(`${file.name}: Dosya boyutu 5MB'dan küçük olmalıdır (${formatFileSize(file.size)})`);
            } else if (file.size === 0) {
                errors.push(`${file.name}: Dosya boş, geçerli bir resim dosyası seçin`);
            } else {
                validFiles.push(file);
            }
        });

        // Show errors and warnings
        const messages: string[] = [];

        if (duplicates.length > 0) {
            messages.push(`⚠️ Zaten yüklenmiş dosyalar (atlandı):\n${duplicates.join('\n')}`);
        }

        if (errors.length > 0) {
            messages.push(`❌ Geçersiz dosyalar:\n${errors.join('\n')}`);
        }

        if (messages.length > 0) {
            alert(messages.join('\n\n'));
        }

        if (validFiles.length > 0) {
            uploadFiles(validFiles);
        } else if (duplicates.length > 0 && errors.length === 0) {
            // Only duplicates, inform user
            alert('Seçilen tüm dosyalar zaten yüklenmiş.');
        }
    };

    const uploadSingleFile = (file: File, index: number): Promise<string> => {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            const formData = new FormData();
            formData.append('file', file);

            // Track upload progress
            xhr.upload.onprogress = (e) => {
                if (e.lengthComputable) {
                    const percentComplete = Math.round((e.loaded / e.total) * 100);
                    setUploads(prev => prev.map(p =>
                        p.fileName === file.name && p.status === 'uploading'
                            ? { ...p, progress: percentComplete }
                            : p
                    ));
                }
            };

            // Handle completion
            xhr.onload = () => {
                if (xhr.status === 200) {
                    try {
                        const data = JSON.parse(xhr.responseText);
                        // API returns batch format: { uploads: [{ url: "..." }] }
                        // Extract URL from either batch format or single format
                        const url = data.uploads?.[0]?.url || data.url;
                        
                        console.log('Upload response:', data);
                        console.log('Extracted URL:', url);
                        
                        if (!url) {
                            throw new Error('No URL in response');
                        }
                        
                        setUploads(prev => prev.map(p =>
                            p.fileName === file.name
                                ? { ...p, progress: 100, status: 'success', url: url, xhr: undefined }
                                : p
                        ));
                        resolve(url);
                    } catch (error) {
                        console.error('Parse error:', error);
                        setUploads(prev => prev.map(p =>
                            p.fileName === file.name
                                ? { ...p, progress: 100, status: 'error', error: 'Yanıt ayrıştırılamadı', xhr: undefined }
                                : p
                        ));
                        reject(new Error('Parse error'));
                    }
                } else {
                    try {
                        const data = JSON.parse(xhr.responseText);
                        setUploads(prev => prev.map(p =>
                            p.fileName === file.name
                                ? { ...p, progress: 100, status: 'error', error: data.error || 'Yükleme başarısız', xhr: undefined }
                                : p
                        ));
                    } catch {
                        setUploads(prev => prev.map(p =>
                            p.fileName === file.name
                                ? { ...p, progress: 100, status: 'error', error: 'Yükleme başarısız', xhr: undefined }
                                : p
                        ));
                    }
                    reject(new Error('Upload failed'));
                }
            };

            // Handle errors
            xhr.onerror = () => {
                setUploads(prev => prev.map(p =>
                    p.fileName === file.name
                        ? { ...p, progress: 100, status: 'error', error: 'Ağ hatası', xhr: undefined }
                        : p
                ));
                reject(new Error('Network error'));
            };

            // Handle abort
            xhr.onabort = () => {
                setUploads(prev => prev.map(p =>
                    p.fileName === file.name
                        ? { ...p, progress: 100, status: 'error', error: 'İptal edildi', xhr: undefined }
                        : p
                ));
                reject(new Error('Cancelled'));
            };

            // Store XHR for cancellation
            setUploads(prev => prev.map(p =>
                p.fileName === file.name && p.status === 'uploading'
                    ? { ...p, xhr }
                    : p
            ));

            xhr.open('POST', '/api/upload/portfolio');
            xhr.send(formData);
        });
    };

    const uploadFiles = async (files: File[]) => {
        console.log('uploadFiles called with files:', files);

        // Initialize progress for all files with file size
        const initialProgress: UploadProgress[] = files.map(file => ({
            fileName: file.name,
            fileSize: file.size,
            progress: 0,
            status: 'uploading' as const
        }));

        setUploads(prev => [...prev, ...initialProgress]);

        // Upload files sequentially for better progress tracking
        const successfulUrls: string[] = [];

        for (let i = 0; i < files.length; i++) {
            console.log(`Uploading file ${i + 1}/${files.length}:`, files[i].name);
            try {
                const url = await uploadSingleFile(files[i], i);
                console.log(`File ${i + 1} uploaded successfully:`, url);
                successfulUrls.push(url);
            } catch (error) {
                console.error(`Failed to upload ${files[i].name}:`, error);
                // Continue with next file even if one fails
            }
        }

        console.log('All uploads complete. Successful URLs:', successfulUrls);
        console.log('successfulUrls.length:', successfulUrls.length);

        // Notify parent component of successful uploads
        if (successfulUrls.length > 0) {
            console.log('Calling onUploadComplete with:', successfulUrls);
            onUploadComplete(successfulUrls);

            // Show summary
            setTimeout(() => {
                const total = files.length;
                const successful = successfulUrls.length;
                const message = successful === total
                    ? `${successful} dosya başarıyla yüklendi!`
                    : `${successful}/${total} dosya yüklendi. ${total - successful} dosya başarısız.`;
                alert(message + '\n\nDeğişiklikleri kaydetmeyi unutmayın!');
            }, 500);
        } else if (files.length > 0) {
            console.log('No files uploaded successfully');
            alert('Hiçbir dosya yüklenemedi. Lütfen tekrar deneyin.');
        }
    };

    const handleCancelUpload = (fileName: string) => {
        const upload = uploads.find(u => u.fileName === fileName);
        if (upload?.xhr) {
            upload.xhr.abort();
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        handleFileSelect(e.dataTransfer.files);
    };

    const clearCompleted = () => {
        setUploads(prev => prev.filter(u => u.status === 'uploading'));
    };

    const hasActiveUploads = uploads.some(u => u.status === 'uploading');
    const hasCompletedUploads = uploads.some(u => u.status !== 'uploading');

    return (
        <div className="space-y-4">
            {/* Upload Area */}
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${isDragging
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-gray-600 hover:border-gray-500'
                    } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                onClick={() => !disabled && fileInputRef.current?.click()}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={(e) => handleFileSelect(e.target.files)}
                    disabled={disabled}
                    className="hidden"
                />

                <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                >
                    <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>

                <p className="mt-2 text-sm text-gray-300">
                    <span className="font-semibold">Dosyaları sürükleyip bırakın</span> veya tıklayın
                </p>
                <p className="mt-1 text-xs text-gray-400">
                    JPEG, PNG, WebP (Maksimum 5MB, {remainingSlots} adet daha ekleyebilirsiniz)
                </p>
            </div>

            {/* Upload Progress */}
            {uploads.length > 0 && (
                <div className="bg-gray-700/50 rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-center">
                        <h4 className="text-sm font-semibold text-white">
                            Yükleme Durumu ({uploads.filter(u => u.status === 'success').length}/{uploads.length})
                        </h4>
                        {hasCompletedUploads && !hasActiveUploads && (
                            <button
                                onClick={clearCompleted}
                                className="text-xs text-gray-400 hover:text-gray-300 transition-colors"
                            >
                                Temizle
                            </button>
                        )}
                    </div>

                    <div className="space-y-3">
                        {uploads.map((upload, index) => (
                            <div key={index} className="space-y-1.5">
                                <div className="flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-2 flex-1 min-w-0">
                                        <span className="text-gray-300 truncate">
                                            {upload.fileName}
                                        </span>
                                        <span className="text-gray-500 text-xs flex-shrink-0">
                                            ({formatFileSize(upload.fileSize)})
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        <span className={`font-medium ${upload.status === 'success' ? 'text-green-400' :
                                            upload.status === 'error' ? 'text-red-400' :
                                                'text-blue-400'
                                            }`}>
                                            {upload.status === 'success' ? '✓ Tamamlandı' :
                                                upload.status === 'error' ? '✗ Hata' :
                                                    `${upload.progress}%`}
                                        </span>
                                        {upload.status === 'uploading' && (
                                            <button
                                                onClick={() => handleCancelUpload(upload.fileName)}
                                                className="text-gray-400 hover:text-red-400 transition-colors"
                                                title="İptal et"
                                            >
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                <div className="w-full bg-gray-600 rounded-full h-2 overflow-hidden">
                                    <div
                                        className={`h-full transition-all duration-300 ease-out ${upload.status === 'success' ? 'bg-green-500' :
                                            upload.status === 'error' ? 'bg-red-500' :
                                                'bg-blue-500'
                                            }`}
                                        style={{ width: `${upload.progress}%` }}
                                    />
                                </div>

                                {/* Error Message */}
                                {upload.error && (
                                    <p className="text-xs text-red-400 mt-1">{upload.error}</p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
