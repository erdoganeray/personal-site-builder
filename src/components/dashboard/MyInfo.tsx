"use client";

import { useState, useEffect } from "react";
import CVUploader from "@/components/CVUploader";
import type { CVData } from "@/lib/gemini-pdf-parser";

interface MyInfoProps {
    site: any;
    cvData: CVData | null;
    onDelete: () => void;
    onCVAnalyzed: (analyzedData: CVData, siteId: string) => void;
    deleting: boolean;
}

export default function MyInfo({ site, cvData, onDelete, onCVAnalyzed, deleting }: MyInfoProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);

    // Form state
    const [name, setName] = useState("");
    const [jobTitle, setJobTitle] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [location, setLocation] = useState("");
    const [linkedinUrl, setLinkedinUrl] = useState("");
    const [githubUrl, setGithubUrl] = useState("");
    const [facebookUrl, setFacebookUrl] = useState("");
    const [instagramUrl, setInstagramUrl] = useState("");
    const [xUrl, setXUrl] = useState("");
    const [websiteUrl, setWebsiteUrl] = useState("");
    const [summary, setSummary] = useState("");
    const [experience, setExperience] = useState<any[]>([]);
    const [education, setEducation] = useState<any[]>([]);
    const [skills, setSkills] = useState<string[]>([]);
    const [languages, setLanguages] = useState<string[]>([]);
    const [profilePhotoUrl, setProfilePhotoUrl] = useState("");
    const [uploadingPhoto, setUploadingPhoto] = useState(false);
    const [portfolio, setPortfolio] = useState<Array<{ imageUrl: string }>>([]);
    const [uploadingPortfolio, setUploadingPortfolio] = useState(false);

    // Load data from site or cvData
    useEffect(() => {
        if (site) {
            setName(site.name || cvData?.personalInfo?.name || "");
            setJobTitle(site.jobTitle || cvData?.personalInfo?.title || "");
            setEmail(site.email || cvData?.personalInfo?.email || "");
            setPhone(site.phone || cvData?.personalInfo?.phone || "");
            setLocation(site.location || cvData?.personalInfo?.location || "");
            setLinkedinUrl(site.cvContent?.personalInfo?.linkedin || cvData?.personalInfo?.linkedin || "");
            setGithubUrl(site.cvContent?.personalInfo?.github || cvData?.personalInfo?.github || "");
            setFacebookUrl(site.cvContent?.personalInfo?.facebook || cvData?.personalInfo?.facebook || "");
            setInstagramUrl(site.cvContent?.personalInfo?.instagram || cvData?.personalInfo?.instagram || "");
            setXUrl(site.cvContent?.personalInfo?.x || cvData?.personalInfo?.x || "");
            setWebsiteUrl(site.cvContent?.personalInfo?.website || cvData?.personalInfo?.website || "");
            setSummary(site.summary || cvData?.summary || "");
            setProfilePhotoUrl(site.cvContent?.personalInfo?.profilePhotoUrl || "");
            setPortfolio(site.cvContent?.portfolio || cvData?.portfolio || []);

            // Parse JSON fields
            try {
                setExperience(site.experience ? JSON.parse(site.experience) : cvData?.experience || []);
                setEducation(site.education ? JSON.parse(site.education) : cvData?.education || []);
                setSkills(site.skills ? JSON.parse(site.skills) : cvData?.skills || []);
                setLanguages(site.languages ? JSON.parse(site.languages) : cvData?.languages || []);
            } catch (error) {
                console.error("Error parsing JSON fields:", error);
                setExperience(cvData?.experience || []);
                setEducation(cvData?.education || []);
                setSkills(cvData?.skills || []);
                setLanguages(cvData?.languages || []);
            }
        }
    }, [site, cvData]);

    // URL'lerin başına https:// ekleyen yardımcı fonksiyon
    const ensureHttps = (url: string) => {
        if (!url || url.trim() === '') return '';
        const trimmedUrl = url.trim();
        if (trimmedUrl.startsWith('http://') || trimmedUrl.startsWith('https://')) {
            return trimmedUrl;
        }
        return `https://${trimmedUrl}`;
    };

    const handleSave = async () => {
        if (!site) return;

        setSaving(true);
        try {
            const response = await fetch("/api/site/update-info", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    siteId: site.id,
                    name,
                    jobTitle,
                    email,
                    phone,
                    location,
                    linkedinUrl: ensureHttps(linkedinUrl),
                    githubUrl: ensureHttps(githubUrl),
                    facebookUrl: ensureHttps(facebookUrl),
                    instagramUrl: ensureHttps(instagramUrl),
                    xUrl: ensureHttps(xUrl),
                    websiteUrl: ensureHttps(websiteUrl),
                    summary,
                    experience,
                    education,
                    portfolio,
                    skills,
                    languages,
                    profilePhotoUrl,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                alert("Bilgileriniz başarıyla kaydedildi!");
                setIsEditing(false);
                window.location.reload(); // Refresh to show updated data
            } else {
                alert(data.error || "Bilgiler kaydedilemedi");
            }
        } catch (error) {
            console.error("Error saving info:", error);
            alert("Bir hata oluştu");
        } finally {
            setSaving(false);
        }
    };

    const addExperience = () => {
        setExperience([...experience, { company: "", position: "", duration: "", description: "" }]);
    };

    const removeExperience = (index: number) => {
        setExperience(experience.filter((_, i) => i !== index));
    };

    const updateExperience = (index: number, field: string, value: string) => {
        const updated = [...experience];
        updated[index] = { ...updated[index], [field]: value };
        setExperience(updated);
    };

    const addEducation = () => {
        setEducation([...education, { school: "", degree: "", field: "", year: "" }]);
    };

    const removeEducation = (index: number) => {
        setEducation(education.filter((_, i) => i !== index));
    };

    const updateEducation = (index: number, field: string, value: string) => {
        const updated = [...education];
        updated[index] = { ...updated[index], [field]: value };
        setEducation(updated);
    };

    const addSkill = () => {
        setSkills([...skills, ""]);
    };

    const removeSkill = (index: number) => {
        setSkills(skills.filter((_, i) => i !== index));
    };

    const updateSkill = (index: number, value: string) => {
        const updated = [...skills];
        updated[index] = value;
        setSkills(updated);
    };

    const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
        if (!allowedTypes.includes(file.type)) {
            alert("Sadece JPEG, PNG ve WebP formatları desteklenmektedir");
            return;
        }

        // Validate file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert("Dosya boyutu 5MB'dan küçük olmalıdır");
            return;
        }

        setUploadingPhoto(true);
        try {
            const formData = new FormData();
            formData.append("file", file);

            const response = await fetch("/api/upload/profile-photo", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                setProfilePhotoUrl(data.url);
                alert("Profil fotoğrafı yüklendi! Değişiklikleri kaydetmeyi unutmayın.");
            } else {
                alert(data.error || "Fotoğraf yüklenemedi");
            }
        } catch (error) {
            console.error("Error uploading photo:", error);
            alert("Bir hata oluştu");
        } finally {
            setUploadingPhoto(false);
        }
    };

    const handlePhotoDelete = async () => {
        if (!profilePhotoUrl) return;
        
        if (!confirm("Profil fotoğrafını silmek istediğinizden emin misiniz?")) {
            return;
        }

        setUploadingPhoto(true);
        try {
            const response = await fetch(`/api/upload/profile-photo?url=${encodeURIComponent(profilePhotoUrl)}`, {
                method: "DELETE",
            });

            const data = await response.json();

            if (response.ok) {
                setProfilePhotoUrl("");
                alert("Profil fotoğrafı silindi! Değişiklikleri kaydetmeyi unutmayın.");
            } else {
                alert(data.error || "Fotoğraf silinemedi");
            }
        } catch (error) {
            console.error("Error deleting photo:", error);
            alert("Bir hata oluştu");
        } finally {
            setUploadingPhoto(false);
        }
    };

    const addLanguage = () => {
        setLanguages([...languages, ""]);
    };

    const removeLanguage = (index: number) => {
        setLanguages(languages.filter((_, i) => i !== index));
    };

    const updateLanguage = (index: number, value: string) => {
        const updated = [...languages];
        updated[index] = value;
        setLanguages(updated);
    };

    const handlePortfolioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Check max limit
        if (portfolio.length >= 5) {
            alert("Maksimum 5 adet portfolio fotoğrafı ekleyebilirsiniz");
            return;
        }

        // Validate file type
        const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
        if (!allowedTypes.includes(file.type)) {
            alert("Sadece JPEG, PNG ve WebP formatları desteklenmektedir");
            return;
        }

        // Validate file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert("Dosya boyutu 5MB'dan küçük olmalıdır");
            return;
        }

        setUploadingPortfolio(true);
        try {
            const formData = new FormData();
            formData.append("file", file);

            const response = await fetch("/api/upload/portfolio", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                setPortfolio([...portfolio, { imageUrl: data.url }]);
                alert("Portfolio fotoğrafı yüklendi! Değişiklikleri kaydetmeyi unutmayın.");
            } else {
                alert(data.error || "Fotoğraf yüklenemedi");
            }
        } catch (error) {
            console.error("Error uploading portfolio image:", error);
            alert("Bir hata oluştu");
        } finally {
            setUploadingPortfolio(false);
        }
    };

    const handlePortfolioDelete = async (imageUrl: string, index: number) => {
        if (!confirm("Bu portfolio fotoğrafını silmek istediğinizden emin misiniz?")) {
            return;
        }

        setUploadingPortfolio(true);
        try {
            const response = await fetch(`/api/upload/portfolio?url=${encodeURIComponent(imageUrl)}`, {
                method: "DELETE",
            });

            const data = await response.json();

            if (response.ok) {
                setPortfolio(portfolio.filter((_, i) => i !== index));
                alert("Portfolio fotoğrafı silindi! Değişiklikleri kaydetmeyi unutmayın.");
            } else {
                alert(data.error || "Fotoğraf silinemedi");
            }
        } catch (error) {
            console.error("Error deleting portfolio image:", error);
            alert("Bir hata oluştu");
        } finally {
            setUploadingPortfolio(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-white mb-2">Bilgilerim</h2>
                <p className="text-gray-400">
                    CV'nizi yükleyin veya mevcut CV bilgilerinizi görüntüleyin/düzenleyin
                </p>
            </div>

            {!site || !cvData ? (
                <CVUploader onAnalyzed={onCVAnalyzed} />
            ) : (
                <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-white">CV'im</h3>
                        <div className="flex gap-2">
                            {!isEditing ? (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                    <span>Düzenle</span>
                                </button>
                            ) : (
                                <>
                                    <button
                                        onClick={handleSave}
                                        disabled={saving}
                                        className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg transition-colors duration-200"
                                    >
                                        {saving ? (
                                            <>
                                                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                <span>Kaydediliyor...</span>
                                            </>
                                        ) : (
                                            <>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span>Kaydet</span>
                                            </>
                                        )}
                                    </button>
                                    <button
                                        onClick={() => setIsEditing(false)}
                                        disabled={saving}
                                        className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white rounded-lg transition-colors duration-200"
                                    >
                                        <span>İptal</span>
                                    </button>
                                </>
                            )}
                            <button
                                onClick={onDelete}
                                disabled={deleting || isEditing}
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
                    </div>

                    <div className="space-y-4">
                        {/* Personal Info */}
                        <div className="bg-gray-700/50 rounded-lg p-4">
                            <h4 className="text-lg font-semibold text-white mb-3">Kişisel Bilgiler</h4>
                            
                            {/* Profile Photo Section */}
                            <div className="mb-6 flex flex-col items-center">
                                <div className="w-32 h-32 rounded-full bg-gray-600 flex items-center justify-center mb-3 overflow-hidden border-4 border-gray-500">
                                    {profilePhotoUrl ? (
                                        <img 
                                            src={profilePhotoUrl} 
                                            alt="Profile" 
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-4xl text-gray-400 font-semibold">
                                            {name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '?'}
                                        </span>
                                    )}
                                </div>
                                {isEditing && (
                                    <div className="flex gap-2">
                                        <label className="cursor-pointer">
                                            <input
                                                type="file"
                                                accept="image/jpeg,image/jpg,image/png,image/webp"
                                                onChange={handlePhotoUpload}
                                                disabled={uploadingPhoto}
                                                className="hidden"
                                            />
                                            <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                                uploadingPhoto 
                                                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                                                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                                            }`}>
                                                {uploadingPhoto ? (
                                                    <>
                                                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                        Yükleniyor...
                                                    </>
                                                ) : (
                                                    <>
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                        Fotoğraf Ekle
                                                    </>
                                                )}
                                            </span>
                                        </label>
                                        {profilePhotoUrl && !uploadingPhoto && (
                                            <button
                                                onClick={handlePhotoDelete}
                                                className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                                Fotoğrafı Sil
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="space-y-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Ad Soyad</label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full px-3 py-2 bg-gray-600 border border-gray-500 text-white rounded-lg focus:ring-2 focus:ring-blue-500"
                                        />
                                    ) : (
                                        <p className="text-gray-300">{name || "-"}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Ünvan</label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={jobTitle}
                                            onChange={(e) => setJobTitle(e.target.value)}
                                            className="w-full px-3 py-2 bg-gray-600 border border-gray-500 text-white rounded-lg focus:ring-2 focus:ring-blue-500"
                                        />
                                    ) : (
                                        <p className="text-gray-300">{jobTitle || "-"}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                                    {isEditing ? (
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full px-3 py-2 bg-gray-600 border border-gray-500 text-white rounded-lg focus:ring-2 focus:ring-blue-500"
                                        />
                                    ) : (
                                        <p className="text-gray-300">{email || "-"}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Telefon</label>
                                    {isEditing ? (
                                        <input
                                            type="tel"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            className="w-full px-3 py-2 bg-gray-600 border border-gray-500 text-white rounded-lg focus:ring-2 focus:ring-blue-500"
                                        />
                                    ) : (
                                        <p className="text-gray-300">{phone || "-"}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Konum</label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={location}
                                            onChange={(e) => setLocation(e.target.value)}
                                            className="w-full px-3 py-2 bg-gray-600 border border-gray-500 text-white rounded-lg focus:ring-2 focus:ring-blue-500"
                                        />
                                    ) : (
                                        <p className="text-gray-300">{location || "-"}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">LinkedIn URL</label>
                                    {isEditing ? (
                                        <input
                                            type="url"
                                            value={linkedinUrl}
                                            onChange={(e) => setLinkedinUrl(e.target.value)}
                                            placeholder="https://linkedin.com/in/kullaniciadi"
                                            className="w-full px-3 py-2 bg-gray-600 border border-gray-500 text-white rounded-lg focus:ring-2 focus:ring-blue-500"
                                        />
                                    ) : (
                                        <p className="text-gray-300">{linkedinUrl || "-"}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">GitHub URL</label>
                                    {isEditing ? (
                                        <input
                                            type="url"
                                            value={githubUrl}
                                            onChange={(e) => setGithubUrl(e.target.value)}
                                            placeholder="https://github.com/kullaniciadi"
                                            className="w-full px-3 py-2 bg-gray-600 border border-gray-500 text-white rounded-lg focus:ring-2 focus:ring-blue-500"
                                        />
                                    ) : (
                                        <p className="text-gray-300">{githubUrl || "-"}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Facebook URL</label>
                                    {isEditing ? (
                                        <input
                                            type="url"
                                            value={facebookUrl}
                                            onChange={(e) => setFacebookUrl(e.target.value)}
                                            placeholder="https://facebook.com/kullaniciadi"
                                            className="w-full px-3 py-2 bg-gray-600 border border-gray-500 text-white rounded-lg focus:ring-2 focus:ring-blue-500"
                                        />
                                    ) : (
                                        <p className="text-gray-300">{facebookUrl || "-"}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Instagram URL</label>
                                    {isEditing ? (
                                        <input
                                            type="url"
                                            value={instagramUrl}
                                            onChange={(e) => setInstagramUrl(e.target.value)}
                                            placeholder="https://instagram.com/kullaniciadi"
                                            className="w-full px-3 py-2 bg-gray-600 border border-gray-500 text-white rounded-lg focus:ring-2 focus:ring-blue-500"
                                        />
                                    ) : (
                                        <p className="text-gray-300">{instagramUrl || "-"}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">X (Twitter) URL</label>
                                    {isEditing ? (
                                        <input
                                            type="url"
                                            value={xUrl}
                                            onChange={(e) => setXUrl(e.target.value)}
                                            placeholder="https://x.com/kullaniciadi"
                                            className="w-full px-3 py-2 bg-gray-600 border border-gray-500 text-white rounded-lg focus:ring-2 focus:ring-blue-500"
                                        />
                                    ) : (
                                        <p className="text-gray-300">{xUrl || "-"}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Web Site URL</label>
                                    {isEditing ? (
                                        <input
                                            type="url"
                                            value={websiteUrl}
                                            onChange={(e) => setWebsiteUrl(e.target.value)}
                                            placeholder="https://www.websitesi.com"
                                            className="w-full px-3 py-2 bg-gray-600 border border-gray-500 text-white rounded-lg focus:ring-2 focus:ring-blue-500"
                                        />
                                    ) : (
                                        <p className="text-gray-300">{websiteUrl || "-"}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Summary */}
                        <div className="bg-gray-700/50 rounded-lg p-4">
                            <h4 className="text-lg font-semibold text-white mb-3">Özet</h4>
                            {isEditing ? (
                                <textarea
                                    value={summary}
                                    onChange={(e) => setSummary(e.target.value)}
                                    rows={4}
                                    className="w-full px-3 py-2 bg-gray-600 border border-gray-500 text-white rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
                                />
                            ) : (
                                <p className="text-sm text-gray-300">{summary || "-"}</p>
                            )}
                        </div>

                        {/* Experience */}
                        <div className="bg-gray-700/50 rounded-lg p-4">
                            <div className="flex justify-between items-center mb-3">
                                <h4 className="text-lg font-semibold text-white">
                                    İş Deneyimi ({experience.length})
                                </h4>
                                {isEditing && (
                                    <button
                                        onClick={addExperience}
                                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
                                    >
                                        + Ekle
                                    </button>
                                )}
                            </div>
                            <div className="space-y-3">
                                {experience.map((exp, index) => (
                                    <div key={index} className="bg-gray-600/50 rounded p-3">
                                        {isEditing ? (
                                            <div className="space-y-2">
                                                <div className="flex justify-end">
                                                    <button
                                                        onClick={() => removeExperience(index)}
                                                        className="text-red-400 hover:text-red-300 text-sm"
                                                    >
                                                        Sil
                                                    </button>
                                                </div>
                                                <input
                                                    type="text"
                                                    placeholder="Pozisyon"
                                                    value={exp.position || ""}
                                                    onChange={(e) => updateExperience(index, "position", e.target.value)}
                                                    className="w-full px-2 py-1 bg-gray-700 border border-gray-600 text-white rounded text-sm"
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Şirket"
                                                    value={exp.company || ""}
                                                    onChange={(e) => updateExperience(index, "company", e.target.value)}
                                                    className="w-full px-2 py-1 bg-gray-700 border border-gray-600 text-white rounded text-sm"
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Süre (ör: 2020-2022)"
                                                    value={exp.duration || ""}
                                                    onChange={(e) => updateExperience(index, "duration", e.target.value)}
                                                    className="w-full px-2 py-1 bg-gray-700 border border-gray-600 text-white rounded text-sm"
                                                />
                                                <textarea
                                                    placeholder="Açıklama (opsiyonel)"
                                                    value={exp.description || ""}
                                                    onChange={(e) => updateExperience(index, "description", e.target.value)}
                                                    rows={2}
                                                    className="w-full px-2 py-1 bg-gray-700 border border-gray-600 text-white rounded text-sm resize-none"
                                                />
                                            </div>
                                        ) : (
                                            <div className="text-sm">
                                                <p className="font-medium text-white">
                                                    {exp.position} - {exp.company}
                                                </p>
                                                <p className="text-gray-400">{exp.duration}</p>
                                                {exp.description && (
                                                    <p className="text-gray-300 mt-1">{exp.description}</p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}
                                {experience.length === 0 && <p className="text-gray-400 text-sm">Henüz iş deneyimi eklenmemiş</p>}
                            </div>
                        </div>

                        {/* Education */}
                        <div className="bg-gray-700/50 rounded-lg p-4">
                            <div className="flex justify-between items-center mb-3">
                                <h4 className="text-lg font-semibold text-white">
                                    Eğitim ({education.length})
                                </h4>
                                {isEditing && (
                                    <button
                                        onClick={addEducation}
                                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
                                    >
                                        + Ekle
                                    </button>
                                )}
                            </div>
                            <div className="space-y-3">
                                {education.map((edu, index) => (
                                    <div key={index} className="bg-gray-600/50 rounded p-3">
                                        {isEditing ? (
                                            <div className="space-y-2">
                                                <div className="flex justify-end">
                                                    <button
                                                        onClick={() => removeEducation(index)}
                                                        className="text-red-400 hover:text-red-300 text-sm"
                                                    >
                                                        Sil
                                                    </button>
                                                </div>
                                                <input
                                                    type="text"
                                                    placeholder="Derece (ör: Lisans)"
                                                    value={edu.degree || ""}
                                                    onChange={(e) => updateEducation(index, "degree", e.target.value)}
                                                    className="w-full px-2 py-1 bg-gray-700 border border-gray-600 text-white rounded text-sm"
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Alan (ör: Bilgisayar Mühendisliği)"
                                                    value={edu.field || ""}
                                                    onChange={(e) => updateEducation(index, "field", e.target.value)}
                                                    className="w-full px-2 py-1 bg-gray-700 border border-gray-600 text-white rounded text-sm"
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Okul"
                                                    value={edu.school || ""}
                                                    onChange={(e) => updateEducation(index, "school", e.target.value)}
                                                    className="w-full px-2 py-1 bg-gray-700 border border-gray-600 text-white rounded text-sm"
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Yıl (ör: 2018-2022)"
                                                    value={edu.year || ""}
                                                    onChange={(e) => updateEducation(index, "year", e.target.value)}
                                                    className="w-full px-2 py-1 bg-gray-700 border border-gray-600 text-white rounded text-sm"
                                                />
                                            </div>
                                        ) : (
                                            <div className="text-sm">
                                                <p className="font-medium text-white">
                                                    {edu.degree} - {edu.field}
                                                </p>
                                                <p className="text-gray-400">
                                                    {edu.school} ({edu.year})
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                                {education.length === 0 && <p className="text-gray-400 text-sm">Henüz eğitim bilgisi eklenmemiş</p>}
                            </div>
                        </div>

                        {/* Portfolio */}
                        <div className="bg-gray-700/50 rounded-lg p-4">
                            <div className="flex justify-between items-center mb-3">
                                <h4 className="text-lg font-semibold text-white">
                                    Portfolio ({portfolio.length}/5)
                                </h4>
                                {isEditing && portfolio.length < 5 && (
                                    <label className="cursor-pointer">
                                        <input
                                            type="file"
                                            accept="image/jpeg,image/jpg,image/png,image/webp"
                                            onChange={handlePortfolioUpload}
                                            disabled={uploadingPortfolio}
                                            className="hidden"
                                        />
                                        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded text-sm font-medium transition-colors ${
                                            uploadingPortfolio 
                                                ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                                                : 'bg-blue-600 hover:bg-blue-700 text-white'
                                        }`}>
                                            {uploadingPortfolio ? 'Yükleniyor...' : '+ Ekle'}
                                        </span>
                                    </label>
                                )}
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {portfolio.map((item, index) => (
                                    <div key={index} className="relative group aspect-square rounded-lg overflow-hidden bg-gray-600">
                                        <img 
                                            src={item.imageUrl} 
                                            alt={`Portfolio ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                        {isEditing && !uploadingPortfolio && (
                                            <button
                                                onClick={() => handlePortfolioDelete(item.imageUrl, index)}
                                                className="absolute top-2 right-2 p-2 bg-red-600 hover:bg-red-700 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        )}
                                    </div>
                                ))}
                                {portfolio.length === 0 && (
                                    <div className="col-span-2 md:col-span-3 text-center py-8">
                                        <p className="text-gray-400 text-sm">Henüz portfolio fotoğrafı eklenmemiş</p>
                                        {isEditing && (
                                            <p className="text-gray-500 text-xs mt-2">Maksimum 5 adet fotoğraf ekleyebilirsiniz</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Skills */}
                        <div className="bg-gray-700/50 rounded-lg p-4">
                            <div className="flex justify-between items-center mb-3">
                                <h4 className="text-lg font-semibold text-white">Yetenekler</h4>
                                {isEditing && (
                                    <button
                                        onClick={addSkill}
                                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
                                    >
                                        + Ekle
                                    </button>
                                )}
                            </div>
                            {isEditing ? (
                                <div className="space-y-2">
                                    {skills.map((skill, index) => (
                                        <div key={index} className="flex gap-2">
                                            <input
                                                type="text"
                                                value={skill}
                                                onChange={(e) => updateSkill(index, e.target.value)}
                                                className="flex-1 px-2 py-1 bg-gray-600 border border-gray-500 text-white rounded text-sm"
                                            />
                                            <button
                                                onClick={() => removeSkill(index)}
                                                className="px-2 text-red-400 hover:text-red-300"
                                            >
                                                Sil
                                            </button>
                                        </div>
                                    ))}
                                    {skills.length === 0 && <p className="text-gray-400 text-sm">Yetenek ekleyin</p>}
                                </div>
                            ) : (
                                <div className="flex flex-wrap gap-2">
                                    {skills.map((skill, index) => (
                                        <span
                                            key={index}
                                            className="px-3 py-1 text-sm bg-blue-600 text-white rounded-full"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                    {skills.length === 0 && <p className="text-gray-400 text-sm">Henüz yetenek eklenmemiş</p>}
                                </div>
                            )}
                        </div>

                        {/* Languages */}
                        <div className="bg-gray-700/50 rounded-lg p-4">
                            <div className="flex justify-between items-center mb-3">
                                <h4 className="text-lg font-semibold text-white">Diller</h4>
                                {isEditing && (
                                    <button
                                        onClick={addLanguage}
                                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
                                    >
                                        + Ekle
                                    </button>
                                )}
                            </div>
                            {isEditing ? (
                                <div className="space-y-2">
                                    {languages.map((lang, index) => (
                                        <div key={index} className="flex gap-2">
                                            <input
                                                type="text"
                                                value={lang}
                                                onChange={(e) => updateLanguage(index, e.target.value)}
                                                className="flex-1 px-2 py-1 bg-gray-600 border border-gray-500 text-white rounded text-sm"
                                            />
                                            <button
                                                onClick={() => removeLanguage(index)}
                                                className="px-2 text-red-400 hover:text-red-300"
                                            >
                                                Sil
                                            </button>
                                        </div>
                                    ))}
                                    {languages.length === 0 && <p className="text-gray-400 text-sm">Dil ekleyin</p>}
                                </div>
                            ) : (
                                <div className="flex flex-wrap gap-2">
                                    {languages.map((lang, index) => (
                                        <span
                                            key={index}
                                            className="px-3 py-1 text-sm bg-green-600 text-white rounded-full"
                                        >
                                            {lang}
                                        </span>
                                    ))}
                                    {languages.length === 0 && <p className="text-gray-400 text-sm">Henüz dil eklenmemiş</p>}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
