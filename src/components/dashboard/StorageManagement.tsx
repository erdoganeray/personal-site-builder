"use client";

import { useState, useEffect } from "react";
import { toast } from "@/components/ui/Toast";

interface FileInfo {
    name: string;
    size: number;
    type: string;
}

interface StorageSection {
    files: FileInfo[];
    total: number;
    count: number;
}

interface RollbackFile {
    id: string;
    assetKey: string;
    assetType: string;
    deletedAt: string;
    autoDeleteDate: string;
    size: number;
    thumbnailUrl: string;
}

export default function StorageManagement() {
    const [loading, setLoading] = useState(true);
    const [userInfo, setUserInfo] = useState<StorageSection | null>(null);
    const [published, setPublished] = useState<StorageSection | null>(null);
    const [rollback, setRollback] = useState<StorageSection | null>(null);
    const [rollbackFiles, setRollbackFiles] = useState<RollbackFile[]>([]);
    const [grandTotal, setGrandTotal] = useState(0);

    const [expandedSections, setExpandedSections] = useState({
        userInfo: false,
        published: false,
        rollback: true, // Rollback section expanded by default
    });

    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        fetchStorageData();
        fetchRollbackFiles();
    }, []);

    const fetchStorageData = async () => {
        try {
            const response = await fetch("/api/storage/breakdown");
            if (response.ok) {
                const data = await response.json();
                setUserInfo(data.userInfo);
                setPublished(data.published);
                setRollback(data.rollback);
                setGrandTotal(data.grandTotal);
            }
        } catch (error) {
            console.error("Failed to fetch storage data:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchRollbackFiles = async () => {
        try {
            const response = await fetch("/api/storage/rollback/list");
            if (response.ok) {
                const data = await response.json();
                setRollbackFiles(data.files);
            }
        } catch (error) {
            console.error("Failed to fetch rollback files:", error);
        }
    };

    const handleDeleteRollbackFile = async (assetId: string) => {
        setDeleting(true);
        try {
            const response = await fetch("/api/storage/rollback/delete", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ assetId }),
            });

            if (response.ok) {
                // Refresh data
                await fetchStorageData();
                await fetchRollbackFiles();
                setDeleteConfirm(null);
                toast.success("Dosya başarıyla silindi!");
            } else {
                const data = await response.json();
                toast.error(data.error || "Dosya silinemedi");
            }
        } catch (error) {
            console.error("Failed to delete file:", error);
            toast.error("Bir hata oluştu");
        } finally {
            setDeleting(false);
        }
    };

    const formatBytes = (bytes: number) => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("tr-TR", {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const toggleSection = (section: keyof typeof expandedSections) => {
        setExpandedSections((prev) => ({
            ...prev,
            [section]: !prev[section],
        }));
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Depolama Yönetimi</h2>
                    <p className="text-gray-400">
                        Depolama alanınızı yönetin ve kullanımınızı görüntüleyin
                    </p>
                </div>

                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-gray-800 rounded-xl border border-gray-700 p-6">
                            <div className="h-6 bg-gray-700 rounded animate-pulse mb-4 w-1/3"></div>
                            <div className="h-4 bg-gray-700 rounded animate-pulse w-1/2"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-white mb-2">Depolama Yönetimi</h2>
                <p className="text-gray-400">
                    Depolama alanınızı yönetin ve kullanımınızı görüntüleyin
                </p>
            </div>

            {/* Total Storage Overview */}
            <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-xl border border-purple-700/50 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-1">Toplam Depolama Kullanımı</h3>
                        <p className="text-gray-400 text-sm">Tüm dosyalarınızın toplam boyutu</p>
                    </div>
                    <div className="text-right">
                        <p className="text-3xl font-bold text-white">{formatBytes(grandTotal)}</p>
                    </div>
                </div>
            </div>

            {/* User Info Content Storage */}
            <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                <button
                    onClick={() => toggleSection("userInfo")}
                    className="w-full p-6 flex items-center justify-between hover:bg-gray-700/50 transition-colors"
                >
                    <div className="flex items-center gap-4">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-8 w-8 text-blue-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                        </svg>
                        <div className="text-left">
                            <h3 className="text-xl font-bold text-white">Bilgilerimdeki İçerikler</h3>
                            <p className="text-gray-400 text-sm">
                                CV, profil fotoğrafı ve portföy fotoğrafları
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <p className="text-2xl font-bold text-white">{formatBytes(userInfo?.total || 0)}</p>
                            <p className="text-sm text-gray-400">{userInfo?.count || 0} dosya</p>
                        </div>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className={`h-6 w-6 text-gray-400 transition-transform ${expandedSections.userInfo ? "rotate-180" : ""
                                }`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </button>

                {expandedSections.userInfo && (
                    <div className="border-t border-gray-700 p-6">
                        {userInfo && userInfo.files.length > 0 ? (
                            <div className="space-y-3">
                                {userInfo.files.map((file, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                                                <span className="text-white font-bold text-sm">
                                                    {file.type === "pdf" ? "PDF" : "IMG"}
                                                </span>
                                            </div>
                                            <span className="text-white font-medium">{file.name}</span>
                                        </div>
                                        <span className="text-gray-400">{formatBytes(file.size)}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-400 text-center py-4">Henüz dosya yüklenmemiş</p>
                        )}
                    </div>
                )}
            </div>

            {/* Published Site Files Storage */}
            <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                <button
                    onClick={() => toggleSection("published")}
                    className="w-full p-6 flex items-center justify-between hover:bg-gray-700/50 transition-colors"
                >
                    <div className="flex items-center gap-4">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-8 w-8 text-green-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                            />
                        </svg>
                        <div className="text-left">
                            <h3 className="text-xl font-bold text-white">Yayınlanmış Site Dosyaları</h3>
                            <p className="text-gray-400 text-sm">HTML, CSS ve JavaScript dosyaları</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <p className="text-2xl font-bold text-white">{formatBytes(published?.total || 0)}</p>
                            <p className="text-sm text-gray-400">{published?.count || 0} dosya</p>
                        </div>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className={`h-6 w-6 text-gray-400 transition-transform ${expandedSections.published ? "rotate-180" : ""
                                }`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </button>

                {expandedSections.published && (
                    <div className="border-t border-gray-700 p-6">
                        {published && published.files.length > 0 ? (
                            <div className="space-y-3">
                                {published.files.map((file, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                                                <span className="text-white font-bold text-xs uppercase">
                                                    {file.type}
                                                </span>
                                            </div>
                                            <span className="text-white font-medium">{file.name}</span>
                                        </div>
                                        <span className="text-gray-400">{formatBytes(file.size)}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-400 text-center py-4">Site henüz yayınlanmamış</p>
                        )}
                    </div>
                )}
            </div>

            {/* Rollback Files Storage */}
            <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                <button
                    onClick={() => toggleSection("rollback")}
                    className="w-full p-6 flex items-center justify-between hover:bg-gray-700/50 transition-colors"
                >
                    <div className="flex items-center gap-4">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-8 w-8 text-orange-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        <div className="text-left">
                            <h3 className="text-xl font-bold text-white">Rollback Dosyaları</h3>
                            <p className="text-gray-400 text-sm">Silinmeyi bekleyen fotoğraflar (30 gün)</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <p className="text-2xl font-bold text-white">{formatBytes(rollback?.total || 0)}</p>
                            <p className="text-sm text-gray-400">{rollbackFiles.length} dosya</p>
                        </div>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className={`h-6 w-6 text-gray-400 transition-transform ${expandedSections.rollback ? "rotate-180" : ""
                                }`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </button>

                {expandedSections.rollback && (
                    <div className="border-t border-gray-700 p-6">
                        {rollbackFiles.length > 0 ? (
                            <div className="space-y-4">
                                {rollbackFiles.map((file) => (
                                    <div
                                        key={file.id}
                                        className="p-4 bg-gray-700/50 rounded-lg border border-gray-600"
                                    >
                                        <div className="flex items-start gap-4">
                                            {/* Thumbnail */}
                                            <button
                                                onClick={() => setSelectedImage(file.thumbnailUrl)}
                                                className="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden hover:ring-2 hover:ring-purple-500 transition-all"
                                            >
                                                <img
                                                    src={file.thumbnailUrl}
                                                    alt={file.assetType}
                                                    className="w-full h-full object-cover"
                                                />
                                            </button>

                                            {/* File Info */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-4">
                                                    <div>
                                                        <h4 className="text-white font-semibold mb-1">
                                                            {file.assetType === "profile"
                                                                ? "Profil Fotoğrafı"
                                                                : "Portföy Fotoğrafı"}
                                                        </h4>
                                                        <p className="text-sm text-gray-400 mb-2">
                                                            Boyut: {formatBytes(file.size)}
                                                        </p>
                                                        <div className="space-y-1 text-sm">
                                                            <p className="text-gray-400">
                                                                <span className="text-gray-500">Silinme Tarihi:</span>{" "}
                                                                {formatDate(file.deletedAt)}
                                                            </p>
                                                            <p className="text-orange-400">
                                                                <span className="text-gray-500">Otomatik Silinme:</span>{" "}
                                                                {formatDate(file.autoDeleteDate)}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Delete Button */}
                                                    <button
                                                        onClick={() => setDeleteConfirm(file.id)}
                                                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center gap-2"
                                                    >
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            className="h-4 w-4"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke="currentColor"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                            />
                                                        </svg>
                                                        Şimdi Sil
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-16 w-16 text-gray-600 mx-auto mb-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                                <p className="text-gray-400 text-lg">Rollback dosyası yok</p>
                                <p className="text-gray-500 text-sm mt-2">
                                    Sildiğiniz fotoğraflar burada görünecektir
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Image Modal */}
            {selectedImage && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
                    onClick={() => setSelectedImage(null)}
                >
                    <div className="max-w-4xl max-h-[90vh] relative">
                        <button
                            onClick={() => setSelectedImage(null)}
                            className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-8 w-8"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                        <img
                            src={selectedImage}
                            alt="Full size"
                            className="max-w-full max-h-[90vh] object-contain rounded-lg"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-800 rounded-xl border-2 border-red-700 p-6 max-w-md w-full">
                        <div className="flex items-center gap-3 mb-4">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-8 w-8 text-red-500"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                />
                            </svg>
                            <h3 className="text-xl font-bold text-red-500">Dosyayı Kalıcı Olarak Sil</h3>
                        </div>

                        <p className="text-gray-300 mb-6">
                            Bu dosyayı kalıcı olarak silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
                        </p>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setDeleteConfirm(null)}
                                disabled={deleting}
                                className="flex-1 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                            >
                                İptal
                            </button>
                            <button
                                onClick={() => handleDeleteRollbackFile(deleteConfirm)}
                                disabled={deleting}
                                className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                            >
                                {deleting ? (
                                    <>
                                        <svg
                                            className="animate-spin h-5 w-5"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            ></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            ></path>
                                        </svg>
                                        <span>Siliniyor...</span>
                                    </>
                                ) : (
                                    "Sil"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
