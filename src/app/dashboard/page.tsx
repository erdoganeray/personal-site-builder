"use client";

import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import type { CVData } from "@/lib/gemini-pdf-parser";
import DashboardMenu from "@/components/dashboard/DashboardMenu";
import Overview from "@/components/dashboard/Overview";
import MyInfo from "@/components/dashboard/MyInfo";
import MySite from "@/components/dashboard/MySite";
import Subscriptions from "@/components/dashboard/Subscriptions";
import DomainManagement from "@/components/dashboard/DomainManagement";
import Settings from "@/components/dashboard/Settings";
import { toast } from "@/components/ui/Toast";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

function DashboardContent() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const searchParams = useSearchParams();
    const tabParam = searchParams.get("tab");

    const [site, setSite] = useState<any>(null);
    const [cvData, setCvData] = useState<CVData | null>(null);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);
    const [activeTab, setActiveTab] = useState(tabParam || "overview");
    const [isMenuCollapsed, setIsMenuCollapsed] = useState(false);

    // Sync activeTab to URL and handle back/forward navigation
    useEffect(() => {
        if (tabParam && tabParam !== activeTab && ["overview", "my-info", "my-site", "subscriptions", "domain", "settings"].includes(tabParam)) {
            setActiveTab(tabParam);
        }
    }, [tabParam]);

    // Update URL when activeTab changes (optional but good for UX)
    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
        router.push(`/dashboard?tab=${tab}`, { scroll: false });
    };

    // Confirm dialog state
    const [confirmDialog, setConfirmDialog] = useState<{
        isOpen: boolean;
        type: "deleteSite" | null;
    }>({ isOpen: false, type: null });

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
                if (userSite?.cvContent) {
                    try {
                        setCvData(userSite.cvContent);
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
        setConfirmDialog({ isOpen: true, type: "deleteSite" });
    };

    const executeDelete = async () => {
        if (!site) return;

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
                toast.error(data.error || "CV silinemedi");
            }
        } catch (error) {
            console.error("Silme hatası:", error);
            toast.error("Bir hata oluştu");
        } finally {
            setDeleting(false);
        }
    };

    const handleConfirmAction = async () => {
        if (confirmDialog.type === "deleteSite") {
            await executeDelete();
        }
        setConfirmDialog({ isOpen: false, type: null });
    };


    const handleCVAnalyzed = (analyzedData: CVData, siteId: string) => {
        // CV analiz edildikten sonra state'i güncelle
        setCvData(analyzedData);
        fetchUserSite(); // Site bilgilerini yeniden yükle
    };

    const renderContent = () => {
        switch (activeTab) {
            case "overview":
                return (
                    <Overview
                        site={site}
                        userName={session?.user?.name || ""}
                        onTabChange={handleTabChange}
                    />
                );
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
                    <Overview
                        site={site}
                        userName={session?.user?.name || ""}
                        onTabChange={handleTabChange}
                    />
                );
        }
    };

    if (status === "loading") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
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
            <div className="min-h-screen bg-[#0a0a0a] flex">
                {/* Sidebar Skeleton */}
                <div className={`bg-[#0a0a0a] border-r border-white/10 transition-all duration-300 ${isMenuCollapsed ? 'w-16' : 'w-56'}`}>
                    <div className="p-4 border-b border-white/10">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-white/5 animate-pulse" />
                            {!isMenuCollapsed && (
                                <div className="space-y-2 flex-1">
                                    <div className="h-3 w-16 bg-white/5 rounded animate-pulse" />
                                    <div className="h-4 w-24 bg-white/5 rounded animate-pulse" />
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="p-3 space-y-2">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className={`h-12 bg-white/5 rounded-xl animate-pulse ${isMenuCollapsed ? 'w-10 mx-auto' : 'w-full'}`} />
                        ))}
                    </div>
                </div>

                {/* Main Content Skeleton */}
                <div className="flex-1 p-8">
                    <div className="flex flex-col items-center justify-center min-h-[60vh]">
                        <div className="bg-[#111]/80 backdrop-blur-sm rounded-2xl border border-white/10 p-12 text-center">
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
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="min-h-screen bg-[#0a0a0a] flex">
                {/* Left Menu */}
                <div className={`sticky top-0 h-screen transition-all duration-300 flex-shrink-0 z-30 ${isMenuCollapsed ? 'w-16' : 'w-56'}`}>
                    <DashboardMenu
                        activeTab={activeTab}
                        onTabChange={handleTabChange}
                        isCollapsed={isMenuCollapsed}
                        onToggleCollapse={() => setIsMenuCollapsed(!isMenuCollapsed)}
                        userName={session.user?.name || session.user?.email || ""}
                        userImage={session.user?.image || undefined}
                    />
                    {/* Collapse Toggle Button - Outside DashboardMenu to avoid overflow issues */}
                    <button
                        onClick={() => setIsMenuCollapsed(!isMenuCollapsed)}
                        className="absolute top-1/2 -right-3 transform -translate-y-1/2 w-6 h-6 rounded-full bg-[#1a1a1a] border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#2a2a2a] transition-all duration-300 z-20"
                        title={isMenuCollapsed ? "Menüyü Genişlet" : "Menüyü Daralt"}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className={`h-3 w-3 transition-transform duration-300 ease-in-out ${isMenuCollapsed ? 'rotate-180' : ''}`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                </div>

                {/* Right Content */}
                <main className="flex-1 p-8">
                    {renderContent()}
                </main>
            </div>

            {/* Confirm Dialog */}
            <ConfirmDialog
                isOpen={confirmDialog.isOpen}
                onClose={() => setConfirmDialog({ isOpen: false, type: null })}
                onConfirm={handleConfirmAction}
                title="CV ve Site Bilgilerini Sil"
                message="CV'nizi ve site bilgilerinizi silmek istediğinizden emin misiniz?"
                confirmText="Sil"
                variant="danger"
                loading={deleting}
                confirmInputText="DELETE"
            />
        </>
    );
}

export default function DashboardPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
                <div className="text-white text-xl">Loading...</div>
            </div>
        }>
            <DashboardContent />
        </Suspense>
    );
}
