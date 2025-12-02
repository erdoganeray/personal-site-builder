"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import SignOutButton from "@/components/SignOutButton";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { CVData } from "@/lib/gemini-pdf-parser";
import DashboardMenu from "@/components/dashboard/DashboardMenu";
import MyInfo from "@/components/dashboard/MyInfo";
import MySite from "@/components/dashboard/MySite";
import Subscriptions from "@/components/dashboard/Subscriptions";
import DomainManagement from "@/components/dashboard/DomainManagement";
import Settings from "@/components/dashboard/Settings";

export default function DashboardPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [site, setSite] = useState<any>(null);
    const [cvData, setCvData] = useState<CVData | null>(null);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);
    const [activeTab, setActiveTab] = useState("my-info");
    const [isMenuCollapsed, setIsMenuCollapsed] = useState(false);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        }
        
        if (status === "authenticated") {
            fetchUserSite();
        }
    }, [status, router]);

    const fetchUserSite = async () => {
        try {
            const response = await fetch("/api/site/list");
            if (response.ok) {
                const data = await response.json();
                const userSite = data.sites?.[0] || null;
                setSite(userSite);
                
                // Eğer site varsa ve CV data'sı varsa, parse et
                if (userSite?.cvTextData) {
                    try {
                        setCvData(JSON.parse(userSite.cvTextData));
                    } catch (error) {
                        console.error("CV data parse hatası:", error);
                    }
                }
            }
        } catch (error) {
            console.error("Site yükleme hatası:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!site) return;
        
        if (!confirm("CV'nizi ve site bilgilerinizi silmek istediğinizden emin misiniz?")) {
            return;
        }

        setDeleting(true);
        try {
            const response = await fetch(`/api/site/delete?id=${site.id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                // State'i temizle
                setSite(null);
                setCvData(null);
            } else {
                const data = await response.json();
                alert(data.error || "CV silinemedi");
            }
        } catch (error) {
            console.error("Silme hatası:", error);
            alert("Bir hata oluştu");
        } finally {
            setDeleting(false);
        }
    };

    const handleCVAnalyzed = (analyzedData: CVData, siteId: string) => {
        // CV analiz edildikten sonra state'i güncelle
        setCvData(analyzedData);
        fetchUserSite(); // Site bilgilerini yeniden yükle
    };

    const renderContent = () => {
        switch (activeTab) {
            case "my-info":
                return (
                    <MyInfo
                        site={site}
                        cvData={cvData}
                        onDelete={handleDelete}
                        onCVAnalyzed={handleCVAnalyzed}
                        deleting={deleting}
                    />
                );
            case "my-site":
                return <MySite site={site} onRefresh={fetchUserSite} />;
            case "subscriptions":
                return <Subscriptions />;
            case "domain":
                return <DomainManagement />;
            case "settings":
                return <Settings />;
            default:
                return (
                    <MyInfo
                        site={site}
                        cvData={cvData}
                        onDelete={handleDelete}
                        onCVAnalyzed={handleCVAnalyzed}
                        deleting={deleting}
                    />
                );
        }
    };

    if (status === "loading") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
                <div className="text-white text-xl">Loading...</div>
            </div>
        );
    }

    if (!session) {
        return null;
    }

    // İlk veri yüklenirken loading göster
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
                <nav className="bg-gray-800 border-b border-gray-700">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between h-16 items-center">
                            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                                SiteBuilder AI
                            </Link>
                            <div className="flex items-center gap-6">
                                <Link href="/" className="text-gray-300 hover:text-white transition-colors">
                                    Ana Sayfa
                                </Link>
                                <Link href="/editor" className="text-gray-300 hover:text-white transition-colors">
                                    Editör
                                </Link>
                                <div className="relative group">
                                    <button className="px-4 py-2 text-gray-300 hover:text-white transition-colors flex items-center gap-2">
                                        {session.user?.name || session.user?.email}
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-xl border border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                                        <SignOutButton />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>

                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="flex flex-col items-center justify-center min-h-[60vh]">
                        <div className="bg-gray-800 rounded-2xl shadow-2xl p-12 border border-gray-700 text-center">
                            <div className="flex justify-center mb-6">
                                <svg className="animate-spin h-16 w-16 text-purple-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-3">
                                Bilgileriniz yükleniyor...
                            </h2>
                            <p className="text-gray-400">
                                Lütfen bekleyin, verileriniz kontrol ediliyor.
                            </p>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            <nav className="bg-gray-800 border-b border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                            SiteBuilder AI
                        </Link>
                        <div className="flex items-center gap-6">
                            <Link href="/" className="text-gray-300 hover:text-white transition-colors">
                                Ana Sayfa
                            </Link>
                            <Link href="/editor" className="text-gray-300 hover:text-white transition-colors">
                                Editör
                            </Link>
                            <div className="relative group">
                                <button className="px-4 py-2 text-gray-300 hover:text-white transition-colors flex items-center gap-2">
                                    {session.user?.name || session.user?.email}
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-xl border border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                                    <SignOutButton />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="w-full px-4 py-8">
                {/* Welcome Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">
                        Dashboard
                    </h1>
                    <p className="text-gray-400">
                        Hoş geldin, {session.user?.name || session.user?.email}! 👋
                    </p>
                </div>

                {/* Dashboard Layout */}
                <div className="flex gap-4">
                    {/* Left Menu */}
                    <div className={`transition-all duration-300 ${isMenuCollapsed ? 'w-16' : 'w-64'}`}>
                        <DashboardMenu 
                            activeTab={activeTab} 
                            onTabChange={setActiveTab}
                            isCollapsed={isMenuCollapsed}
                            onToggleCollapse={() => setIsMenuCollapsed(!isMenuCollapsed)}
                        />
                    </div>

                    {/* Right Content */}
                    <div className="flex-1">
                        {renderContent()}
                    </div>
                </div>
            </main>
        </div>
    );
}
