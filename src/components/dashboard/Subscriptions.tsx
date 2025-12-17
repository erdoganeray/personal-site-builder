"use client";

import { useEffect, useState } from "react";
import { toast } from "@/components/ui/Toast";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

interface SubscriptionInfo {
    plan: {
        type: string;
        name: string;
        price: number;
        limits: any;
    };
    usage: {
        edits: {
            used: number;
            limit: number;
            remaining: number;
            resetDate: string;
        };
        storage: {
            used: string;
            limit: string;
            usedMB: number;
            limitMB: number;
        };
    };
    sites: {
        total: number;
        published: number;
        publishedUrls: Array<{ id: string; url: string | null }>;
    };
    features: Array<{
        name: string;
        free: string | boolean;
        paid: string | boolean;
    }>;
}

export default function Subscriptions() {
    const [subscriptionInfo, setSubscriptionInfo] = useState<SubscriptionInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [publishing, setPublishing] = useState(false);
    const [unpublishing, setUnpublishing] = useState(false);

    useEffect(() => {
        fetchSubscriptionInfo();
    }, []);

    const fetchSubscriptionInfo = async () => {
        try {
            const response = await fetch("/api/subscription/info");
            if (response.ok) {
                const data = await response.json();
                setSubscriptionInfo(data);
            }
        } catch (error) {
            console.error("Error fetching subscription info:", error);
        } finally {
            setLoading(false);
        }
    };

    // Confirm dialog states
    const [confirmDialog, setConfirmDialog] = useState<{
        isOpen: boolean;
        type: "publish" | "unpublish" | null;
        siteId: string | null;
    }>({ isOpen: false, type: null, siteId: null });

    const handlePublish = async (siteId: string) => {
        setConfirmDialog({ isOpen: true, type: "publish", siteId });
    };

    const handleUnpublish = async (siteId: string) => {
        setConfirmDialog({ isOpen: true, type: "unpublish", siteId });
    };

    const handleConfirmAction = async () => {
        if (!confirmDialog.siteId) return;

        if (confirmDialog.type === "publish") {
            await executePublish(confirmDialog.siteId);
        } else if (confirmDialog.type === "unpublish") {
            await executeUnpublish(confirmDialog.siteId);
        }
        setConfirmDialog({ isOpen: false, type: null, siteId: null });
    };

    const executePublish = async (siteId: string) => {
        setPublishing(true);
        try {
            const response = await fetch("/api/site/publish", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ siteId }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(`Site başarıyla yayınlandı!`, {
                    description: data.cloudflareUrl
                });
                fetchSubscriptionInfo();
                window.open(data.cloudflareUrl, "_blank");
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

    const executeUnpublish = async (siteId: string) => {
        setUnpublishing(true);
        try {
            const response = await fetch("/api/site/unpublish", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ siteId }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success("Site yayından kaldırıldı!");
                fetchSubscriptionInfo();
            } else {
                toast.error(data.error || "Site yayından kaldırılamadı");
            }
        } catch (error) {
            console.error("Yayından kaldırma hatası:", error);
            toast.error("Bir hata oluştu. Lütfen tekrar deneyin.");
        } finally {
            setUnpublishing(false);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("tr-TR", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const renderFeatureValue = (value: string | boolean) => {
        if (typeof value === "boolean") {
            return value ? (
                <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
            ) : (
                <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            );
        }
        return <span className="text-sm text-gray-300">{value}</span>;
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Aboneliklerim</h2>
                    <p className="text-gray-400">Plan bilgilerinizi ve kullanım durumunuzu görüntüleyin</p>
                </div>

                {/* Skeleton for Current Plan Card */}
                <div className="bg-gradient-to-br from-blue-900/50 to-purple-900/50 rounded-xl border border-blue-700 p-6 animate-pulse">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <div className="h-8 bg-gray-700 rounded w-32 mb-2"></div>
                            <div className="h-5 bg-gray-700 rounded w-20"></div>
                        </div>
                        <div className="h-10 bg-gray-700 rounded-full w-32"></div>
                    </div>

                    {/* Skeleton for Usage Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div className="bg-gray-800/50 rounded-lg p-4">
                            <div className="h-4 bg-gray-700 rounded w-32 mb-2"></div>
                            <div className="h-10 bg-gray-700 rounded w-24 mb-2"></div>
                            <div className="h-2 bg-gray-700 rounded mb-2"></div>
                            <div className="h-3 bg-gray-700 rounded w-40"></div>
                        </div>
                        <div className="bg-gray-800/50 rounded-lg p-4">
                            <div className="h-4 bg-gray-700 rounded w-32 mb-2"></div>
                            <div className="h-10 bg-gray-700 rounded w-24 mb-2"></div>
                            <div className="h-2 bg-gray-700 rounded mb-2"></div>
                            <div className="h-3 bg-gray-700 rounded w-40"></div>
                        </div>
                        <div className="bg-gray-800/50 rounded-lg p-4">
                            <div className="h-4 bg-gray-700 rounded w-32 mb-2"></div>
                            <div className="h-10 bg-gray-700 rounded w-24 mb-2"></div>
                            <div className="h-3 bg-gray-700 rounded w-40 mt-2"></div>
                        </div>
                        <div className="bg-gray-800/50 rounded-lg p-4 md:col-span-2">
                            <div className="h-4 bg-gray-700 rounded w-32 mb-2"></div>
                            <div className="h-8 bg-gray-700 rounded w-24 mb-2"></div>
                            <div className="h-3 bg-gray-700 rounded w-48"></div>
                        </div>
                    </div>
                </div>

                {/* Skeleton for Plan Comparison */}
                <div>
                    <div className="h-7 bg-gray-700 rounded w-48 mb-4"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
                            <div className="h-6 bg-gray-700 rounded w-24 mb-2"></div>
                            <div className="h-10 bg-gray-700 rounded w-20 mb-4"></div>
                        </div>
                        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
                            <div className="h-6 bg-gray-700 rounded w-24 mb-2"></div>
                            <div className="h-10 bg-gray-700 rounded w-20 mb-4"></div>
                        </div>
                    </div>

                    {/* Skeleton for Feature Table */}
                    <div className="mt-6 bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                        <div className="bg-gray-700 p-4">
                            <div className="h-5 bg-gray-600 rounded w-32"></div>
                        </div>
                        <div className="divide-y divide-gray-700">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="p-4 flex gap-4">
                                    <div className="h-4 bg-gray-700 rounded flex-1"></div>
                                    <div className="h-4 bg-gray-700 rounded w-20"></div>
                                    <div className="h-4 bg-gray-700 rounded w-20"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!subscriptionInfo) {
        return (
            <div className="space-y-6">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Aboneliklerim</h2>
                    <p className="text-gray-400">Abonelik bilgileri yüklenemedi.</p>
                </div>
            </div>
        );
    }

    const isFree = subscriptionInfo.plan.type === "FREE";

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-white mb-2">Aboneliklerim</h2>
                <p className="text-gray-400">Plan bilgilerinizi ve kullanım durumunuzu görüntüleyin</p>
            </div>

            {/* Current Plan */}
            <div className="bg-gradient-to-br from-blue-900/50 to-purple-900/50 rounded-xl border border-blue-700 p-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="text-2xl font-bold text-white mb-1">{subscriptionInfo.plan.name}</h3>
                        <p className="text-blue-300">{subscriptionInfo.plan.price} TL/ay</p>
                    </div>
                    <div className="bg-blue-600 text-white px-4 py-2 rounded-full font-semibold">
                        Mevcut Plan
                    </div>
                </div>

                {/* Usage Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {/* Edit Rights */}
                    <div className="bg-gray-800/50 rounded-lg p-4">
                        <p className="text-gray-400 text-sm mb-1">Kalan Düzenleme Hakkı</p>
                        <p className="text-3xl font-bold text-white">
                            {subscriptionInfo.usage.edits.remaining}/{subscriptionInfo.usage.edits.limit}
                        </p>
                        <div className="mt-2 bg-gray-700 rounded-full h-2">
                            <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{
                                    width: `${(subscriptionInfo.usage.edits.remaining / subscriptionInfo.usage.edits.limit) * 100
                                        }%`,
                                }}
                            ></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                            Yenileme: {formatDate(subscriptionInfo.usage.edits.resetDate)}
                        </p>
                    </div>

                    {/* Storage */}
                    <div className="bg-gray-800/50 rounded-lg p-4">
                        <p className="text-gray-400 text-sm mb-1">Depolama Kullanımı</p>
                        <p className="text-3xl font-bold text-white">
                            {subscriptionInfo.usage.storage.usedMB.toFixed(2)} MB
                        </p>
                        <div className="mt-2 bg-gray-700 rounded-full h-2">
                            <div
                                className="bg-green-600 h-2 rounded-full"
                                style={{
                                    width: `${(subscriptionInfo.usage.storage.usedMB / subscriptionInfo.usage.storage.limitMB) * 100
                                        }%`,
                                }}
                            ></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                            Limit: {subscriptionInfo.usage.storage.limitMB.toFixed(0)} MB
                        </p>
                    </div>

                    {/* Version History (Dummy) */}
                    <div className="bg-gray-800/50 rounded-lg p-4">
                        <p className="text-gray-400 text-sm mb-1">Version History</p>
                        <p className="text-3xl font-bold text-white">{subscriptionInfo.plan.limits.versionHistory}</p>
                        <p className="text-xs text-gray-500 mt-2">Versiyon geçmişi (yakında)</p>
                    </div>

                    {/* Domain Reservation (Dummy) */}
                    <div className="bg-gray-800/50 rounded-lg p-4 md:col-span-2">
                        <p className="text-gray-400 text-sm mb-1">Domain Rezervasyonu</p>
                        <p className="text-2xl font-bold text-white">
                            {subscriptionInfo.plan.limits.domainReservationDays} gün
                        </p>
                        <p className="text-xs text-gray-500 mt-2">Domain rezervasyon süresi (yakında)</p>
                    </div>
                </div>

                {/* Publish/Unpublish Buttons */}
                {subscriptionInfo.sites.total > 0 && (
                    <div className="space-y-3 mt-4">
                        <h4 className="text-lg font-semibold text-white">Site Yönetimi</h4>
                        {subscriptionInfo.sites.publishedUrls.map((site) => (
                            <div key={site.id} className="bg-gray-700/50 rounded-lg p-4">
                                {site.url ? (
                                    <>
                                        <p className="text-sm text-gray-400 mb-2">Yayınlanan Site:</p>
                                        <a
                                            href={site.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-green-400 hover:text-green-300 underline break-all block mb-3"
                                        >
                                            {site.url}
                                        </a>
                                        <button
                                            onClick={() => handleUnpublish(site.id)}
                                            disabled={unpublishing}
                                            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
                                        >
                                            {unpublishing ? "Kaldırılıyor..." : "Yayından Kaldır"}
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={() => handlePublish(site.id)}
                                        disabled={publishing}
                                        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200"
                                    >
                                        {publishing ? "Yayınlanıyor..." : "Beğendim, Yayınla!"}
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Plan Comparison */}
            <div>
                <h3 className="text-xl font-bold text-white mb-4">Plan Karşılaştırması</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Free Plan */}
                    <div
                        className={`rounded-xl border p-6 transition-all duration-200 ${isFree
                            ? "bg-gradient-to-br from-blue-900/30 to-purple-900/30 border-blue-600"
                            : "bg-gray-800 border-gray-700"
                            }`}
                    >
                        <div className="mb-4">
                            <h4 className="text-xl font-bold text-white mb-2">Free Plan</h4>
                            <div className="flex items-baseline">
                                <span className="text-3xl font-bold text-white">0 TL</span>
                                <span className="text-gray-400 ml-1">/ay</span>
                            </div>
                        </div>

                        {isFree && (
                            <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold inline-block mb-4">
                                Mevcut Plan
                            </div>
                        )}
                    </div>

                    {/* Paid Plan */}
                    <div
                        className={`rounded-xl border p-6 transition-all duration-200 ${!isFree
                            ? "bg-gradient-to-br from-blue-900/30 to-purple-900/30 border-blue-600"
                            : "bg-gray-800 border-gray-700"
                            }`}
                    >
                        <div className="mb-4">
                            <h4 className="text-xl font-bold text-white mb-2">Paid Plan</h4>
                            <div className="flex items-baseline">
                                <span className="text-3xl font-bold text-white">150 TL</span>
                                <span className="text-gray-400 ml-1">/ay</span>
                            </div>
                        </div>

                        {!isFree && (
                            <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold inline-block mb-4">
                                Mevcut Plan
                            </div>
                        )}

                        {isFree && (
                            <button
                                disabled
                                className="w-full mt-4 bg-gray-700 text-gray-400 cursor-not-allowed py-3 px-4 rounded-lg font-semibold"
                            >
                                Yakında
                            </button>
                        )}
                    </div>
                </div>

                {/* Feature Comparison Table */}
                <div className="mt-6 bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-white">Özellik</th>
                                <th className="px-6 py-3 text-center text-sm font-semibold text-white">Free Plan</th>
                                <th className="px-6 py-3 text-center text-sm font-semibold text-white">Paid Plan</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {subscriptionInfo.features.map((feature, index) => (
                                <tr key={index} className="hover:bg-gray-700/50">
                                    <td className="px-6 py-4 text-sm text-gray-300">{feature.name}</td>
                                    <td className="px-6 py-4 text-center">{renderFeatureValue(feature.free)}</td>
                                    <td className="px-6 py-4 text-center">{renderFeatureValue(feature.paid)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Confirm Dialog */}
            <ConfirmDialog
                isOpen={confirmDialog.isOpen}
                onClose={() => setConfirmDialog({ isOpen: false, type: null, siteId: null })}
                onConfirm={handleConfirmAction}
                title={confirmDialog.type === "publish" ? "Siteyi Yayınla" : "Siteyi Yayından Kaldır"}
                message={confirmDialog.type === "publish"
                    ? "Sitenizi yayınlamak istediğinizden emin misiniz?"
                    : "Sitenizi yayından kaldırmak istediğinizden emin misiniz?"
                }
                confirmText={confirmDialog.type === "publish" ? "Yayınla" : "Yayından Kaldır"}
                variant={confirmDialog.type === "publish" ? "info" : "warning"}
                loading={publishing || unpublishing}
            />
        </div>
    );
}
