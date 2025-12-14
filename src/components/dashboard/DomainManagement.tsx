"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

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
                    alert(`Subdomain başarıyla güncellendi!\n\nSiteniz yeni URL ile yayınlandı:\n${data.newUrl}`);
                } else if (data.republished === false) {
                    alert(data.message); // Show the republish failure message
                } else {
                    alert("Subdomain başarıyla kaydedildi!");
                }
                fetchUserData();
            } else {
                alert(data.message || "Subdomain kaydedilemedi");
            }
        } catch (error) {
            console.error("Error saving subdomain:", error);
            alert("Bir hata oluştu");
        } finally {
            setSavingSubdomain(false);
        }
    };

    const handleRemoveSubdomain = async () => {
        if (!site) return;

        if (site.status === "published") {
            alert("Subdomain'i kaldırmak için önce siteyi yayından kaldırın");
            return;
        }

        if (!confirm("Subdomain'inizi kaldırmak istediğinizden emin misiniz? Rezervasyonunuz da silinecektir.")) {
            return;
        }

        try {
            const response = await fetch("/api/domain/remove-subdomain", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ siteId: site.id }),
            });

            const data = await response.json();

            if (data.success) {
                alert("Subdomain başarıyla kaldırıldı");
                setSubdomain("");
                fetchUserData();
            } else {
                alert(data.message || "Subdomain kaldırılamadı");
            }
        } catch (error) {
            console.error("Error removing subdomain:", error);
            alert("Bir hata oluştu");
        }
    };

    const handlePublish = async () => {
        if (!site || !site.htmlContent) {
            alert("Lütfen önce sitenizi oluşturun");
            return;
        }

        if (!site.subdomain) {
            alert("Lütfen önce bir subdomain belirleyin");
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
                alert("Site başarıyla yayınlandı!");
                fetchUserData();
            } else {
                alert(data.error || "Site yayınlanamadı");
            }
        } catch (error) {
            console.error("Error publishing site:", error);
            alert("Bir hata oluştu");
        } finally {
            setPublishing(false);
        }
    };

    const handleUnpublish = async () => {
        if (!site) return;

        if (!confirm("Sitenizi yayından kaldırmak istediğinizden emin misiniz?")) {
            return;
        }

        setUnpublishing(true);
        try {
            const response = await fetch("/api/site/unpublish", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ siteId: site.id }),
            });

            const data = await response.json();

            if (data.success) {
                alert("Site yayından kaldırıldı. Subdomain rezervasyonu başlatıldı.");
                // Force full page reload to clear all cache and show updated data
                window.location.reload();
            } else {
                alert(data.error || "Site yayından kaldırılamadı");
            }
        } catch (error) {
            console.error("Error unpublishing site:", error);
            alert("Bir hata oluştu");
        } finally {
            setUnpublishing(false);
        }
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Domain Yönetimi</h2>
                    <p className="text-gray-400">
                        Subdomain ve yayınlama ayarlarınızı buradan yönetebilirsiniz
                    </p>
                </div>

                {/* Skeleton for Subdomain Settings Card */}
                <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 animate-pulse">
                    <div className="h-7 bg-gray-700 rounded w-48 mb-4"></div>
                    <div className="space-y-4">
                        <div>
                            <div className="h-4 bg-gray-700 rounded w-24 mb-2"></div>
                            <div className="flex gap-2">
                                <div className="flex-1 h-12 bg-gray-700 rounded-lg"></div>
                                <div className="h-12 bg-gray-700 rounded-lg w-48"></div>
                            </div>
                        </div>
                        <div className="h-12 bg-gray-700 rounded-lg w-full"></div>
                    </div>
                </div>

                {/* Skeleton for Site Status Card */}
                <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 animate-pulse">
                    <div className="h-7 bg-gray-700 rounded w-32 mb-4"></div>
                    <div className="space-y-4">
                        <div className="h-10 bg-gray-700 rounded-full w-32"></div>
                        <div className="h-12 bg-gray-700 rounded-lg w-full"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-white mb-2">Domain Yönetimi</h2>
                <p className="text-gray-400">
                    Subdomain ve yayınlama ayarlarınızı buradan yönetebilirsiniz
                </p>
            </div>

            {/* No Site Created Message */}
            {!site && (
                <div className="bg-gray-800 rounded-xl border border-gray-700 p-8 text-center">
                    <p className="text-gray-400 mb-4">Henüz bir siteniz yok. Lütfen önce CV yükleyin.</p>
                    <button
                        onClick={() => window.location.href = '/dashboard?tab=my-info'}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
                    >
                        Bilgilerim Sayfasına Git
                    </button>
                </div>
            )}

            {/* FREE Plan - Subdomain Management */}
            {site && userPlan === "FREE" && (
                <>
                    {/* Subdomain Input Card */}
                    <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
                        <h3 className="text-xl font-bold text-white mb-4">Subdomain Ayarları</h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Subdomain
                                </label>
                                <div className="flex gap-2">
                                    <div className="flex-1 relative">
                                        <input
                                            type="text"
                                            value={subdomain}
                                            onChange={(e) => setSubdomain(e.target.value.toLowerCase())}
                                            placeholder="myname"
                                            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                            {subdomainStatus === "checking" && (
                                                <svg className="animate-spin h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                            )}
                                            {subdomainStatus === "available" && (
                                                <svg className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            )}
                                            {subdomainStatus === "taken" && (
                                                <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            )}
                                        </div>
                                    </div>
                                    <span className="px-4 py-3 bg-gray-700 border border-gray-600 text-gray-300 rounded-lg whitespace-nowrap">
                                        .{process.env.NEXT_PUBLIC_BASE_DOMAIN || "personalweb.info"}
                                    </span>
                                </div>
                                {subdomainMessage && (
                                    <p className={`mt-2 text-sm ${subdomainStatus === "available" ? "text-green-400" : "text-red-400"}`}>
                                        {subdomainMessage}
                                    </p>
                                )}
                            </div>

                            {/* Warning for published sites */}
                            {site?.status === "published" && (
                                <div className="bg-yellow-900/30 border border-yellow-700 rounded-lg p-3">
                                    <p className="text-sm text-yellow-200">
                                        ⚠️ Siteniz yayında. Subdomain değiştirirseniz otomatik olarak yeni URL ile yeniden yayınlanacak.
                                    </p>
                                </div>
                            )}

                            <button
                                onClick={handleSaveSubdomain}
                                disabled={savingSubdomain || subdomainStatus !== "available"}
                                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                            >
                                {savingSubdomain ? "Kaydediliyor..." : "Subdomain'i Kaydet"}
                            </button>

                            {/* Remove Subdomain Button - Only show if subdomain exists and site is not published */}
                            {site?.subdomain && site.status !== "published" && (
                                <button
                                    onClick={handleRemoveSubdomain}
                                    className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                                >
                                    Subdomain'i Kaldır
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Site Status & Publishing Card */}
                    {site && (
                        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
                            <h3 className="text-xl font-bold text-white mb-4">Site Durumu</h3>

                            <div className="space-y-4">
                                {/* Status Badge */}
                                <div className="flex items-center gap-3">
                                    <div
                                        className={`px-4 py-2 rounded-full font-semibold ${site.status === "published"
                                            ? "bg-green-600 text-white"
                                            : "bg-yellow-600 text-white"
                                            }`}
                                    >
                                        {site.status === "published" ? "✓ Yayında" : "○ Yayında Değil"}
                                    </div>
                                </div>

                                {/* Published URL */}
                                {site.status === "published" && site.cloudflareUrl && (
                                    <div className="bg-green-900/30 border border-green-700 rounded-lg p-4">
                                        <p className="text-sm font-medium text-green-300 mb-2">Site URL:</p>
                                        <a
                                            href={site.cloudflareUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-green-400 hover:text-green-300 underline break-all"
                                        >
                                            {site.cloudflareUrl}
                                        </a>
                                    </div>
                                )}

                                {/* Subdomain Reservation Info - Only when NOT published and has reservation */}
                                {site.status !== "published" && site.subdomain && site.subdomainReservationExpiresAt && (
                                    <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-4">
                                        <p className="text-sm font-medium text-blue-300 mb-2">
                                            Subdomain Rezervasyonu:
                                        </p>
                                        <p className="font-mono font-semibold text-blue-200 mb-2">
                                            {new Date(site.subdomainReservationExpiresAt).toLocaleString('tr-TR', {
                                                day: '2-digit',
                                                month: '2-digit',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })} tarihine kadar rezerve edilmiştir
                                        </p>
                                        <p className="text-xs text-blue-400">
                                            Bu süre içinde subdomain'iniz size aittir. Süre dolduğunda başkaları kullanabilir.
                                        </p>
                                    </div>
                                )}

                                {/* Warning - Subdomain not reserved yet */}
                                {site.status !== "published" && site.subdomain && !site.subdomainReservationExpiresAt && (
                                    <div className="bg-yellow-900/30 border border-yellow-700 rounded-lg p-4">
                                        <p className="text-sm text-yellow-200">
                                            ℹ️ Subdomain'iniz henüz rezerve edilmedi. Site yayınlamadan önce subdomain'iniz korunmayacaktır.
                                        </p>
                                    </div>
                                )}

                                {/* Publish/Unpublish Buttons */}
                                <div className="flex gap-3">
                                    {site.status !== "published" ? (
                                        <button
                                            onClick={handlePublish}
                                            disabled={publishing || !site.htmlContent || !site.subdomain}
                                            className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-all"
                                        >
                                            {publishing ? "Yayınlanıyor..." : "Siteyi Yayınla"}
                                        </button>
                                    ) : (
                                        <button
                                            onClick={handleUnpublish}
                                            disabled={unpublishing}
                                            className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-all"
                                        >
                                            {unpublishing ? "Kaldırılıyor..." : "Yayından Kaldır"}
                                        </button>
                                    )}
                                </div>

                                {!site.htmlContent && (
                                    <p className="text-sm text-gray-400 text-center">
                                        Yayınlamak için önce "Sitem" bölümünden sitenizi oluşturun
                                    </p>
                                )}
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* PAID Plan - Coming Soon */}
            {site && userPlan === "PAID" && (
                <div className="bg-gray-800 rounded-xl border border-gray-700 p-12 text-center">
                    <div className="flex justify-center mb-6">
                        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 rounded-full">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-16 w-16 text-white"
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
                        </div>
                    </div>

                    <h3 className="text-3xl font-bold text-white mb-4">Custom Domain Yönetimi</h3>
                    <p className="text-xl text-gray-300 mb-6">Geliştiriliyor...</p>
                    <p className="text-gray-400 max-w-2xl mx-auto mb-8">
                        Yakında kendi domain adınızı sitenize bağlayabilecek ve gelişmiş domain yönetimi
                        yapabileceksiniz. Bu özellik üzerinde aktif olarak çalışıyoruz.
                    </p>

                    {/* Features List */}
                    <div className="bg-gray-700/50 rounded-lg p-6 max-w-2xl mx-auto text-left">
                        <h4 className="text-lg font-semibold text-white mb-4 text-center">
                            Yakında Gelen Özellikler
                        </h4>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-3 text-gray-300">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6 text-blue-400 flex-shrink-0"
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
                                <div>
                                    <p className="font-medium text-white">Özel Domain Bağlama</p>
                                    <p className="text-sm text-gray-400">
                                        Kendi domain adınızı sitenize bağlayın
                                    </p>
                                </div>
                            </li>
                            <li className="flex items-start gap-3 text-gray-300">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6 text-blue-400 flex-shrink-0"
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
                                <div>
                                    <p className="font-medium text-white">SSL Sertifikası</p>
                                    <p className="text-sm text-gray-400">
                                        Otomatik SSL sertifikası ile güvenli bağlantı
                                    </p>
                                </div>
                            </li>
                            <li className="flex items-start gap-3 text-gray-300">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6 text-blue-400 flex-shrink-0"
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
                                <div>
                                    <p className="font-medium text-white">DNS Yönetimi</p>
                                    <p className="text-sm text-gray-400">
                                        DNS kayıtlarınızı kolayca yönetin
                                    </p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
}
