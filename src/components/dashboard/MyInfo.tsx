"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import CVUploader from "@/components/CVUploader";
import type { CVData, CVPortfolioItem, CVSkill, CVLanguage } from "@/lib/gemini-pdf-parser";
import { hasUnpublishedChanges } from "@/lib/change-detection";
import PortfolioUploader from "@/components/dashboard/PortfolioUploader";
import PortfolioMetadataEditor from "@/components/dashboard/PortfolioMetadataEditor";
import StorageIndicator from "@/components/dashboard/StorageIndicator";
import ChangeDetailsPanel from "./ChangeDetailsPanel";

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
    const [publishing, setPublishing] = useState(false);

    // Original state backup for cancel functionality
    const originalStateRef = useRef<any>(null);

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
    const [skills, setSkills] = useState<(string | CVSkill)[]>([]); // Support both formats
    const [languages, setLanguages] = useState<(string | CVLanguage)[]>([]);
    const [profilePhotoUrl, setProfilePhotoUrl] = useState("");
    const [uploadingPhoto, setUploadingPhoto] = useState(false);
    const [portfolio, setPortfolio] = useState<CVPortfolioItem[]>([]);
    const [uploadingPortfolio, setUploadingPortfolio] = useState(false);
    const [editingPortfolioIndex, setEditingPortfolioIndex] = useState<number | null>(null);

    // Deferred upload state - files held in memory until save
    const [pendingProfilePhoto, setPendingProfilePhoto] = useState<File | null>(null);
    const [profilePhotoPreview, setProfilePhotoPreview] = useState<string>("");
    const [pendingPortfolio, setPendingPortfolio] = useState<Array<{ file: File; preview: string }>>([]);

    // Deferred deletion state - mark for deletion, actual delete happens on save
    const [photoMarkedForDeletion, setPhotoMarkedForDeletion] = useState(false);
    const [portfolioMarkedForDeletion, setPortfolioMarkedForDeletion] = useState<string[]>([]); // Array of imageUrls to delete


    // Storage refresh key - increment to force StorageIndicator to refresh
    const [storageRefreshKey, setStorageRefreshKey] = useState(0);
    const refreshStorage = () => setStorageRefreshKey(prev => prev + 1);


    // Helper function to normalize skills array - converts all strings to CVSkill objects
    const normalizeSkillsArray = (skills: (string | CVSkill)[]): CVSkill[] => {
        const levelPercentages: Record<string, number> = {
            'beginner': 40,
            'intermediate': 70,
            'advanced': 85,
            'expert': 95
        };

        return skills.map(skill => {
            if (typeof skill === 'string') {
                return {
                    name: skill,
                    level: 'intermediate' as const,
                    percentage: 70,
                    category: ''
                };
            }

            // Ensure percentage matches level
            const level = skill.level || 'intermediate';
            const percentage = skill.percentage !== undefined
                ? skill.percentage
                : levelPercentages[level];

            return {
                name: skill.name,
                level: level,
                percentage: percentage,
                category: skill.category || ''
            };
        });
    };

    // Helper function to normalize languages array - converts all strings to CVLanguage objects
    const normalizeLanguagesArray = (languages: (string | CVLanguage)[]): CVLanguage[] => {
        const levelPercentages: Record<string, number> = {
            'native': 100,
            'fluent': 90,
            'advanced': 75,
            'intermediate': 60,
            'basic': 40
        };

        return languages.map(lang => {
            if (typeof lang === 'string') {
                return {
                    name: lang,
                    level: 'intermediate',
                    percentage: 60,
                    certifications: undefined,
                    cefr: undefined
                };
            }

            // Ensure percentage matches level
            const level = lang.level || 'intermediate';
            const percentage = lang.percentage !== undefined
                ? lang.percentage
                : levelPercentages[level];

            return {
                name: lang.name,
                level: level,
                percentage: percentage,
                certifications: lang.certifications,
                cefr: lang.cefr
            };
        });
    };

    // Load data from site or cvData
    useEffect(() => {
        if (site) {
            console.log('Loading site data:', site);
            console.log('site.cvContent:', site.cvContent);
            console.log('site.cvContent?.portfolio:', site.cvContent?.portfolio);
            console.log('cvData?.portfolio:', cvData?.portfolio);

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

            console.log('Portfolio set to:', site.cvContent?.portfolio || cvData?.portfolio || []);

            // Parse JSON fields and normalize skills
            try {
                setExperience(site.experience ? JSON.parse(site.experience) : cvData?.experience || []);
                setEducation(site.education ? JSON.parse(site.education) : cvData?.education || []);

                // Normalize skills to ensure consistent format
                const rawSkills = site.skills ? JSON.parse(site.skills) : cvData?.skills || [];
                setSkills(normalizeSkillsArray(rawSkills));

                setLanguages(site.languages ? JSON.parse(site.languages) : cvData?.languages || []);
            } catch (error) {
                console.error("Error parsing JSON fields:", error);
                setExperience(cvData?.experience || []);
                setEducation(cvData?.education || []);
                setSkills(normalizeSkillsArray(cvData?.skills || []));
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
            // STEP 0: Delete profile photo if marked for deletion
            if (photoMarkedForDeletion && originalStateRef.current?.profilePhotoUrl) {
                setUploadingPhoto(true);
                try {
                    const response = await fetch(`/api/upload/profile-photo?url=${encodeURIComponent(originalStateRef.current.profilePhotoUrl)}`, {
                        method: "DELETE",
                    });

                    const data = await response.json();

                    if (response.ok) {
                        console.log("✅ Profile photo deleted from Cloudflare");
                        refreshStorage(); // Refresh storage indicator
                    } else {
                        console.error("Profile photo deletion failed:", data.error);
                        // Continue with save even if deletion fails
                    }
                } catch (error) {
                    console.error("Profile photo deletion error:", error);
                    // Continue with save even if deletion fails
                } finally {
                    setUploadingPhoto(false);
                }
            }

            // STEP 1: Upload pending profile photo if exists
            let finalProfilePhotoUrl = profilePhotoUrl;
            if (pendingProfilePhoto) {
                setUploadingPhoto(true);
                try {
                    const formData = new FormData();
                    formData.append("file", pendingProfilePhoto);

                    const photoResponse = await fetch("/api/upload/profile-photo", {
                        method: "POST",
                        body: formData,
                    });

                    const photoData = await photoResponse.json();

                    if (photoResponse.ok) {
                        finalProfilePhotoUrl = photoData.url;
                        console.log("✅ Profile photo uploaded:", finalProfilePhotoUrl);

                        // Delete old photo from Cloudflare if it exists
                        if (originalStateRef.current?.profilePhotoUrl) {
                            try {
                                const deleteResponse = await fetch(`/api/upload/profile-photo?url=${encodeURIComponent(originalStateRef.current.profilePhotoUrl)}`, {
                                    method: "DELETE",
                                });

                                if (deleteResponse.ok) {
                                    console.log("✅ Old profile photo deleted from Cloudflare");
                                } else {
                                    console.error("Old profile photo deletion failed");
                                    // Continue with save even if old photo deletion fails
                                }
                            } catch (error) {
                                console.error("Old profile photo deletion error:", error);
                                // Continue with save even if old photo deletion fails
                            }
                        }
                    } else {
                        throw new Error(photoData.error || "Profil fotoğrafı yüklenemedi");
                    }
                } catch (error) {
                    console.error("Profile photo upload error:", error);
                    alert("Profil fotoğrafı yüklenirken hata oluştu: " + (error instanceof Error ? error.message : "Bilinmeyen hata"));
                    setSaving(false);
                    setUploadingPhoto(false);
                    return; // Don't proceed with save if photo upload fails
                } finally {
                    setUploadingPhoto(false);
                }
            }

            // STEP 1.5: Delete portfolio images marked for deletion
            if (portfolioMarkedForDeletion.length > 0) {
                setUploadingPortfolio(true);
                try {
                    for (const imageUrl of portfolioMarkedForDeletion) {
                        try {
                            const response = await fetch(`/api/upload/portfolio?url=${encodeURIComponent(imageUrl)}`, {
                                method: "DELETE",
                            });

                            if (response.ok) {
                                console.log("✅ Portfolio image deleted from Cloudflare:", imageUrl);
                            } else {
                                const data = await response.json();
                                console.error("Portfolio image deletion failed:", data.error);
                                // Continue with other deletions even if one fails
                            }
                        } catch (error) {
                            console.error("Portfolio image deletion error:", error);
                            // Continue with other deletions even if one fails
                        }
                    }
                } finally {
                    setUploadingPortfolio(false);
                }
            }

            // STEP 2: Upload pending portfolio files if exist

            let finalPortfolio = [...portfolio];
            if (pendingPortfolio.length > 0) {
                setUploadingPortfolio(true);
                try {
                    const uploadedUrls: string[] = [];

                    for (let i = 0; i < pendingPortfolio.length; i++) {
                        const { file } = pendingPortfolio[i];
                        const formData = new FormData();
                        formData.append("file", file);

                        const portfolioResponse = await fetch("/api/upload/portfolio", {
                            method: "POST",
                            body: formData,
                        });

                        const portfolioData = await portfolioResponse.json();

                        if (portfolioResponse.ok) {
                            // API returns batch format: { uploads: [{ url: "..." }] }
                            const url = portfolioData.uploads?.[0]?.url || portfolioData.url;
                            if (url) {
                                uploadedUrls.push(url);
                                console.log(`✅ Portfolio image ${i + 1}/${pendingPortfolio.length} uploaded:`, url);
                            }
                        } else {
                            console.error(`Portfolio image ${i + 1} upload failed:`, portfolioData.error);
                            // Continue with other files even if one fails
                        }
                    }

                    // Add uploaded URLs to portfolio
                    const newPortfolioItems: CVPortfolioItem[] = uploadedUrls.map(url => ({ imageUrl: url }));
                    finalPortfolio = [...finalPortfolio, ...newPortfolioItems];
                    console.log(`✅ ${uploadedUrls.length}/${pendingPortfolio.length} portfolio images uploaded`);
                } catch (error) {
                    console.error("Portfolio upload error:", error);
                    alert("Portfolio fotoğrafları yüklenirken hata oluştu. Bazı fotoğraflar yüklenmemiş olabilir.");
                    // Don't return - continue with save even if some portfolio uploads failed
                } finally {
                    setUploadingPortfolio(false);
                }
            }

            // STEP 3: Prepare data for database save
            console.log('Portfolio before filter:', finalPortfolio);
            const filteredPortfolio = finalPortfolio.filter(item => item?.imageUrl);
            console.log('Portfolio after filter:', filteredPortfolio);

            // Normalize skills to ensure consistent CVSkill format
            const normalizedSkills = normalizeSkillsArray(skills);

            // Normalize languages to ensure consistent CVLanguage format
            const normalizedLanguages = normalizeLanguagesArray(languages);

            // STEP 4: Save to database
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
                    portfolio: filteredPortfolio,
                    skills: normalizedSkills,
                    languages: normalizedLanguages,
                    profilePhotoUrl: finalProfilePhotoUrl, // Use uploaded URL
                }),
            });

            const data = await response.json();

            if (response.ok) {
                // STEP 5: Clear pending state after successful save
                setPendingProfilePhoto(null);
                if (profilePhotoPreview) {
                    URL.revokeObjectURL(profilePhotoPreview); // Clean up object URL
                }
                setProfilePhotoPreview("");

                // Clear pending portfolio
                pendingPortfolio.forEach(item => {
                    URL.revokeObjectURL(item.preview);
                });
                setPendingPortfolio([]);

                // Clear deletion mark
                setPhotoMarkedForDeletion(false);
                setPortfolioMarkedForDeletion([]); // Clear portfolio deletion marks

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

    // Handle entering edit mode - backup current state
    const handleEdit = () => {
        originalStateRef.current = {
            name, jobTitle, email, phone, location,
            linkedinUrl, githubUrl, facebookUrl, instagramUrl, xUrl, websiteUrl,
            summary, experience, education, skills, languages,
            profilePhotoUrl, portfolio
        };
        setPhotoMarkedForDeletion(false); // Reset deletion mark
        setPortfolioMarkedForDeletion([]); // Reset portfolio deletion marks
        setIsEditing(true);
    };


    // Handle cancel - restore original state
    const handleCancel = () => {
        if (originalStateRef.current) {
            setName(originalStateRef.current.name);
            setJobTitle(originalStateRef.current.jobTitle);
            setEmail(originalStateRef.current.email);
            setPhone(originalStateRef.current.phone);
            setLocation(originalStateRef.current.location);
            setLinkedinUrl(originalStateRef.current.linkedinUrl);
            setGithubUrl(originalStateRef.current.githubUrl);
            setFacebookUrl(originalStateRef.current.facebookUrl);
            setInstagramUrl(originalStateRef.current.instagramUrl);
            setXUrl(originalStateRef.current.xUrl);
            setWebsiteUrl(originalStateRef.current.websiteUrl);
            setSummary(originalStateRef.current.summary);
            setExperience(originalStateRef.current.experience);
            setEducation(originalStateRef.current.education);
            setSkills(originalStateRef.current.skills);
            setLanguages(originalStateRef.current.languages);
            setProfilePhotoUrl(originalStateRef.current.profilePhotoUrl);
            setPortfolio(originalStateRef.current.portfolio);
        }

        // Clear pending uploads
        setPendingProfilePhoto(null);
        if (profilePhotoPreview) {
            URL.revokeObjectURL(profilePhotoPreview);
        }
        setProfilePhotoPreview("");

        // Clear pending portfolio
        pendingPortfolio.forEach(item => {
            URL.revokeObjectURL(item.preview);
        });
        setPendingPortfolio([]);

        // Clear deletion mark
        setPhotoMarkedForDeletion(false);
        setPortfolioMarkedForDeletion([]); // Clear portfolio deletion marks

        setIsEditing(false);
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
        setEducation([...education, { school: "", degree: "", field: "", year: "", gpa: "" }]);
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
        // Add new skill as CVSkill object with defaults
        setSkills([...skills, {
            name: "",
            level: "intermediate",
            percentage: 70,
            category: ""
        }]);
    };

    const removeSkill = (index: number) => {
        setSkills(skills.filter((_, i) => i !== index));
    };

    const updateSkill = (index: number, field: keyof CVSkill, value: any) => {
        const updated = [...skills];
        const currentSkill = updated[index];

        // Level to percentage mapping
        const levelPercentages: Record<CVSkill['level'] & string, number> = {
            'beginner': 40,
            'intermediate': 70,
            'advanced': 85,
            'expert': 95
        };

        // Convert string to CVSkill if needed
        if (typeof currentSkill === 'string') {
            updated[index] = {
                name: currentSkill,
                level: "intermediate",
                percentage: 70,
                category: ""
            };
        }

        // Update the field
        const updatedSkill = { ...(updated[index] as CVSkill), [field]: value };

        // If level changed, update percentage automatically
        if (field === 'level' && value) {
            updatedSkill.percentage = levelPercentages[value as CVSkill['level'] & string];
        }

        updated[index] = updatedSkill;
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

        // DEFERRED UPLOAD: Store file in memory, don't upload to Cloudflare yet
        setPendingProfilePhoto(file);
        setProfilePhotoPreview(URL.createObjectURL(file));

        // Show info message
        alert("Profil fotoğrafı seçildi. Değişiklikleri kaydetmeyi unutmayın!");
    };

    const handlePhotoDelete = async () => {
        // If there's a pending photo, just clear it from memory
        if (pendingProfilePhoto) {
            if (!confirm("Seçilen fotoğrafı kaldırmak istediğinizden emin misiniz?")) {
                return;
            }
            setPendingProfilePhoto(null);
            if (profilePhotoPreview) {
                URL.revokeObjectURL(profilePhotoPreview);
            }
            setProfilePhotoPreview("");
            return;
        }

        // If there's a saved photo, mark it for deletion (don't delete from Cloudflare yet)
        if (!profilePhotoUrl) return;

        if (!confirm("Profil fotoğrafını silmek istediğinizden emin misiniz?")) {
            return;
        }

        // Mark for deletion instead of deleting immediately
        // Actual deletion will happen on save
        setPhotoMarkedForDeletion(true);
        setProfilePhotoUrl(""); // Clear from UI
    };

    const addLanguage = () => {
        // Add new language as CVLanguage object with defaults
        setLanguages([...languages, {
            name: "",
            level: "intermediate",
            percentage: 60,
            certifications: undefined,
            cefr: undefined
        }]);
    };

    const removeLanguage = (index: number) => {
        setLanguages(languages.filter((_, i) => i !== index));
    };

    const updateLanguage = (index: number, field: keyof CVLanguage, value: any) => {
        const updated = [...languages];
        const currentLang = updated[index];

        // Level to percentage mapping
        const levelPercentages: Record<CVLanguage['level'] & string, number> = {
            'native': 100,
            'fluent': 90,
            'advanced': 75,
            'intermediate': 60,
            'basic': 40
        };

        // Convert string to CVLanguage if needed
        if (typeof currentLang === 'string') {
            updated[index] = {
                name: currentLang,
                level: "intermediate",
                percentage: 60,
                certifications: undefined,
                cefr: undefined
            };
        }

        // Update the field
        const updatedLang = { ...(updated[index] as CVLanguage), [field]: value };

        // If level changed, update percentage automatically
        if (field === 'level' && value) {
            updatedLang.percentage = levelPercentages[value as CVLanguage['level'] & string];
        }

        updated[index] = updatedLang;
        setLanguages(updated);
    };

    const addCertification = (langIndex: number) => {
        const updated = [...languages];
        const lang = updated[langIndex] as CVLanguage;
        const certs = lang.certifications || [];
        lang.certifications = [...certs, ""];
        setLanguages(updated);
    };

    const removeCertification = (langIndex: number, certIndex: number) => {
        const updated = [...languages];
        const lang = updated[langIndex] as CVLanguage;
        if (lang.certifications) {
            lang.certifications = lang.certifications.filter((_, i) => i !== certIndex);
        }
        setLanguages(updated);
    };

    const updateCertification = (langIndex: number, certIndex: number, value: string) => {
        const updated = [...languages];
        const lang = updated[langIndex] as CVLanguage;
        if (lang.certifications) {
            lang.certifications[certIndex] = value;
        }
        setLanguages(updated);
    };

    // DEFERRED UPLOAD: Store files in memory instead of uploading immediately
    const handlePortfolioFilesSelected = useCallback((files: File[]) => {
        console.log('handlePortfolioFilesSelected called with files:', files);

        // Create preview URLs for the files
        const newPendingItems = files.map(file => ({
            file,
            preview: URL.createObjectURL(file)
        }));

        setPendingPortfolio(prev => [...prev, ...newPendingItems]);
        console.log('Added to pending portfolio:', newPendingItems.length, 'files');
    }, []);

    const handlePortfolioMetadataSave = (index: number, updatedItem: CVPortfolioItem) => {
        const updated = [...portfolio];
        updated[index] = updatedItem;
        setPortfolio(updated);
        setEditingPortfolioIndex(null);
    };

    const handlePortfolioDelete = (imageUrl: string, index: number) => {
        if (!confirm("Bu portfolio fotoğrafını silmek istediğinizden emin misiniz?")) {
            return;
        }

        // DEFERRED DELETION: Mark for deletion instead of deleting immediately
        // Actual deletion will happen on save
        setPortfolioMarkedForDeletion(prev => [...prev, imageUrl]);

        // Remove from UI state immediately (for visual feedback)
        setPortfolio(portfolio.filter((_, i) => i !== index));

        // Show info message
        alert("Portfolio fotoğrafı kaldırıldı. Değişiklikleri kaydetmeyi unutmayın!");
    };


    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-white mb-2">Bilgilerim</h2>
                <p className="text-gray-400">
                    CV'nizi yükleyin veya mevcut CV bilgilerinizi görüntüleyin/düzenleyin
                </p>
            </div>

            {/* Storage Indicator - Always show at top */}
            <StorageIndicator key={storageRefreshKey} />

            {/* Unpublished Changes Warning - Only show when site is published and has changes */}
            {site && site.status === "published" && hasUnpublishedChanges(site) && (
                <div className="bg-yellow-900/30 border border-yellow-700 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                        <svg className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <div className="flex-1">
                            <p className="text-yellow-300 font-semibold mb-1">
                                ⚠️ Yayınlanan site son değişiklikleri içermiyor
                            </p>
                            <p className="text-yellow-200 text-sm mb-3">
                                Yayınlanan sitenizi güncellemek için aşağıdaki butona tıklayın.
                            </p>
                            <button
                                onClick={async () => {
                                    if (!confirm("Sitenizi yeniden yayınlamak istediğinizden emin misiniz?")) return;
                                    setPublishing(true);
                                    try {
                                        const response = await fetch("/api/site/publish", {
                                            method: "POST",
                                            headers: { "Content-Type": "application/json" },
                                            body: JSON.stringify({ siteId: site.id }),
                                        });
                                        const data = await response.json();
                                        if (response.ok) {
                                            alert(`Site başarıyla yeniden yayınlandı!\nURL: ${data.cloudflareUrl}`);
                                            window.location.reload();
                                        } else {
                                            alert(data.error || "Site yayınlanamadı");
                                        }
                                    } catch (error) {
                                        console.error("Yayınlama hatası:", error);
                                        alert("Bir hata oluştu. Lütfen tekrar deneyin.");
                                    } finally {
                                        setPublishing(false);
                                    }
                                }}
                                disabled={publishing}
                                className="bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 text-sm"
                            >
                                {publishing ? "Yayınlanıyor..." : "Yeniden Yayınla"}
                            </button>

                            {/* Change Details Panel */}
                            <ChangeDetailsPanel site={site} />
                        </div>
                    </div>
                </div>
            )}

            {/* Published Site Warning */}
            {site && site.status === "published" && isEditing && !hasUnpublishedChanges(site) && (
                <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div className="flex-1">
                            <p className="text-blue-300 text-sm">
                                <strong>💡 Not:</strong> Bu değişiklikler önizleme sitenize yansıyacak. Yayınlanan sitenizi güncellemek için <strong>"Sitem"</strong> sekmesinden <strong>"Yeniden Yayınla"</strong> butonuna tıklayın.
                            </p>
                        </div>
                    </div>
                </div>
            )}



            {!site || !cvData ? (
                <CVUploader onAnalyzed={onCVAnalyzed} />
            ) : (
                <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-white">CV'im</h3>
                        <div className="flex gap-2">
                            {!isEditing ? (
                                <button
                                    onClick={handleEdit}
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
                                        onClick={handleCancel}
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
                                    {/* Show preview if pending photo exists, otherwise show saved photo (unless marked for deletion) */}
                                    {profilePhotoPreview || (!photoMarkedForDeletion && profilePhotoUrl) ? (
                                        <img
                                            src={profilePhotoPreview || profilePhotoUrl}
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
                                            <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${uploadingPhoto
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
                                        {/* Show delete button if there's a saved photo (not marked for deletion) OR a pending photo */}
                                        {((profilePhotoUrl && !photoMarkedForDeletion) || pendingProfilePhoto) && !uploadingPhoto && (
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
                                                <input
                                                    type="text"
                                                    placeholder="GPA (opsiyonel, ör: 3.8/4.0, 85/100)"
                                                    value={edu.gpa || ""}
                                                    onChange={(e) => updateEducation(index, "gpa", e.target.value)}
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
                                                    {edu.gpa && <span className="ml-2 text-green-400">• GPA: {edu.gpa}</span>}
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
                                    Portfolio ({portfolio.length}/10)
                                </h4>
                            </div>

                            {/* Portfolio Uploader - Only show in edit mode */}
                            {isEditing && (
                                <div className="mb-4">
                                    <PortfolioUploader
                                        currentCount={portfolio.length + pendingPortfolio.length}
                                        maxCount={10}
                                        onFilesSelected={handlePortfolioFilesSelected}
                                        deferredMode={true}
                                        disabled={uploadingPortfolio}
                                        existingFiles={portfolio
                                            .filter(item => item?.imageUrl)
                                            .map(item => ({
                                                fileName: item.imageUrl.split('/').pop() || '',
                                                fileSize: 0 // We don't have size info, but name check is still useful
                                            }))}
                                    />
                                </div>
                            )}

                            {/* Portfolio Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {/* Show saved portfolio items */}
                                {portfolio.map((item, index) => (
                                    <div key={index} className="relative group aspect-square rounded-lg overflow-hidden bg-gray-600">
                                        <img
                                            src={item.imageUrl}
                                            alt={item.title || `Portfolio ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />

                                        {/* Metadata Overlay */}
                                        {(item.title || item.category) && (
                                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                                                {item.title && (
                                                    <p className="text-white text-xs font-semibold truncate">{item.title}</p>
                                                )}
                                                {item.category && (
                                                    <p className="text-gray-300 text-xs truncate">{item.category}</p>
                                                )}
                                            </div>
                                        )}

                                        {/* Action Buttons */}
                                        {isEditing && !uploadingPortfolio && (
                                            <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => setEditingPortfolioIndex(index)}
                                                    className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full"
                                                    title="Detayları düzenle"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => handlePortfolioDelete(item.imageUrl, index)}
                                                    className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-full"
                                                    title="Sil"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}

                                {/* Show pending portfolio items (previews) */}
                                {pendingPortfolio.map((item, index) => (
                                    <div key={`pending-${index}`} className="relative group aspect-square rounded-lg overflow-hidden bg-gray-600 border-2 border-yellow-500">
                                        <img
                                            src={item.preview}
                                            alt={`Pending ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />

                                        {/* Pending indicator */}
                                        <div className="absolute top-2 left-2 bg-yellow-500 text-black text-xs px-2 py-1 rounded font-semibold">
                                            Kaydedilmedi
                                        </div>

                                        {/* Delete button for pending items */}
                                        {isEditing && (
                                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => {
                                                        // Remove from pending
                                                        URL.revokeObjectURL(item.preview);
                                                        setPendingPortfolio(prev => prev.filter((_, i) => i !== index));
                                                    }}
                                                    className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition-colors"
                                                    title="Kaldır"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}

                                {portfolio.length === 0 && pendingPortfolio.length === 0 && (
                                    <div className="col-span-2 md:grid-cols-3 text-center py-8">
                                        <p className="text-gray-400 text-sm">Henüz portfolio fotoğrafı eklenmemiş</p>
                                        {isEditing && (
                                            <p className="text-gray-500 text-xs mt-2">Maksimum 10 adet fotoğraf ekleyebilirsiniz</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Portfolio Metadata Editor Modal */}
                        {editingPortfolioIndex !== null && (
                            <PortfolioMetadataEditor
                                item={portfolio[editingPortfolioIndex]}
                                index={editingPortfolioIndex}
                                onSave={handlePortfolioMetadataSave}
                                onCancel={() => setEditingPortfolioIndex(null)}
                            />
                        )}

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
                                    {skills.map((skill, index) => {
                                        const skillObj = typeof skill === 'string'
                                            ? { name: skill, level: 'intermediate' as const, percentage: 70, category: '' }
                                            : skill;

                                        return (
                                            <div key={index} className="bg-gray-600/30 rounded p-3 space-y-2">
                                                {/* Row 1: Name and Level */}
                                                <div className="flex gap-2 items-center">
                                                    <input
                                                        type="text"
                                                        value={skillObj.name}
                                                        onChange={(e) => updateSkill(index, 'name', e.target.value)}
                                                        placeholder="Yetenek adı"
                                                        className="flex-1 px-2 py-1.5 bg-gray-700 border border-gray-600 text-white rounded text-sm focus:ring-1 focus:ring-blue-500"
                                                    />
                                                    <select
                                                        value={skillObj.level || 'intermediate'}
                                                        onChange={(e) => updateSkill(index, 'level', e.target.value as CVSkill['level'])}
                                                        className="px-2 py-1.5 bg-gray-700 border border-gray-600 text-white rounded text-sm focus:ring-1 focus:ring-blue-500"
                                                    >
                                                        <option value="beginner">Başlangıç</option>
                                                        <option value="intermediate">Orta</option>
                                                        <option value="advanced">İleri</option>
                                                        <option value="expert">Uzman</option>
                                                    </select>
                                                    <button
                                                        onClick={() => removeSkill(index)}
                                                        className="px-2 py-1.5 text-red-400 hover:text-red-300 text-sm"
                                                        title="Sil"
                                                    >
                                                        ✕
                                                    </button>
                                                </div>

                                                {/* Row 2: Category */}
                                                <div>
                                                    <input
                                                        type="text"
                                                        value={skillObj.category || ''}
                                                        onChange={(e) => updateSkill(index, 'category', e.target.value)}
                                                        placeholder="Kategori (örn: Frontend, Backend, Tools)"
                                                        className="w-full px-2 py-1.5 bg-gray-700 border border-gray-600 text-white rounded text-sm focus:ring-1 focus:ring-blue-500 placeholder-gray-500"
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                    {skills.length === 0 && <p className="text-gray-400 text-sm">Yetenek ekleyin</p>}
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {skills.map((skill, index) => {
                                        const skillObj = typeof skill === 'string'
                                            ? { name: skill, level: 'intermediate' as const, percentage: 70, category: '' }
                                            : skill;

                                        // Level to percentage mapping for display
                                        const levelPercentages: Record<string, number> = {
                                            'beginner': 40,
                                            'intermediate': 70,
                                            'advanced': 85,
                                            'expert': 95
                                        };

                                        const displayPercentage = skillObj.percentage || levelPercentages[skillObj.level || 'intermediate'];

                                        return (
                                            <div key={index} className="bg-gray-600/30 rounded-lg p-3">
                                                <div className="flex items-start gap-3">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="font-medium text-white">{skillObj.name}</span>
                                                            {skillObj.category && (
                                                                <span className="px-2 py-0.5 text-xs bg-blue-600/30 text-blue-300 rounded-full">
                                                                    {skillObj.category}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-3 text-sm text-gray-400">
                                                            <span className="capitalize">{skillObj.level || 'intermediate'}</span>
                                                            <span>•</span>
                                                            <span>{displayPercentage}%</span>
                                                        </div>
                                                        {/* Progress bar */}
                                                        <div className="mt-2 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                                                            <div
                                                                className="h-full bg-blue-500 rounded-full transition-all"
                                                                style={{ width: `${displayPercentage}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    {skills.length === 0 && <p className="text-gray-400 text-sm">Henüz yetenek eklenmemiş</p>}
                                </div>
                            )}
                        </div>

                        {/* Languages */}
                        <div className="bg-gray-700/50 rounded-lg p-4">
                            <div className="flex justify-between items-center mb-3">
                                <h4 className="text-lg font-semibold text-white">
                                    Diller ({languages.length})
                                </h4>
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
                                <div className="space-y-4">
                                    {languages.map((lang, index) => {
                                        const langObj = typeof lang === 'string'
                                            ? { name: lang, level: 'intermediate' as const, percentage: 60, certifications: undefined, cefr: undefined }
                                            : lang;

                                        return (
                                            <div key={index} className="bg-gray-600/30 rounded-lg p-3 space-y-2">
                                                {/* Row 1: Name, Level, and Delete */}
                                                <div className="flex gap-2 items-center">
                                                    <input
                                                        type="text"
                                                        value={langObj.name}
                                                        onChange={(e) => updateLanguage(index, 'name', e.target.value)}
                                                        placeholder="Dil adı (örn: İngilizce)"
                                                        className="flex-1 px-2 py-1.5 bg-gray-700 border border-gray-600 text-white rounded text-sm focus:ring-1 focus:ring-blue-500"
                                                    />
                                                    <select
                                                        value={langObj.level || 'intermediate'}
                                                        onChange={(e) => updateLanguage(index, 'level', e.target.value as CVLanguage['level'])}
                                                        className="px-2 py-1.5 bg-gray-700 border border-gray-600 text-white rounded text-sm focus:ring-1 focus:ring-blue-500"
                                                    >
                                                        <option value="native">Ana Dil</option>
                                                        <option value="fluent">Akıcı</option>
                                                        <option value="advanced">İleri</option>
                                                        <option value="intermediate">Orta</option>
                                                        <option value="basic">Başlangıç</option>
                                                    </select>
                                                    <button
                                                        onClick={() => removeLanguage(index)}
                                                        className="px-2 py-1.5 text-red-400 hover:text-red-300 text-sm"
                                                        title="Sil"
                                                    >
                                                        ✕
                                                    </button>
                                                </div>

                                                {/* Row 2: CEFR Level */}
                                                <div>
                                                    <select
                                                        value={langObj.cefr || ''}
                                                        onChange={(e) => updateLanguage(index, 'cefr', e.target.value || undefined)}
                                                        className="w-full px-2 py-1.5 bg-gray-700 border border-gray-600 text-white rounded text-sm focus:ring-1 focus:ring-blue-500"
                                                    >
                                                        <option value="">CEFR Seviyesi (Opsiyonel)</option>
                                                        <option value="A1">A1 - Başlangıç</option>
                                                        <option value="A2">A2 - Temel</option>
                                                        <option value="B1">B1 - Orta Seviye</option>
                                                        <option value="B2">B2 - Orta-İleri Seviye</option>
                                                        <option value="C1">C1 - İleri Seviye</option>
                                                        <option value="C2">C2 - Üst Düzey</option>
                                                    </select>
                                                </div>

                                                {/* Row 3: Certifications */}
                                                <div>
                                                    <div className="flex items-center justify-between mb-1">
                                                        <label className="text-xs text-gray-400">Sertifikalar (Opsiyonel)</label>
                                                        <button
                                                            onClick={() => addCertification(index)}
                                                            className="text-xs text-blue-400 hover:text-blue-300"
                                                        >
                                                            + Sertifika Ekle
                                                        </button>
                                                    </div>
                                                    {langObj.certifications && langObj.certifications.length > 0 && (
                                                        <div className="space-y-1">
                                                            {langObj.certifications.map((cert, certIndex) => (
                                                                <div key={certIndex} className="flex gap-1">
                                                                    <input
                                                                        type="text"
                                                                        value={cert}
                                                                        onChange={(e) => updateCertification(index, certIndex, e.target.value)}
                                                                        placeholder="örn: TOEFL 110/120, IELTS 8.5"
                                                                        className="flex-1 px-2 py-1 bg-gray-700 border border-gray-600 text-white rounded text-xs focus:ring-1 focus:ring-blue-500 placeholder-gray-500"
                                                                    />
                                                                    <button
                                                                        onClick={() => removeCertification(index, certIndex)}
                                                                        className="px-2 text-red-400 hover:text-red-300 text-xs"
                                                                    >
                                                                        ✕
                                                                    </button>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                    {languages.length === 0 && <p className="text-gray-400 text-sm">Dil ekleyin</p>}
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {languages.map((lang, index) => {
                                        const langObj = typeof lang === 'string'
                                            ? { name: lang, level: 'intermediate' as const, percentage: 60, certifications: undefined, cefr: undefined }
                                            : lang;

                                        return (
                                            <div key={index} className="bg-gray-600/30 rounded-lg p-3">
                                                <div className="flex items-start gap-3">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="font-medium text-white">{langObj.name}</span>
                                                            {langObj.cefr && (
                                                                <span className="px-2 py-0.5 text-xs bg-purple-600/30 text-purple-300 rounded-full">
                                                                    CEFR: {langObj.cefr}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-3 text-sm text-gray-400">
                                                            <span className="capitalize">{langObj.level || 'intermediate'}</span>
                                                        </div>
                                                        {langObj.certifications && langObj.certifications.length > 0 && (
                                                            <div className="mt-2 flex flex-wrap gap-1">
                                                                {langObj.certifications.map((cert, certIndex) => (
                                                                    <span key={certIndex} className="px-2 py-0.5 text-xs bg-green-600/30 text-green-300 rounded">
                                                                        🏆 {cert}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
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
