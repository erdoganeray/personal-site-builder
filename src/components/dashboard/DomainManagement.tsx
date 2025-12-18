"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/Toast";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import {
    Globe,
    Link2,
    Check,
    X,
    Loader2,
    Rocket,
    XCircle,
    AlertTriangle,
    Clock,
    ExternalLink,
    Info,
    Shield,
    Trash2,
    ArrowRight,
    FileText,
    Settings2,
    CheckCircle2,
    Sparkles
} from "lucide-react";

interface DomainManagementProps {
    // Props can be added if needed
}

export default function DomainManagement() {
    const router = useRouter();
    const [site, setSite] = useState<any>(null);
    const [userPlan, setUserPlan] = useState<string>("FREE");
    const [loading, setLoading] = useState(true);

    // Subdomain management
    const [subdomain, setSubdomain] = useState("");
    const [subdomainStatus, setSubdomainStatus] = useState<"idle" | "checking" | "available" | "taken">("idle");
    const [subdomainMessage, setSubdomainMessage] = useState("");
    const [savingSubdomain, setSavingSubdomain] = useState(false);

    // Publishing
    const [publishing, setPublishing] = useState(false);
    const [unpublishing, setUnpublishing] = useState(false);

    // Confirm dialog state
    const [confirmDialog, setConfirmDialog] = useState<{
        isOpen: boolean;
        type: "removeSubdomain" | "unpublish" | null;
    }>({ isOpen: false, type: null });

    // Reservation timer
    const [timeRemaining, setTimeRemaining] = useState<string>("");

    // Fetch user site and plan
    useEffect(() => {
        fetchUserData();
    }, []);

    // Update reservation timer every second
    useEffect(() => {
        if (site?.subdomainReservationExpiresAt) {
            const interval = setInterval(() => {
                updateTimeRemaining();
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [site?.subdomainReservationExpiresAt]);

    const fetchUserData = async () => {
        try {
            setLoading(true);

            // Fetch site
            const siteResponse = await fetch("/api/site/list");
            if (siteResponse.ok) {
                const siteData = await siteResponse.json();
                const userSite = siteData.sites?.[0] || null;
                setSite(userSite);

                if (userSite?.subdomain) {
                    setSubdomain(userSite.subdomain);
                }
            }

            // Fetch user plan
            const planResponse = await fetch("/api/subscription/info");
            if (planResponse.ok) {
                const planData = await planResponse.json();
                setUserPlan(planData.planType || "FREE");
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        } finally {
            setLoading(false);
        }
    };

    const updateTimeRemaining = () => {
        if (!site?.subdomainReservationExpiresAt) {
            setTimeRemaining("");
            return;
        }

        const now = new Date();
        const expiresAt = new Date(site.subdomainReservationExpiresAt);
        const diff = expiresAt.getTime() - now.getTime();

        if (diff <= 0) {
            setTimeRemaining("Rezervasyon süresi doldu");
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        setTimeRemaining(`${days} gün, ${hours} saat, ${minutes} dakika, ${seconds} saniye`);
    };

    // Debounced subdomain availability check
    useEffect(() => {
        if (!subdomain || subdomain === site?.subdomain) {
            setSubdomainStatus("idle");
            setSubdomainMessage("");
            return;
        }

        setSubdomainStatus("checking");
        const timer = setTimeout(() => {
            checkSubdomainAvailability(subdomain);
        }, 500);

        return () => clearTimeout(timer);
    }, [subdomain, site?.subdomain]);

    const checkSubdomainAvailability = async (subdomainToCheck: string) => {
        try {
            const response = await fetch(`/api/domain/check-subdomain?subdomain=${encodeURIComponent(subdomainToCheck)}`);
            const data = await response.json();

            if (data.available) {
                setSubdomainStatus("available");
                setSubdomainMessage(data.message || "Bu subdomain kullanılabilir");
            } else {
                setSubdomainStatus("taken");
                setSubdomainMessage(data.message || "Bu subdomain kullanımda");
            }
        } catch (error) {
            console.error("Error checking subdomain:", error);
            setSubdomainStatus("idle");
            setSubdomainMessage("Kontrol edilemedi");
        }
    };

    const handleSaveSubdomain = async () => {
        if (!site || !subdomain || subdomainStatus !== "available") {
            return;
        }

        setSavingSubdomain(true);
        try {
            const response = await fetch("/api/domain/update-subdomain", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ siteId: site.id, subdomain }),
            });

            const data = await response.json();

            if (data.success) {
                if (data.republished) {
                    toast.success(`Subdomain başarıyla güncellendi!`, {
                        description: `Siteniz yeni URL ile yayınlandı: ${data.newUrl}`
                    });
                } else if (data.republished === false) {
                    toast.warning(data.message); // Show the republish failure message
                } else {
                    toast.success("Subdomain başarıyla kaydedildi!");
                }
                fetchUserData();
            } else {
                toast.error(data.message || "Subdomain kaydedilemedi");
            }
        } catch (error) {
            console.error("Error saving subdomain:", error);
            toast.error("Bir hata oluştu");
        } finally {
            setSavingSubdomain(false);
        }
    };

    const handleRemoveSubdomain = async () => {
        if (!site) return;

        if (site.status === "published") {
            toast.error("Subdomain'i kaldırmak için önce siteyi yayından kaldırın");
            return;
        }

        setConfirmDialog({ isOpen: true, type: "removeSubdomain" });
    };

    const handleConfirmAction = async () => {
        if (confirmDialog.type === "removeSubdomain") {
            await executeRemoveSubdomain();
        } else if (confirmDialog.type === "unpublish") {
            await executeUnpublish();
        }
        setConfirmDialog({ isOpen: false, type: null });
    };

    const executeRemoveSubdomain = async () => {
        try {
            const response = await fetch("/api/domain/remove-subdomain", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ siteId: site.id }),
            });

            const data = await response.json();

            if (data.success) {
                toast.success("Subdomain başarıyla kaldırıldı");
                setSubdomain("");
                fetchUserData();
            } else {
                toast.error(data.message || "Subdomain kaldırılamadı");
            }
        } catch (error) {
            console.error("Error removing subdomain:", error);
            toast.error("Bir hata oluştu");
        }
    };

    const handlePublish = async () => {
        if (!site || !site.htmlContent) {
            toast.error("Lütfen önce sitenizi oluşturun");
            return;
        }

        if (!site.subdomain) {
            toast.error("Lütfen önce bir subdomain belirleyin");
            return;
        }

        setPublishing(true);
        try {
            const response = await fetch("/api/site/publish", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ siteId: site.id }),
            });

            const data = await response.json();

            if (data.success) {
                toast.success("Site başarıyla yayınlandı!");
                fetchUserData();
            } else {
                toast.error(data.error || "Site yayınlanamadı");
            }
        } catch (error) {
            console.error("Error publishing site:", error);
            toast.error("Bir hata oluştu");
        } finally {
            setPublishing(false);
        }
    };

    const handleUnpublish = async () => {
        if (!site) return;

        setConfirmDialog({ isOpen: true, type: "unpublish" });
    };

    const executeUnpublish = async () => {
        setUnpublishing(true);
        try {
            const response = await fetch("/api/site/unpublish", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ siteId: site.id }),
            });

            const data = await response.json();

            if (data.success) {
                toast.success("Site yayından kaldırıldı. Subdomain rezervasyonu başlatıldı.");
                // Force full page reload to clear all cache and show updated data
                window.location.reload();
            } else {
                toast.error(data.error || "Site yayından kaldırılamadı");
            }
        } catch (error) {
            console.error("Error unpublishing site:", error);
            toast.error("Bir hata oluştu");
        } finally {
            setUnpublishing(false);
        }
    };

    if (loading) {
        return (
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
                        <Globe className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white">Site Yayınlama</h2>
                        <p className="text-gray-400 text-sm">Subdomain ve yayınlama ayarlarınızı yönetin</p>
                    </div>
                </div>

                {/* Skeleton for Subdomain Settings Card */}
                <div className="bg-[#1a1a1a]/80 backdrop-blur-xl rounded-2xl border border-white/10 p-6 animate-pulse">
                    <div className="h-7 bg-gray-700/50 rounded-lg w-48 mb-4"></div>
                    <div className="space-y-4">
                        <div>
                            <div className="h-4 bg-gray-700/50 rounded w-24 mb-2"></div>
                            <div className="flex gap-2">
                                <div className="flex-1 h-12 bg-gray-700/50 rounded-xl"></div>
                                <div className="h-12 bg-gray-700/50 rounded-xl w-48"></div>
                            </div>
                        </div>
                        <div className="h-12 bg-gray-700/50 rounded-xl w-full"></div>
                    </div>
                </div>

                {/* Skeleton for Site Status Card */}
                <div className="bg-[#1a1a1a]/80 backdrop-blur-xl rounded-2xl border border-white/10 p-6 animate-pulse">
                    <div className="h-7 bg-gray-700/50 rounded-lg w-32 mb-4"></div>
                    <div className="space-y-4">
                        <div className="h-10 bg-gray-700/50 rounded-full w-32"></div>
                        <div className="h-12 bg-gray-700/50 rounded-xl w-full"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
                        <Globe className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white">Site Yayınlama</h2>
                        <p className="text-gray-400 text-sm">Subdomain ve yayınlama ayarlarınızı yönetin</p>
                    </div>
                </div>

                {/* No Site Created Message */}
                {!site && (
                    <div className="bg-[#1a1a1a]/80 backdrop-blur-xl rounded-2xl border border-white/10 p-10 text-center">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
                            <FileText className="w-8 h-8 text-purple-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">Henüz siteniz yok</h3>
                        <p className="text-gray-400 mb-6">Site yayınlamak için önce CV yükleyin ve sitenizi oluşturun.</p>
                        <button
                            onClick={() => window.location.href = '/dashboard?tab=my-info'}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold rounded-xl transition-all transform hover:scale-105 shadow-lg shadow-purple-500/25"
                        >
                            Bilgilerim Sayfasına Git
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                )}

                {/* FREE Plan - Subdomain Management */}
                {site && userPlan === "FREE" && (
                    <>
                        {/* Subdomain Input Card */}
                        <div className="bg-[#1a1a1a]/80 backdrop-blur-xl rounded-2xl border border-white/10 p-6 hover:border-purple-500/30 transition-all">
                            <div className="flex items-center gap-3 mb-5">
                                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
                                    <Link2 className="w-4 h-4 text-purple-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-white">Subdomain Ayarları</h3>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Subdomain
                                    </label>
                                    <div className="flex gap-2">
                                        <div className="flex-1 relative group">
                                            <input
                                                type="text"
                                                value={subdomain}
                                                onChange={(e) => setSubdomain(e.target.value.toLowerCase())}
                                                placeholder="myname"
                                                className="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all placeholder-gray-500"
                                            />
                                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                                {subdomainStatus === "checking" && (
                                                    <Loader2 className="animate-spin h-5 w-5 text-purple-400" />
                                                )}
                                                {subdomainStatus === "available" && (
                                                    <Check className="h-5 w-5 text-green-400" />
                                                )}
                                                {subdomainStatus === "taken" && (
                                                    <X className="h-5 w-5 text-red-400" />
                                                )}
                                            </div>
                                        </div>
                                        <span className="px-4 py-3 bg-[#0a0a0a] border border-white/10 text-gray-400 rounded-xl whitespace-nowrap text-sm">
                                            .{process.env.NEXT_PUBLIC_BASE_DOMAIN || "personalweb.info"}
                                        </span>
                                    </div>
                                    {subdomainMessage && (
                                        <p className={`mt-2 text-sm flex items-center gap-1.5 ${subdomainStatus === "available" ? "text-green-400" : "text-red-400"}`}>
                                            {subdomainStatus === "available" ? (
                                                <CheckCircle2 className="w-4 h-4" />
                                            ) : (
                                                <XCircle className="w-4 h-4" />
                                            )}
                                            {subdomainMessage}
                                        </p>
                                    )}
                                </div>

                                {/* Warning for published sites */}
                                {site?.status === "published" && (
                                    <div className="flex items-start gap-3 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
                                        <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                                        <p className="text-sm text-yellow-200">
                                            Siteniz yayında. Subdomain değiştirirseniz otomatik olarak yeni URL ile yeniden yayınlanacak.
                                        </p>
                                    </div>
                                )}

                                <button
                                    onClick={handleSaveSubdomain}
                                    disabled={savingSubdomain || subdomainStatus !== "available"}
                                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 disabled:shadow-none"
                                >
                                    {savingSubdomain ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Kaydediliyor...
                                        </>
                                    ) : (
                                        <>
                                            <Check className="w-4 h-4" />
                                            Subdomain'i Kaydet
                                        </>
                                    )}
                                </button>

                                {/* Remove Subdomain Button - Only show if subdomain exists and site is not published */}
                                {site?.subdomain && site.status !== "published" && (
                                    <button
                                        onClick={handleRemoveSubdomain}
                                        className="w-full flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 hover:border-red-500/50 text-red-400 font-semibold py-3 px-6 rounded-xl transition-all"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Subdomain'i Kaldır
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Site Status & Publishing Card */}
                        {site && (
                            <div className="bg-[#1a1a1a]/80 backdrop-blur-xl rounded-2xl border border-white/10 p-6 hover:border-purple-500/30 transition-all">
                                <div className="flex items-center gap-3 mb-5">
                                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
                                        <Rocket className="w-4 h-4 text-purple-400" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-white">Site Durumu</h3>
                                </div>

                                <div className="space-y-4">
                                    {/* Status Badge */}
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm ${site.status === "published"
                                                ? "bg-green-500/20 text-green-400 border border-green-500/30"
                                                : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                                                }`}
                                        >
                                            {site.status === "published" ? (
                                                <>
                                                    <CheckCircle2 className="w-4 h-4" />
                                                    Yayında
                                                </>
                                            ) : (
                                                <>
                                                    <Clock className="w-4 h-4" />
                                                    Yayında Değil
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {/* Published URL */}
                                    {site.status === "published" && site.cloudflareUrl && (
                                        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                                            <p className="text-sm font-medium text-green-300 mb-2 flex items-center gap-2">
                                                <Globe className="w-4 h-4" />
                                                Site URL
                                            </p>
                                            <a
                                                href={site.cloudflareUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors group"
                                            >
                                                <span className="break-all underline underline-offset-2">{site.cloudflareUrl}</span>
                                                <ExternalLink className="w-4 h-4 flex-shrink-0 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                            </a>
                                        </div>
                                    )}

                                    {/* Subdomain Reservation Info - Only when NOT published and has reservation */}
                                    {site.status !== "published" && site.subdomain && site.subdomainReservationExpiresAt && (
                                        <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Shield className="w-4 h-4 text-purple-400" />
                                                <p className="text-sm font-medium text-purple-300">Subdomain Rezervasyonu</p>
                                            </div>
                                            <p className="font-mono text-sm font-semibold text-purple-200 mb-2">
                                                {new Date(site.subdomainReservationExpiresAt).toLocaleString('tr-TR', {
                                                    day: '2-digit',
                                                    month: '2-digit',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })} tarihine kadar rezerve edilmiştir
                                            </p>
                                            <p className="text-xs text-purple-400">
                                                Bu süre içinde subdomain'iniz size aittir. Süre dolduğunda başkaları kullanabilir.
                                            </p>
                                        </div>
                                    )}

                                    {/* Warning - Subdomain not reserved yet */}
                                    {site.status !== "published" && site.subdomain && !site.subdomainReservationExpiresAt && (
                                        <div className="flex items-start gap-3 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
                                            <Info className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                                            <p className="text-sm text-yellow-200">
                                                Subdomain'iniz henüz rezerve edilmedi. Site yayınlamadan önce subdomain'iniz korunmayacaktır.
                                            </p>
                                        </div>
                                    )}

                                    {/* Publish/Unpublish Buttons */}
                                    <div className="flex gap-3">
                                        {site.status !== "published" ? (
                                            <button
                                                onClick={handlePublish}
                                                disabled={publishing || !site.htmlContent || !site.subdomain}
                                                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 disabled:shadow-none transform hover:scale-[1.02] active:scale-[0.98]"
                                            >
                                                {publishing ? (
                                                    <>
                                                        <Loader2 className="w-5 h-5 animate-spin" />
                                                        Yayınlanıyor...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Rocket className="w-5 h-5" />
                                                        Siteyi Yayınla
                                                    </>
                                                )}
                                            </button>
                                        ) : (
                                            <button
                                                onClick={handleUnpublish}
                                                disabled={unpublishing}
                                                className="flex-1 flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 hover:border-red-500/50 disabled:bg-gray-600/10 disabled:border-gray-600/30 disabled:cursor-not-allowed text-red-400 disabled:text-gray-500 font-bold py-3.5 px-6 rounded-xl transition-all"
                                            >
                                                {unpublishing ? (
                                                    <>
                                                        <Loader2 className="w-5 h-5 animate-spin" />
                                                        Kaldırılıyor...
                                                    </>
                                                ) : (
                                                    <>
                                                        <XCircle className="w-5 h-5" />
                                                        Yayından Kaldır
                                                    </>
                                                )}
                                            </button>
                                        )}
                                    </div>

                                    {!site.htmlContent && (
                                        <div className="flex items-center justify-center gap-2 text-sm text-gray-400 py-2">
                                            <Info className="w-4 h-4" />
                                            Yayınlamak için önce "Sitem" bölümünden sitenizi oluşturun
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </>
                )}

                {/* PAID Plan - Coming Soon */}
                {site && userPlan === "PAID" && (
                    <div className="bg-[#1a1a1a]/80 backdrop-blur-xl rounded-2xl border border-purple-500/30 p-10 text-center relative overflow-hidden">
                        {/* Background glow effects */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/20 rounded-full blur-[80px] -mr-32 -mt-32"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/20 rounded-full blur-[80px] -ml-32 -mb-32"></div>

                        <div className="relative z-10">
                            <div className="flex justify-center mb-6">
                                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
                                    <Globe className="w-10 h-10 text-white" />
                                </div>
                            </div>

                            <h3 className="text-2xl font-bold text-white mb-2">Custom Domain Yönetimi</h3>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-sm font-medium mb-4 border border-purple-500/30">
                                <Sparkles className="w-4 h-4" />
                                Geliştiriliyor
                            </div>
                            <p className="text-gray-400 max-w-xl mx-auto mb-8">
                                Yakında kendi domain adınızı sitenize bağlayabilecek ve gelişmiş domain yönetimi
                                yapabileceksiniz. Bu özellik üzerinde aktif olarak çalışıyoruz.
                            </p>

                            {/* Features List */}
                            <div className="bg-[#0a0a0a]/50 border border-white/10 rounded-xl p-6 max-w-lg mx-auto text-left">
                                <h4 className="text-sm font-semibold text-gray-400 mb-4 text-center uppercase tracking-wider">
                                    Yakında Gelen Özellikler
                                </h4>
                                <ul className="space-y-3">
                                    <li className="flex items-center gap-3 text-gray-300">
                                        <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                                            <Globe className="w-4 h-4 text-purple-400" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-white">Özel Domain Bağlama</p>
                                            <p className="text-xs text-gray-500">Kendi domain adınızı sitenize bağlayın</p>
                                        </div>
                                    </li>
                                    <li className="flex items-center gap-3 text-gray-300">
                                        <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center flex-shrink-0">
                                            <Shield className="w-4 h-4 text-green-400" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-white">SSL Sertifikası</p>
                                            <p className="text-xs text-gray-500">Otomatik SSL ile güvenli bağlantı</p>
                                        </div>
                                    </li>
                                    <li className="flex items-center gap-3 text-gray-300">
                                        <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                                            <Settings2 className="w-4 h-4 text-blue-400" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-white">DNS Yönetimi</p>
                                            <p className="text-xs text-gray-500">DNS kayıtlarınızı kolayca yönetin</p>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Confirm Dialog */}
            <ConfirmDialog
                isOpen={confirmDialog.isOpen}
                onClose={() => setConfirmDialog({ isOpen: false, type: null })}
                onConfirm={handleConfirmAction}
                title={confirmDialog.type === "removeSubdomain" ? "Subdomain'i Kaldır" : "Siteyi Yayından Kaldır"}
                message={confirmDialog.type === "removeSubdomain"
                    ? "Subdomain'inizi kaldırmak istediğinizden emin misiniz? Rezervasyonunuz da silinecektir."
                    : "Sitenizi yayından kaldırmak istediğinizden emin misiniz?"
                }
                confirmText={confirmDialog.type === "removeSubdomain" ? "Kaldır" : "Yayından Kaldır"}
                variant="warning"
                loading={unpublishing}
            />
        </>
    );
}
