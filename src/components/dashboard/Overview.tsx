"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface OverviewProps {
    site: any;
    userName: string;
    onTabChange: (tab: string) => void;
}

interface StorageInfo {
    storageUsed: number;
    storageLimit: number;
    usagePercentage: number;
    storageUsedFormatted: string;
    storageLimitFormatted: string;
}

interface UserInfo {
    email: string;
    name: string;
    planType: string;
    editsThisMonth: number;
    editsResetDate: string;
    planLimits: {
        editsPerMonth: number;
    };
}

export default function Overview({ site, userName, onTabChange }: OverviewProps) {
    const { data: session } = useSession();
    const router = useRouter();
    const [storage, setStorage] = useState<StorageInfo | null>(null);
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [loading, setLoading] = useState(true);

    const handleTabChange = (tab: string) => {
        onTabChange(tab);
        // Also update URL without scrolling to keep it bookmarkable
        router.push(`/dashboard?tab=${tab}`, { scroll: false });
    };

    // Dummy statistics data (will be made functional later)
    const stats = {
        totalVisitors: 1247,
        monthlyGrowth: 12.5,
        weeklyGrowth: 4.2,
    };

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [storageRes, userRes] = await Promise.all([
                fetch("/api/storage"),
                fetch("/api/user/me"),
            ]);

            if (storageRes.ok) {
                const storageData = await storageRes.json();
                setStorage(storageData);
            }

            if (userRes.ok) {
                const userData = await userRes.json();
                setUserInfo(userData);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    // Get storage color based on usage
    const getStorageColor = () => {
        if (!storage) return "from-green-500 to-emerald-500";
        if (storage.usagePercentage >= 90) return "from-red-500 to-rose-500";
        if (storage.usagePercentage >= 75) return "from-yellow-500 to-orange-500";
        return "from-green-500 to-emerald-500";
    };

    // Format date for display
    const formatDate = (dateString: string) => {
        if (!dateString) return "-";
        return new Date(dateString).toLocaleDateString("tr-TR", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    // Calculate remaining edits
    const remainingEdits = userInfo
        ? Math.max(0, userInfo.planLimits.editsPerMonth - userInfo.editsThisMonth)
        : 0;

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-white mb-2">Genel Bakış</h1>
                <p className="text-gray-400">Sitenizin durumunu ve genel bilgileri buradan takip edin.</p>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                {/* 1. Site Durumu Card */}
                <div className="bg-[#111]/80 backdrop-blur-sm rounded-2xl border border-white/10 p-6 hover:border-white/20 transition-all duration-300 group">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-white">Site Durumu</h3>
                    </div>

                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-400 text-sm">Oluşturulma</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${site ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                                {site ? '✓ Oluşturuldu' : '○ Oluşturulmadı'}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-400 text-sm">Yayın Durumu</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${site?.status === 'published' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                {site?.status === 'published' ? '✓ Yayında' : '○ Taslak'}
                            </span>
                        </div>
                        {site?.updatedAt && (
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400 text-sm">Son Güncelleme</span>
                                <span className="text-white text-sm">{formatDate(site.updatedAt)}</span>
                            </div>
                        )}
                    </div>

                    {site && (
                        <Link href="/editor" className="mt-4 block w-full py-2 text-center text-sm font-medium text-purple-400 hover:text-purple-300 border border-purple-500/30 rounded-xl hover:bg-purple-500/10 transition-all">
                            Siteyi Düzenle →
                        </Link>
                    )}
                </div>

                {/* 2. Domain Durumu Card */}
                <div className="bg-[#111]/80 backdrop-blur-sm rounded-2xl border border-white/10 p-6 hover:border-white/20 transition-all duration-300 group">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-white">Domain Durumu</h3>
                    </div>

                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-400 text-sm">Subdomain</span>
                            <span className="text-white text-sm font-mono">
                                {site?.subdomain ? `${site.subdomain}.profilly.com` : '-'}
                            </span>
                        </div>
                        {site?.cloudflareUrl && site?.status === 'published' && (
                            <a
                                href={site.cloudflareUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                                Canlı Siteyi Ziyaret Et
                            </a>
                        )}
                    </div>

                    {!site?.subdomain && (
                        <p className="mt-4 text-sm text-gray-500">
                            Sitenizi yayınlamak için bir subdomain belirleyin.
                        </p>
                    )}
                </div>

                {/* 3. Depolama Card */}
                <div className="bg-[#111]/80 backdrop-blur-sm rounded-2xl border border-white/10 p-6 hover:border-white/20 transition-all duration-300 group">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-white">Depolama</h3>
                    </div>

                    {loading ? (
                        <div className="space-y-3">
                            <div className="h-2 bg-white/10 rounded-full animate-pulse" />
                            <div className="h-4 w-24 bg-white/10 rounded animate-pulse" />
                        </div>
                    ) : storage ? (
                        <div className="space-y-3">
                            {/* Progress Bar */}
                            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full bg-gradient-to-r ${getStorageColor()} transition-all duration-500`}
                                    style={{ width: `${Math.min(storage.usagePercentage, 100)}%` }}
                                />
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="text-gray-400 text-sm">
                                    {storage.storageUsedFormatted} / {storage.storageLimitFormatted}
                                </span>
                                <span className={`text-sm font-medium ${storage.usagePercentage >= 90 ? 'text-red-400' : storage.usagePercentage >= 75 ? 'text-yellow-400' : 'text-green-400'}`}>
                                    %{storage.usagePercentage}
                                </span>
                            </div>

                            {storage.usagePercentage >= 90 && (
                                <div className="p-2 bg-red-500/10 border border-red-500/20 rounded-lg text-xs text-red-400">
                                    ⚠️ Depolama alanınız dolmak üzere!
                                </div>
                            )}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-sm">Yüklenemedi</p>
                    )}
                </div>

                {/* 4. İstatistik Card (Dummy Data) */}
                <div className="bg-[#111]/80 backdrop-blur-sm rounded-2xl border border-white/10 p-6 hover:border-white/20 transition-all duration-300 group">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500/20 to-rose-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <svg className="w-5 h-5 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-white">İstatistikler</h3>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-purple-500/20 text-purple-400 ml-auto">
                            Yakında
                        </span>
                    </div>

                    <div className="space-y-4">
                        <div className="text-center py-2">
                            <div className="text-3xl font-bold text-white">{stats.totalVisitors.toLocaleString('tr-TR')}</div>
                            <div className="text-gray-400 text-sm">Toplam Ziyaretçi</div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-white/5 rounded-xl p-3 text-center">
                                <div className="flex items-center justify-center gap-1 text-green-400 font-medium">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                                    </svg>
                                    %{stats.monthlyGrowth}
                                </div>
                                <div className="text-gray-500 text-xs mt-1">Aylık Artış</div>
                            </div>
                            <div className="bg-white/5 rounded-xl p-3 text-center">
                                <div className="flex items-center justify-center gap-1 text-green-400 font-medium">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                                    </svg>
                                    %{stats.weeklyGrowth}
                                </div>
                                <div className="text-gray-500 text-xs mt-1">Haftalık Artış</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 5. Pro'ya Geçin CTA Card */}
                {userInfo?.planType !== 'PRO' && (
                    <div className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 backdrop-blur-sm rounded-2xl border border-purple-500/30 p-6 hover:border-purple-500/50 transition-all duration-300 group relative overflow-hidden">
                        {/* Background glow */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl -mr-16 -mt-16" />

                        <div className="relative">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-white">Pro'ya Geçin</h3>
                            </div>

                            <ul className="space-y-2 mb-4 text-sm">
                                <li className="flex items-center gap-2 text-gray-300">
                                    <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Özel Domain Bağlama
                                </li>
                                <li className="flex items-center gap-2 text-gray-300">
                                    <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Sınırsız Düzenleme
                                </li>
                                <li className="flex items-center gap-2 text-gray-300">
                                    <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Daha Fazla Depolama
                                </li>
                            </ul>

                            <button
                                onClick={() => handleTabChange("subscriptions")}
                                className="block w-full py-3 text-center font-semibold text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl hover:from-purple-500 hover:to-blue-500 transition-all transform hover:scale-[1.02] shadow-lg shadow-purple-500/25"
                            >
                                Hemen Yükselt
                            </button>
                        </div>
                    </div>
                )}

                {/* 6. Düzenleme Hakkı Card */}
                <div className="bg-[#111]/80 backdrop-blur-sm rounded-2xl border border-white/10 p-6 hover:border-white/20 transition-all duration-300 group">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500/20 to-amber-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <svg className="w-5 h-5 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-white">Düzenleme Hakkı</h3>
                    </div>

                    {loading ? (
                        <div className="space-y-3">
                            <div className="h-8 w-16 bg-white/10 rounded animate-pulse mx-auto" />
                            <div className="h-4 w-32 bg-white/10 rounded animate-pulse mx-auto" />
                        </div>
                    ) : userInfo ? (
                        <div className="space-y-4">
                            <div className="text-center">
                                <div className="text-4xl font-bold text-white">
                                    {remainingEdits}
                                    <span className="text-lg text-gray-500">/{userInfo.planLimits.editsPerMonth}</span>
                                </div>
                                <div className="text-gray-400 text-sm">Kalan Düzenleme</div>
                            </div>

                            {/* Progress ring visual */}
                            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                                <div
                                    className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-500"
                                    style={{ width: `${(remainingEdits / userInfo.planLimits.editsPerMonth) * 100}%` }}
                                />
                            </div>

                            <div className="text-center text-xs text-gray-500">
                                Sıfırlanma: {formatDate(userInfo.editsResetDate)}
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-500 text-sm">Yüklenemedi</p>
                    )}
                </div>

                {/* 7. Hızlı Ayarlar Card */}
                <div className="bg-[#111]/80 backdrop-blur-sm rounded-2xl border border-white/10 p-6 hover:border-white/20 transition-all duration-300 group">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-500/20 to-slate-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-white">Hızlı Ayarlar</h3>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <div className="flex-1 min-w-0">
                                <div className="text-xs text-gray-500">İsim</div>
                                <div className="text-sm text-white truncate">{userName || session?.user?.name || '-'}</div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <div className="flex-1 min-w-0">
                                <div className="text-xs text-gray-500">E-posta</div>
                                <div className="text-sm text-white truncate">{userInfo?.email || session?.user?.email || '-'}</div>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => handleTabChange("settings")}
                        className="mt-4 block w-full py-2 text-center text-sm font-medium text-gray-400 hover:text-white border border-white/10 rounded-xl hover:bg-white/5 transition-all"
                    >
                        Ayarları Düzenle →
                    </button>
                </div>
            </div>
        </div>
    );
}
