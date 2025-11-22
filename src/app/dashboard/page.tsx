"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import CVUploader from "@/components/CVUploader";

export default function DashboardPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [sites, setSites] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState<string | null>(null);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        }
        
        if (status === "authenticated") {
            fetchSites();
        }
    }, [status, router]);

    const fetchSites = async () => {
        try {
            const response = await fetch("/api/site/list");
            if (response.ok) {
                const data = await response.json();
                setSites(data.sites || []);
            }
        } catch (error) {
            console.error("Site yükleme hatası:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (siteId: string) => {
        if (!confirm("Bu siteyi silmek istediğinizden emin misiniz?")) {
            return;
        }

        setDeleting(siteId);
        try {
            const response = await fetch(`/api/site/delete?id=${siteId}`, {
                method: "DELETE",
            });

            if (response.ok) {
                // Site listesini güncelle
                setSites(sites.filter(site => site.id !== siteId));
            } else {
                const data = await response.json();
                alert(data.error || "Site silinemedi");
            }
        } catch (error) {
            console.error("Silme hatası:", error);
            alert("Bir hata oluştu");
        } finally {
            setDeleting(null);
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

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            <nav className="bg-gray-800 border-b border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <h1 className="text-xl font-bold text-white">Personal Site Builder</h1>
                        <button
                            onClick={() => signOut({ callbackUrl: "/login" })}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition duration-200"
                        >
                            Sign Out
                        </button>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-700 mb-8">
                    <h2 className="text-3xl font-bold text-white mb-4">
                        Welcome, {session.user?.name || session.user?.email}! 👋
                    </h2>
                    <p className="text-gray-300 mb-8">
                        Yükle CV'nizi yükleyin ve AI ile kişisel web sitenizi oluşturun.
                    </p>
                </div>

                {/* CV Uploader */}
                <div className="mb-8">
                    <CVUploader />
                </div>

                {/* Sites Grid */}
                <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-700">
                    <h3 className="text-2xl font-bold text-white mb-6">Sitelerim</h3>
                    
                    {loading ? (
                        <p className="text-gray-400">Yükleniyor...</p>
                    ) : sites.length === 0 ? (
                        <p className="text-gray-400">Henüz bir site oluşturmadınız. Yukarıdan CV yükleyerek başlayın!</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {sites.map((site) => (
                                <div key={site.id} className="bg-gray-700 p-6 rounded-xl border border-gray-600 relative">
                                    {/* Silme Butonu */}
                                    <button
                                        onClick={() => handleDelete(site.id)}
                                        disabled={deleting === site.id}
                                        className="absolute top-4 right-4 text-red-400 hover:text-red-300 disabled:opacity-50 transition-colors"
                                        title="Siteyi Sil"
                                    >
                                        {deleting === site.id ? (
                                            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        )}
                                    </button>

                                    <h4 className="text-lg font-semibold text-white mb-2 pr-8">{site.title}</h4>
                                    <p className="text-gray-400 text-sm mb-4">
                                        Durum: <span className="text-blue-400">{site.status}</span>
                                    </p>
                                    {site.cvUrl && (
                                        <a 
                                            href={site.cvUrl} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="text-blue-400 hover:text-blue-300 text-sm"
                                        >
                                            CV'yi Görüntüle →
                                        </a>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
