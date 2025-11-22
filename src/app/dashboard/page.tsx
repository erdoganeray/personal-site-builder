"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import CVUploader from "@/components/CVUploader";
import type { CVData } from "@/lib/gemini-pdf-parser";

export default function DashboardPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [site, setSite] = useState<any>(null);
    const [cvData, setCvData] = useState<CVData | null>(null);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);
    const [generating, setGenerating] = useState(false);
    const [linkedinUrl, setLinkedinUrl] = useState("");
    const [githubUrl, setGithubUrl] = useState("");
    const [savingLinks, setSavingLinks] = useState(false);

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
                
                // LinkedIn ve GitHub URL'lerini state'e aktar
                if (userSite) {
                    setLinkedinUrl(userSite.linkedinUrl || "");
                    setGithubUrl(userSite.githubUrl || "");
                }
                
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

    const handleGenerateSite = async () => {
        if (!site) {
            alert("Lütfen önce CV yükleyin");
            return;
        }

        setGenerating(true);
        try {
            const response = await fetch("/api/site/generate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    siteId: site.id,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                // Başarılı - Preview sayfasına yönlendir
                router.push(`/preview/${site.id}`);
            } else {
                // Hata durumu
                alert(data.error || "Site oluşturulamadı. Lütfen tekrar deneyin.");
            }
        } catch (error) {
            console.error("Site oluşturma hatası:", error);
            alert("Bir hata oluştu. Lütfen tekrar deneyin.");
        } finally {
            setGenerating(false);
        }
    };

    const handleSaveLinks = async () => {
        if (!site) return;

        setSavingLinks(true);
        try {
            const response = await fetch("/api/site/update-links", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    siteId: site.id,
                    linkedinUrl: linkedinUrl.trim(),
                    githubUrl: githubUrl.trim(),
                }),
            });

            const data = await response.json();

            if (response.ok) {
                // State'i güncelle
                setSite({
                    ...site,
                    linkedinUrl: linkedinUrl.trim(),
                    githubUrl: githubUrl.trim(),
                });
                alert("Linkler başarıyla kaydedildi!");
            } else {
                alert(data.error || "Linkler kaydedilemedi");
            }
        } catch (error) {
            console.error("Link kaydetme hatası:", error);
            alert("Bir hata oluştu");
        } finally {
            setSavingLinks(false);
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
                        Hoş geldin, {session.user?.name || session.user?.email}! 👋
                    </h2>
                    <p className="text-gray-300 mb-8">
                        {site ? "CV'nizi görüntüleyin veya güncelleyin." : "CV'nizi yükleyin ve AI ile kişisel web sitenizi oluşturun."}
                    </p>
                </div>

                {/* CV Uploader veya CV Görüntüleme */}
                <div className="mb-8">
                    {!site || !cvData ? (
                        <CVUploader onAnalyzed={handleCVAnalyzed} />
                    ) : (
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    CV'im
                                </h2>
                                <button
                                    onClick={handleDelete}
                                    disabled={deleting}
                                    className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white rounded-lg transition-colors duration-200"
                                >
                                    {deleting ? (
                                        <>
                                            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            <span>Siliniyor...</span>
                                        </>
                                    ) : (
                                        <>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                            <span>CV'yi Sil</span>
                                        </>
                                    )}
                                </button>
                            </div>

                            <div className="space-y-6">
                                {/* Personal Info */}
                                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                                        Kişisel Bilgiler
                                    </h3>
                                    <div className="space-y-2 text-sm">
                                        <p className="text-gray-700 dark:text-gray-300">
                                            <strong>Ad Soyad:</strong> {cvData.personalInfo.name}
                                        </p>
                                        {cvData.personalInfo.title && (
                                            <p className="text-gray-700 dark:text-gray-300">
                                                <strong>Ünvan:</strong> {cvData.personalInfo.title}
                                            </p>
                                        )}
                                        {cvData.personalInfo.email && (
                                            <p className="text-gray-700 dark:text-gray-300">
                                                <strong>Email:</strong> {cvData.personalInfo.email}
                                            </p>
                                        )}
                                        {cvData.personalInfo.phone && (
                                            <p className="text-gray-700 dark:text-gray-300">
                                                <strong>Telefon:</strong> {cvData.personalInfo.phone}
                                            </p>
                                        )}
                                        {cvData.personalInfo.location && (
                                            <p className="text-gray-700 dark:text-gray-300">
                                                <strong>Konum:</strong> {cvData.personalInfo.location}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Summary */}
                                {cvData.summary && (
                                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                                            Özet
                                        </h3>
                                        <p className="text-sm text-gray-700 dark:text-gray-300">
                                            {cvData.summary}
                                        </p>
                                    </div>
                                )}

                                {/* Experience */}
                                {cvData.experience.length > 0 && (
                                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                                            İş Deneyimi ({cvData.experience.length})
                                        </h3>
                                        <div className="space-y-3">
                                            {cvData.experience.map((exp, index) => (
                                                <div key={index} className="text-sm">
                                                    <p className="font-medium text-gray-900 dark:text-white">
                                                        {exp.position} - {exp.company}
                                                    </p>
                                                    <p className="text-gray-600 dark:text-gray-400">
                                                        {exp.duration}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Education */}
                                {cvData.education.length > 0 && (
                                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                                            Eğitim ({cvData.education.length})
                                        </h3>
                                        <div className="space-y-3">
                                            {cvData.education.map((edu, index) => (
                                                <div key={index} className="text-sm">
                                                    <p className="font-medium text-gray-900 dark:text-white">
                                                        {edu.degree} - {edu.field}
                                                    </p>
                                                    <p className="text-gray-600 dark:text-gray-400">
                                                        {edu.school} ({edu.year})
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Skills */}
                                {cvData.skills.length > 0 && (
                                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                                            Yetenekler
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {cvData.skills.map((skill, index) => (
                                                <span
                                                    key={index}
                                                    className="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full"
                                                >
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Languages */}
                                {cvData.languages.length > 0 && (
                                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                                            Diller
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {cvData.languages.map((lang, index) => (
                                                <span
                                                    key={index}
                                                    className="px-3 py-1 text-sm bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full"
                                                >
                                                    {lang}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="space-y-3">
                                    {site.htmlContent ? (
                                        <>
                                            <button
                                                onClick={() => router.push(`/preview/${site.id}`)}
                                                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                                            >
                                                <div className="flex items-center justify-center gap-2">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                    <span>Sitemi Görüntüle (Preview)</span>
                                                </div>
                                            </button>
                                            <button
                                                onClick={handleGenerateSite}
                                                disabled={generating}
                                                className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-4 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
                                            >
                                                {generating ? (
                                                    <div className="flex items-center justify-center gap-3">
                                                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                        <span>AI ile siteniz yeniden oluşturuluyor... (30-60 saniye)</span>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center justify-center gap-2">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                        </svg>
                                                        <span>Sitemi Yeniden Oluştur</span>
                                                    </div>
                                                )}
                                            </button>
                                            <p className="text-sm text-center text-gray-500 dark:text-gray-400">
                                                Site daha önce oluşturulmuş. Görüntüleyebilir veya yeniden oluşturabilirsiniz.
                                            </p>
                                        </>
                                    ) : (
                                        <button
                                            onClick={handleGenerateSite}
                                            disabled={generating}
                                            className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-4 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
                                        >
                                            {generating ? (
                                                <div className="flex items-center justify-center gap-3">
                                                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    <span>AI ile siteniz oluşturuluyor... (30-60 saniye)</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-center gap-2">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                    </svg>
                                                    <span>AI ile Sitemi Oluştur →</span>
                                                </div>
                                            )}
                                        </button>
                                    )}
                                </div>
                                
                                {/* Optional: Social Links Section */}
                                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                                        Opsiyonel: Sosyal Medya Linkleri
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                        LinkedIn ve GitHub profilinizi ekleyerek sitenizi daha profesyonel hale getirebilirsiniz.
                                    </p>
                                    <div className="space-y-3">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                LinkedIn Profil URL
                                            </label>
                                            <input
                                                type="url"
                                                placeholder="https://linkedin.com/in/kullaniciadi"
                                                value={linkedinUrl}
                                                onChange={(e) => setLinkedinUrl(e.target.value)}
                                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                GitHub Profil URL
                                            </label>
                                            <input
                                                type="url"
                                                placeholder="https://github.com/kullaniciadi"
                                                value={githubUrl}
                                                onChange={(e) => setGithubUrl(e.target.value)}
                                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                            />
                                        </div>
                                        <button
                                            onClick={handleSaveLinks}
                                            disabled={savingLinks}
                                            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                                        >
                                            {savingLinks ? "Kaydediliyor..." : "Linkleri Kaydet"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
