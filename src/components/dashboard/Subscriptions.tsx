"use client";

import { useEffect, useState } from "react";
import { toast } from "@/components/ui/Toast";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import {
    CreditCard,
    Edit3,
    HardDrive,
    Clock,
    Globe,
    Check,
    X,
    Crown,
    Zap,
    ExternalLink,
    XCircle
} from "lucide-react";

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
                <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                    <Check className="h-4 w-4 text-green-400" />
                </div>
            ) : (
                <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center">
                    <X className="h-4 w-4 text-red-400" />
                </div>
            );
        }
        return <span className="text-sm text-gray-300">{value}</span>;
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Faturalandırma</h2>
                    <p className="text-gray-400">Plan bilgilerinizi ve kullanım durumunuzu görüntüleyin</p>
                </div>

                {/* Skeleton for Current Plan Card */}
                <div className="relative bg-[#1a1a1a]/60 backdrop-blur-xl rounded-2xl border border-white/10 p-6 animate-pulse overflow-hidden">
                    {/* Background Gradient Effects */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px] -mr-32 -mt-32" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/10 rounded-full blur-[60px] -ml-24 -mb-24" />

                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <div className="h-8 bg-white/10 rounded-lg w-32 mb-2"></div>
                                <div className="h-5 bg-white/10 rounded-lg w-20"></div>
                            </div>
                            <div className="h-10 bg-white/10 rounded-xl w-32"></div>
                        </div>

                        {/* Skeleton for Usage Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className={`bg-[#0f0f0f]/80 rounded-xl p-4 border border-white/5 ${i === 4 ? 'md:col-span-2' : ''}`}>
                                    <div className="h-4 bg-white/10 rounded w-32 mb-2"></div>
                                    <div className="h-10 bg-white/10 rounded w-24 mb-2"></div>
                                    <div className="h-2 bg-white/10 rounded mb-2"></div>
                                    <div className="h-3 bg-white/10 rounded w-40"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Skeleton for Plan Comparison */}
                <div>
                    <div className="h-7 bg-white/10 rounded-lg w-48 mb-4"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[1, 2].map((i) => (
                            <div key={i} className="bg-[#1a1a1a]/60 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
                                <div className="h-6 bg-white/10 rounded w-24 mb-2"></div>
                                <div className="h-10 bg-white/10 rounded w-20 mb-4"></div>
                            </div>
                        ))}
                    </div>

                    {/* Skeleton for Feature Table */}
                    <div className="mt-6 bg-[#1a1a1a]/60 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
                        <div className="bg-[#0f0f0f]/80 p-4 border-b border-white/5">
                            <div className="h-5 bg-white/10 rounded w-32"></div>
                        </div>
                        <div className="divide-y divide-white/5">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="p-4 flex gap-4">
                                    <div className="h-4 bg-white/10 rounded flex-1"></div>
                                    <div className="h-4 bg-white/10 rounded w-20"></div>
                                    <div className="h-4 bg-white/10 rounded w-20"></div>
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
                    <h2 className="text-2xl font-bold text-white mb-2">Faturalandırma</h2>
                    <p className="text-gray-400">Abonelik bilgileri yüklenemedi.</p>
                </div>
            </div>
        );
    }

    const isFree = subscriptionInfo.plan.type === "FREE";

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-white mb-2">Faturalandırma</h2>
                <p className="text-gray-400">Plan bilgilerinizi ve kullanım durumunuzu görüntüleyin</p>
            </div>

            {/* Current Plan Card */}
            <div className="relative bg-[#1a1a1a]/60 backdrop-blur-xl rounded-2xl border border-white/10 p-6 overflow-hidden">
                {/* Background Gradient Effects */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px] -mr-32 -mt-32" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/10 rounded-full blur-[60px] -ml-24 -mb-24" />

                <div className="relative z-10">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center border border-white/5">
                                <CreditCard className="w-6 h-6 text-purple-400" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-white">{subscriptionInfo.plan.name}</h3>
                                <p className="text-gray-400">{subscriptionInfo.plan.price} TL/ay</p>
                            </div>
                        </div>
                        <div className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold flex items-center gap-2 shadow-lg shadow-purple-500/20">
                            <Crown className="w-4 h-4" />
                            Mevcut Plan
                        </div>
                    </div>

                    {/* Usage Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        {/* Edit Rights */}
                        <div className="bg-[#0f0f0f]/80 rounded-xl p-4 border border-white/5">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center border border-white/5">
                                    <Edit3 className="w-4 h-4 text-purple-400" />
                                </div>
                                <p className="text-gray-400 text-sm">Kalan Düzenleme Hakkı</p>
                            </div>
                            <p className="text-3xl font-bold text-white mb-2">
                                {subscriptionInfo.usage.edits.remaining}/{subscriptionInfo.usage.edits.limit}
                            </p>
                            <div className="bg-[#1a1a1a] rounded-full h-2 overflow-hidden">
                                <div
                                    className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-300"
                                    style={{
                                        width: `${(subscriptionInfo.usage.edits.remaining / subscriptionInfo.usage.edits.limit) * 100}%`,
                                    }}
                                ></div>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                                Yenileme: {formatDate(subscriptionInfo.usage.edits.resetDate)}
                            </p>
                        </div>

                        {/* Storage */}
                        <div className="bg-[#0f0f0f]/80 rounded-xl p-4 border border-white/5">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center border border-white/5">
                                    <HardDrive className="w-4 h-4 text-green-400" />
                                </div>
                                <p className="text-gray-400 text-sm">Depolama Kullanımı</p>
                            </div>
                            <p className="text-3xl font-bold text-white mb-2">
                                {subscriptionInfo.usage.storage.usedMB.toFixed(2)} MB
                            </p>
                            <div className="bg-[#1a1a1a] rounded-full h-2 overflow-hidden">
                                <div
                                    className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
                                    style={{
                                        width: `${(subscriptionInfo.usage.storage.usedMB / subscriptionInfo.usage.storage.limitMB) * 100}%`,
                                    }}
                                ></div>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                                Limit: {subscriptionInfo.usage.storage.limitMB.toFixed(0)} MB
                            </p>
                        </div>

                        {/* Version History */}
                        <div className="bg-[#0f0f0f]/80 rounded-xl p-4 border border-white/5">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center border border-white/5">
                                    <Clock className="w-4 h-4 text-amber-400" />
                                </div>
                                <p className="text-gray-400 text-sm">Versiyon Geçmişi</p>
                            </div>
                            <p className="text-3xl font-bold text-white">{subscriptionInfo.plan.limits.versionHistory}</p>
                            <p className="text-xs text-gray-500 mt-2">Versiyon geçmişi (yakında)</p>
                        </div>

                        {/* Domain Reservation */}
                        <div className="bg-[#0f0f0f]/80 rounded-xl p-4 border border-white/5">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center border border-white/5">
                                    <Globe className="w-4 h-4 text-cyan-400" />
                                </div>
                                <p className="text-gray-400 text-sm">Domain Rezervasyonu</p>
                            </div>
                            <p className="text-2xl font-bold text-white">
                                {subscriptionInfo.plan.limits.domainReservationDays} gün
                            </p>
                            <p className="text-xs text-gray-500 mt-2">Domain rezervasyon süresi (yakında)</p>
                        </div>
                    </div>

                    {/* Publish/Unpublish Buttons */}
                    {subscriptionInfo.sites.total > 0 && (
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center border border-white/5">
                                    <Zap className="w-4 h-4 text-purple-400" />
                                </div>
                                <h4 className="text-lg font-semibold text-white">Site Yönetimi</h4>
                            </div>
                            {subscriptionInfo.sites.publishedUrls.map((site) => (
                                <div key={site.id} className="bg-[#0f0f0f]/80 rounded-xl p-4 border border-white/5">
                                    {site.url ? (
                                        <>
                                            <p className="text-sm text-gray-400 mb-2">Yayınlanan Site:</p>
                                            <a
                                                href={site.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-green-400 hover:text-green-300 underline break-all block mb-3 flex items-center gap-2"
                                            >
                                                {site.url}
                                                <ExternalLink className="w-4 h-4 flex-shrink-0" />
                                            </a>
                                            <button
                                                onClick={() => handleUnpublish(site.id)}
                                                disabled={unpublishing}
                                                className="w-full bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 hover:border-red-500/50 disabled:opacity-50 text-red-400 hover:text-red-300 font-bold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
                                            >
                                                <XCircle className="w-5 h-5" />
                                                {unpublishing ? "Kaldırılıyor..." : "Yayından Kaldır"}
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            onClick={() => handlePublish(site.id)}
                                            disabled={publishing}
                                            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-green-500/20"
                                        >
                                            <Zap className="w-5 h-5" />
                                            {publishing ? "Yayınlanıyor..." : "Beğendim, Yayınla!"}
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Plan Comparison */}
            <div>
                <h3 className="text-xl font-bold text-white mb-4">Plan Karşılaştırması</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Free Plan */}
                    <div
                        className={`relative rounded-2xl border p-6 transition-all duration-200 overflow-hidden ${isFree
                            ? "bg-[#1a1a1a]/60 backdrop-blur-xl border-purple-500/30"
                            : "bg-[#1a1a1a]/60 backdrop-blur-xl border-white/10"
                            }`}
                    >
                        {isFree && (
                            <>
                                <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/10 rounded-full blur-[60px] -mr-24 -mt-24" />
                                <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full blur-[40px] -ml-16 -mb-16" />
                            </>
                        )}
                        <div className="relative z-10">
                            <div className="mb-4">
                                <h4 className="text-xl font-bold text-white mb-2">Free Plan</h4>
                                <div className="flex items-baseline">
                                    <span className="text-3xl font-bold text-white">0 TL</span>
                                    <span className="text-gray-400 ml-1">/ay</span>
                                </div>
                            </div>

                            {isFree && (
                                <div className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl text-sm font-semibold inline-flex items-center gap-2 shadow-lg shadow-purple-500/20">
                                    <Crown className="w-4 h-4" />
                                    Mevcut Plan
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Paid Plan */}
                    <div
                        className={`relative rounded-2xl border p-6 transition-all duration-200 overflow-hidden ${!isFree
                            ? "bg-[#1a1a1a]/60 backdrop-blur-xl border-purple-500/30"
                            : "bg-[#1a1a1a]/60 backdrop-blur-xl border-white/10"
                            }`}
                    >
                        {!isFree && (
                            <>
                                <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/10 rounded-full blur-[60px] -mr-24 -mt-24" />
                                <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full blur-[40px] -ml-16 -mb-16" />
                            </>
                        )}
                        <div className="relative z-10">
                            <div className="mb-4">
                                <h4 className="text-xl font-bold text-white mb-2">Pro Plan</h4>
                                <div className="flex items-baseline">
                                    <span className="text-3xl font-bold text-white">150 TL</span>
                                    <span className="text-gray-400 ml-1">/ay</span>
                                </div>
                            </div>

                            {!isFree ? (
                                <div className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl text-sm font-semibold inline-flex items-center gap-2 shadow-lg shadow-purple-500/20">
                                    <Crown className="w-4 h-4" />
                                    Mevcut Plan
                                </div>
                            ) : (
                                <button
                                    disabled
                                    className="w-full mt-4 py-3 px-4 rounded-xl font-semibold bg-white/5 border border-white/10 text-gray-500 cursor-not-allowed"
                                >
                                    Yakında
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Feature Comparison Table */}
                <div className="mt-6 bg-[#1a1a1a]/60 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-[#0f0f0f]/80 border-b border-white/5">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-white">Özellik</th>
                                <th className="px-6 py-4 text-center text-sm font-semibold text-white">Free Plan</th>
                                <th className="px-6 py-4 text-center text-sm font-semibold text-white">Pro Plan</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {subscriptionInfo.features.map((feature, index) => (
                                <tr key={index} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4 text-sm text-gray-300">{feature.name}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex justify-center">{renderFeatureValue(feature.free)}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex justify-center">{renderFeatureValue(feature.paid)}</div>
                                    </td>
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
