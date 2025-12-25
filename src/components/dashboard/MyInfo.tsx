"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import CVUploader from "@/components/CVUploader";
import type { CVData, CVPortfolioItem, CVSkill, CVLanguage } from "@/lib/gemini-pdf-parser";
import { hasUnpublishedChanges } from "@/lib/change-detection";
import PortfolioUploader from "@/components/dashboard/PortfolioUploader";
import PortfolioMetadataEditor from "@/components/dashboard/PortfolioMetadataEditor";

import ChangeDetailsPanel from "./ChangeDetailsPanel";
import { toast } from "@/components/ui/Toast";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

/**
 * R2 URL'lerini proxy URL'e çevirir (SSL hatalarını önlemek için)
 * Tarayıcı R2'ye doğrudan erişemeyebilir, bu yüzden server-side proxy kullanıyoruz
 */
function getProxiedImageUrl(url: string): string {
    if (!url) return url;
    // Zaten proxy URL ise veya blob URL ise dokunma
    if (url.startsWith('/api/') || url.startsWith('blob:')) return url;
    // R2 URL ise proxy'e yönlendir
    if (url.includes('.r2.dev')) {
        return `/api/proxy-image?url=${encodeURIComponent(url)}`;
    }
    return url;
}

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

    // Section refs for scroll-to navigation
    const personalInfoRef = useRef<HTMLDivElement>(null);
    const experienceRef = useRef<HTMLDivElement>(null);
    const educationRef = useRef<HTMLDivElement>(null);
    const portfolioRef = useRef<HTMLDivElement>(null);
    const skillsRef = useRef<HTMLDivElement>(null);
    const languagesRef = useRef<HTMLDivElement>(null);

    const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
        ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

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

    // Confirm dialog state
    const [confirmDialog, setConfirmDialog] = useState<{
        isOpen: boolean;
        type: "deletePendingPhoto" | "deleteSavedPhoto" | "deletePortfolio" | "republish" | "rollback" | null;
        portfolioIndex?: number;
    }>({ isOpen: false, type: null });

    // Deferred upload state - files held in memory until save
    const [pendingProfilePhoto, setPendingProfilePhoto] = useState<File | null>(null);
    const [profilePhotoPreview, setProfilePhotoPreview] = useState<string>("");
    const [pendingPortfolio, setPendingPortfolio] = useState<Array<{ file: File; preview: string }>>([]);

    // Deferred deletion state - mark for deletion, actual delete happens on save
    const [photoMarkedForDeletion, setPhotoMarkedForDeletion] = useState(false);
    const [portfolioMarkedForDeletion, setPortfolioMarkedForDeletion] = useState<string[]>([]); // Array of imageUrls to delete





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

    // URL'lerin baÅŸÄ±na https:// ekleyen yardÄ±mcÄ± fonksiyon
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
                        console.log("Profile photo deleted from Cloudflare");
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
                        console.log("âœ… Profile photo uploaded:", finalProfilePhotoUrl);

                        // Delete old photo from Cloudflare if it exists
                        if (originalStateRef.current?.profilePhotoUrl) {
                            try {
                                const deleteResponse = await fetch(`/api/upload/profile-photo?url=${encodeURIComponent(originalStateRef.current.profilePhotoUrl)}`, {
                                    method: "DELETE",
                                });

                                if (deleteResponse.ok) {
                                    console.log("âœ… Old profile photo deleted from Cloudflare");
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
                    toast.error("Profil fotoğrafı yüklenirken hata oluştu: " + (error instanceof Error ? error.message : "Bilinmeyen hata"));
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
                                console.log("âœ… Portfolio image deleted from Cloudflare:", imageUrl);
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
                                console.log(`âœ… Portfolio image ${i + 1}/${pendingPortfolio.length} uploaded:`, url);
                            }
                        } else {
                            console.error(`Portfolio image ${i + 1} upload failed:`, portfolioData.error);
                            // Continue with other files even if one fails
                        }
                    }

                    // Add uploaded URLs to portfolio
                    const newPortfolioItems: CVPortfolioItem[] = uploadedUrls.map(url => ({ imageUrl: url }));
                    finalPortfolio = [...finalPortfolio, ...newPortfolioItems];
                    console.log(`âœ… ${uploadedUrls.length}/${pendingPortfolio.length} portfolio images uploaded`);
                } catch (error) {
                    console.error("Portfolio upload error:", error);
                    toast.error("Portfolio fotoğrafları yüklenirken hata oluştu. Bazı fotoğraflar yüklenmemiş olabilir.");
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

                toast.success("Bilgileriniz başarıyla kaydedildi!");
                setIsEditing(false);

                window.location.reload(); // Refresh to show updated data
            } else {
                toast.error(data.error || "Bilgiler kaydedilemedi");
            }
        } catch (error) {
            console.error("Error saving info:", error);
            toast.error("Bir hata oluştu");
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
            toast.error("Sadece JPEG, PNG ve WebP formatları desteklenmektedir");
            return;
        }

        // Validate file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error("Dosya boyutu 5MB'dan küçük olmalıdır");
            return;
        }

        // DEFERRED UPLOAD: Store file in memory, don't upload to Cloudflare yet
        setPendingProfilePhoto(file);
        setProfilePhotoPreview(URL.createObjectURL(file));

        // Show info message
        toast.info("Profil fotoğrafı seçildi. Değişiklikleri kaydetmeyi unutmayın!");
    };

    const handlePhotoDelete = async () => {
        // If there's a pending photo, just clear it from memory
        if (pendingProfilePhoto) {
            setConfirmDialog({ isOpen: true, type: "deletePendingPhoto" });
            return;
        }

        // If there's a saved photo, mark it for deletion (don't delete from Cloudflare yet)
        if (!profilePhotoUrl) return;
        setConfirmDialog({ isOpen: true, type: "deleteSavedPhoto" });
    };

    const executeDeletePendingPhoto = () => {
        setPendingProfilePhoto(null);
        if (profilePhotoPreview) {
            URL.revokeObjectURL(profilePhotoPreview);
        }
        setProfilePhotoPreview("");
    };

    const executeDeleteSavedPhoto = () => {
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
        setConfirmDialog({ isOpen: true, type: "deletePortfolio", portfolioIndex: index });
    };

    const executeDeletePortfolio = (index: number) => {
        const imageUrl = portfolio[index]?.imageUrl;
        if (!imageUrl) return;

        // DEFERRED DELETION: Mark for deletion instead of deleting immediately
        // Actual deletion will happen on save
        setPortfolioMarkedForDeletion(prev => [...prev, imageUrl]);

        // Remove from UI state immediately (for visual feedback)
        setPortfolio(portfolio.filter((_, i) => i !== index));

        // Show info message
        toast.info("Portfolio fotoğrafı kaldırıldı. Değişiklikleri kaydetmeyi unutmayın!");
    };

    const handleRepublish = () => {
        setConfirmDialog({ isOpen: true, type: "republish" });
    };

    const executeRepublish = async () => {
        setPublishing(true);
        try {
            const response = await fetch("/api/site/publish", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ siteId: site.id }),
            });
            const data = await response.json();
            if (response.ok) {
                toast.success(`Site başarıyla yeniden yayındırıldı!`, {
                    description: data.cloudflareUrl
                });
                window.location.reload();
            } else {
                toast.error(data.error || "Site yayındırılamadı");
            }
        } catch (error) {
            console.error("Yayınlama hatası:", error);
            toast.error("Bir hata oluştu. Lütfen tekrar deneyin.");
        } finally {
            setPublishing(false);
        }
    };

    const handleRollback = () => {
        setConfirmDialog({ isOpen: true, type: "rollback" });
    };

    const executeRollback = async () => {
        try {
            const response = await fetch("/api/site/rollback", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ siteId: site.id }),
            });
            const data = await response.json();
            if (response.ok) {
                toast.success("Değişiklikler başarıyla geri alındı!");
                window.location.reload();
            } else {
                toast.error(data.error || "Geri alma işlemi başarısız oldu");
            }
        } catch (error) {
            console.error("Rollback hatası:", error);
            toast.error("Bir hata oluştu. Lütfen tekrar deneyin.");
        }
    };

    const handleConfirmAction = async () => {
        switch (confirmDialog.type) {
            case "deletePendingPhoto":
                executeDeletePendingPhoto();
                break;
            case "deleteSavedPhoto":
                executeDeleteSavedPhoto();
                break;
            case "deletePortfolio":
                if (confirmDialog.portfolioIndex !== undefined) {
                    executeDeletePortfolio(confirmDialog.portfolioIndex);
                }
                break;
            case "republish":
                await executeRepublish();
                break;
            case "rollback":
                await executeRollback();
                break;
        }
        setConfirmDialog({ isOpen: false, type: null });
    };

    return (
        <>
            {/* Page Header - Outside flex container */}
            <div className="mb-6">
                <h2 className="text-3xl font-bold text-white mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">Bilgilerim</h2>
                <p className="text-gray-400">
                    CV'nizi yükleyin veya mevcut CV bilgilerinizi görüntüleyin/düzenleyin
                </p>
            </div>

            {/* Main 2-column layout: Content (scroll) + Navigation Sidebar */}
            <div className="flex gap-6 items-start">
                {/* Left: Scrollable Content Area */}
                <div className="flex-1 space-y-6">

                    {/* Unpublished Changes Warning */}
                    {site && site.status === "published" && hasUnpublishedChanges(site) && (
                        <div className="bg-yellow-900/20 backdrop-blur-sm border border-yellow-500/30 rounded-2xl p-4">
                            <div className="flex items-start gap-3">
                                <svg className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                <div className="flex-1">
                                    <p className="text-yellow-300 font-semibold mb-1">Yayınlanan site son değişiklikleri içeriyor</p>
                                    <p className="text-yellow-200 text-sm mb-3">Yayınlanan sitenizi güncellemek veya değişiklikleri geri almak için aşağıdaki butonları kullanın.</p>
                                    <div className="flex gap-2">
                                        <button onClick={handleRepublish} disabled={publishing} className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 disabled:from-gray-500 disabled:to-gray-600 text-white font-semibold py-2 px-4 rounded-xl transition-all text-sm">
                                            {publishing ? "Yayınlanıyor..." : "Yeniden Yayınla"}
                                        </button>
                                        <button onClick={handleRollback} className="bg-white/10 hover:bg-white/20 text-white font-semibold py-2 px-4 rounded-xl transition-all text-sm border border-white/10">
                                            Geri Dön
                                        </button>
                                    </div>
                                    <ChangeDetailsPanel site={site} />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Published Site Edit Warning */}
                    {site && site.status === "published" && isEditing && !hasUnpublishedChanges(site) && (
                        <div className="bg-blue-900/20 backdrop-blur-sm border border-blue-500/30 rounded-2xl p-4">
                            <div className="flex items-start gap-3">
                                <svg className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="text-blue-300 text-sm">
                                    <strong>Not:</strong> Bu değişiklikler önizleme sitenize yansıyacak. Yayınlanan sitenizi güncellemek için <strong>"Sitem"</strong> sekmesinden <strong>"Yeniden Yayınla"</strong> butonuna tıklayınız.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* CV Content */}
                    {!site || !cvData ? (
                        <CVUploader onAnalyzed={onCVAnalyzed} />
                    ) : (
                        <div className="space-y-6">
                            {/* Profile Photo Card */}
                            <div className="bg-[#111]/80 backdrop-blur-sm rounded-2xl border border-white/10 p-6 hover:border-purple-500/30 transition-all">
                                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500"></span>
                                    Profil Fotoğrafı
                                </h3>
                                <div className="flex flex-col items-center">
                                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center mb-4 overflow-hidden border-4 border-white/10">
                                        {profilePhotoPreview || (!photoMarkedForDeletion && profilePhotoUrl) ? (
                                            <img src={profilePhotoPreview || getProxiedImageUrl(profilePhotoUrl)} alt="Profile" className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-4xl text-gray-400 font-semibold">
                                                {name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '?'}
                                            </span>
                                        )}
                                    </div>
                                    {isEditing && (
                                        <div className="flex gap-2">
                                            <label className="cursor-pointer">
                                                <input type="file" accept="image/jpeg,image/jpg,image/png,image/webp" onChange={handlePhotoUpload} disabled={uploadingPhoto} className="hidden" />
                                                <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${uploadingPhoto ? 'bg-gray-600 text-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white'}`}>
                                                    {uploadingPhoto ? (
                                                        <><svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Yükleniyor...</>
                                                    ) : (
                                                        <>Fotoğraf Ekle</>
                                                    )}
                                                </span>
                                            </label>
                                            {((profilePhotoUrl && !photoMarkedForDeletion) || pendingProfilePhoto) && !uploadingPhoto && (
                                                <button onClick={handlePhotoDelete} className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl text-sm font-medium transition-all border border-red-500/30">
                                                    Sil
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Personal Info Card */}
                            <div ref={personalInfoRef} className="bg-[#111]/80 backdrop-blur-sm rounded-2xl border border-white/10 p-6 hover:border-purple-500/30 transition-all">
                                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500"></span>
                                    Kişisel Bilgiler
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-1">Ad Soyad</label>
                                        {isEditing ? (
                                            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all" />
                                        ) : (
                                            <p className="text-white py-2">{name || "-"}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-1">Ünvan</label>
                                        {isEditing ? (
                                            <input type="text" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all" />
                                        ) : (
                                            <p className="text-white py-2">{jobTitle || "-"}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                                        {isEditing ? (
                                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all" />
                                        ) : (
                                            <p className="text-white py-2">{email || "-"}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-1">Telefon</label>
                                        {isEditing ? (
                                            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all" />
                                        ) : (
                                            <p className="text-white py-2">{phone || "-"}</p>
                                        )}
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-400 mb-1">Konum</label>
                                        {isEditing ? (
                                            <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all" />
                                        ) : (
                                            <p className="text-white py-2">{location || "-"}</p>
                                        )}
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-400 mb-1">Özet</label>
                                        {isEditing ? (
                                            <textarea value={summary} onChange={(e) => setSummary(e.target.value)} rows={5} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none" />
                                        ) : (
                                            <p className="text-gray-300 py-2">{summary || "-"}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Social Media Card */}
                            <div className="bg-[#111]/80 backdrop-blur-sm rounded-2xl border border-white/10 p-6 hover:border-purple-500/30 transition-all">
                                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500"></span>
                                    Sosyal Medya
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {[
                                        { label: "LinkedIn URL", value: linkedinUrl, setter: setLinkedinUrl, placeholder: "https://linkedin.com/in/kullaniciadi" },
                                        { label: "GitHub URL", value: githubUrl, setter: setGithubUrl, placeholder: "https://github.com/kullaniciadi" },
                                        { label: "Facebook URL", value: facebookUrl, setter: setFacebookUrl, placeholder: "https://facebook.com/kullaniciadi" },
                                        { label: "Instagram URL", value: instagramUrl, setter: setInstagramUrl, placeholder: "https://instagram.com/kullaniciadi" },
                                        { label: "X (Twitter) URL", value: xUrl, setter: setXUrl, placeholder: "https://x.com/kullaniciadi" },
                                        { label: "Web Site URL", value: websiteUrl, setter: setWebsiteUrl, placeholder: "https://www.websitesi.com" },
                                    ].map((field, idx) => (
                                        <div key={idx}>
                                            <label className="block text-sm font-medium text-gray-400 mb-1">{field.label}</label>
                                            {isEditing ? (
                                                <input type="url" value={field.value} onChange={(e) => field.setter(e.target.value)} placeholder={field.placeholder} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all placeholder-gray-600" />
                                            ) : (
                                                <p className="text-white py-2 truncate">{field.value || "-"}</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Experience Card */}
                            {/* Experience Card */}
                            <div ref={experienceRef} className="bg-[#111]/80 backdrop-blur-sm rounded-2xl border border-white/10 p-6 hover:border-purple-500/30 transition-all">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500"></span>
                                        Deneyimler ({experience.length})
                                    </h3>
                                    {isEditing && (
                                        <button onClick={addExperience} className="px-3 py-1.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white text-sm rounded-xl transition-all">
                                            + Ekle
                                        </button>
                                    )}
                                </div>
                                <div className="space-y-3">
                                    {experience.map((exp, index) => (
                                        <div key={index} className="bg-white/5 rounded-xl p-4 border border-white/5">
                                            {isEditing ? (
                                                <div className="space-y-2">
                                                    <div className="flex justify-end">
                                                        <button onClick={() => removeExperience(index)} className="text-red-400 hover:text-red-300 text-sm">Sil</button>
                                                    </div>
                                                    <input type="text" placeholder="Pozisyon" value={exp.position || ""} onChange={(e) => updateExperience(index, "position", e.target.value)} className="w-full px-3 py-2 bg-white/5 border border-white/10 text-white rounded-xl text-sm focus:ring-2 focus:ring-purple-500" />
                                                    <input type="text" placeholder="Şirket" value={exp.company || ""} onChange={(e) => updateExperience(index, "company", e.target.value)} className="w-full px-3 py-2 bg-white/5 border border-white/10 text-white rounded-xl text-sm focus:ring-2 focus:ring-purple-500" />
                                                    <input type="text" placeholder="Süre (ör: 2020-2022)" value={exp.duration || ""} onChange={(e) => updateExperience(index, "duration", e.target.value)} className="w-full px-3 py-2 bg-white/5 border border-white/10 text-white rounded-xl text-sm focus:ring-2 focus:ring-purple-500" />
                                                    <textarea placeholder="Açıklama (opsiyonel)" value={exp.description || ""} onChange={(e) => updateExperience(index, "description", e.target.value)} rows={2} className="w-full px-3 py-2 bg-white/5 border border-white/10 text-white rounded-xl text-sm resize-none focus:ring-2 focus:ring-purple-500" />
                                                </div>
                                            ) : (
                                                <div className="text-sm">
                                                    <p className="font-medium text-white">{exp.position} - {exp.company}</p>
                                                    <p className="text-gray-400">{exp.duration}</p>
                                                    {exp.description && <p className="text-gray-300 mt-1">{exp.description}</p>}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                    {experience.length === 0 && <p className="text-gray-400 text-sm">Henüz i̇ş deneyimi eklenmemiş</p>}
                                </div>
                            </div>

                            {/* Education Card */}
                            <div ref={educationRef} className="bg-[#111]/80 backdrop-blur-sm rounded-2xl border border-white/10 p-6 hover:border-purple-500/30 transition-all">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500"></span>
                                        Eğitim ({education.length})
                                    </h3>
                                    {isEditing && (
                                        <button onClick={addEducation} className="px-3 py-1.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white text-sm rounded-xl transition-all">
                                            + Ekle
                                        </button>
                                    )}
                                </div>
                                <div className="space-y-3">
                                    {education.map((edu, index) => (
                                        <div key={index} className="bg-white/5 rounded-xl p-4 border border-white/5">
                                            {isEditing ? (
                                                <div className="space-y-2">
                                                    <div className="flex justify-end">
                                                        <button onClick={() => removeEducation(index)} className="text-red-400 hover:text-red-300 text-sm">Sil</button>
                                                    </div>
                                                    <input type="text" placeholder="Derece (örn: Lisans)" value={edu.degree || ""} onChange={(e) => updateEducation(index, "degree", e.target.value)} className="w-full px-3 py-2 bg-white/5 border border-white/10 text-white rounded-xl text-sm focus:ring-2 focus:ring-purple-500" />
                                                    <input type="text" placeholder="Alan (örn: Bilgisayar Mühendisliği)" value={edu.field || ""} onChange={(e) => updateEducation(index, "field", e.target.value)} className="w-full px-3 py-2 bg-white/5 border border-white/10 text-white rounded-xl text-sm focus:ring-2 focus:ring-purple-500" />
                                                    <input type="text" placeholder="Okul" value={edu.school || ""} onChange={(e) => updateEducation(index, "school", e.target.value)} className="w-full px-3 py-2 bg-white/5 border border-white/10 text-white rounded-xl text-sm focus:ring-2 focus:ring-purple-500" />
                                                    <input type="text" placeholder="Yıl (örn: 2018-2022)" value={edu.year || ""} onChange={(e) => updateEducation(index, "year", e.target.value)} className="w-full px-3 py-2 bg-white/5 border border-white/10 text-white rounded-xl text-sm focus:ring-2 focus:ring-purple-500" />
                                                    <input type="text" placeholder="GPA (opsiyonel)" value={edu.gpa || ""} onChange={(e) => updateEducation(index, "gpa", e.target.value)} className="w-full px-3 py-2 bg-white/5 border border-white/10 text-white rounded-xl text-sm focus:ring-2 focus:ring-purple-500" />
                                                </div>
                                            ) : (
                                                <div className="text-sm">
                                                    <p className="font-medium text-white">{edu.degree} - {edu.field}</p>
                                                    <p className="text-gray-400">{edu.school} ({edu.year}){edu.gpa && <span className="ml-2 text-green-400">GPA: {edu.gpa}</span>}</p>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                    {education.length === 0 && <p className="text-gray-400 text-sm">Henüz ėitim bilgisi eklenmemiş</p>}
                                </div>
                            </div>

                            {/* Portfolio Card */}
                            <div ref={portfolioRef} className="bg-[#111]/80 backdrop-blur-sm rounded-2xl border border-white/10 p-6 hover:border-purple-500/30 transition-all">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500"></span>
                                        Portfolyo ({portfolio.length}/10)
                                    </h3>
                                </div>
                                {isEditing && (
                                    <div className="mb-4">
                                        <PortfolioUploader currentCount={portfolio.length + pendingPortfolio.length} maxCount={10} onFilesSelected={handlePortfolioFilesSelected} deferredMode={true} disabled={uploadingPortfolio} existingFiles={portfolio.filter(item => item?.imageUrl).map(item => ({ fileName: item.imageUrl.split('/').pop() || '', fileSize: 0 }))} />
                                    </div>
                                )}
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {portfolio.map((item, index) => (
                                        <div key={index} className="relative group aspect-square rounded-xl overflow-hidden bg-white/5 border border-white/10">
                                            <img src={getProxiedImageUrl(item.imageUrl)} alt={item.title || `Portfolio ${index + 1}`} className="w-full h-full object-cover" />
                                            {(item.title || item.category) && (
                                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                                                    {item.title && <p className="text-white text-xs font-semibold truncate">{item.title}</p>}
                                                    {item.category && <p className="text-gray-300 text-xs truncate">{item.category}</p>}
                                                </div>
                                            )}
                                            {isEditing && !uploadingPortfolio && (
                                                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => setEditingPortfolioIndex(index)} className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full" title="Detayları düzenle">Düzenle</button>
                                                    <button onClick={() => handlePortfolioDelete(item.imageUrl, index)} className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-full" title="Sil">Sil</button>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                    {pendingPortfolio.map((item, index) => (
                                        <div key={`pending-${index}`} className="relative group aspect-square rounded-xl overflow-hidden bg-white/5 border-2 border-yellow-500">
                                            <img src={item.preview} alt={`Pending ${index + 1}`} className="w-full h-full object-cover" />
                                            <div className="absolute top-2 left-2 bg-yellow-500 text-black text-xs px-2 py-1 rounded font-semibold">Kaydedilmedi</div>
                                            {isEditing && (
                                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <button onClick={() => { URL.revokeObjectURL(item.preview); setPendingPortfolio(prev => prev.filter((_, i) => i !== index)); }} className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg" title="KaldÄ±r">ğŸ—‘ï¸</button>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                    {portfolio.length === 0 && pendingPortfolio.length === 0 && (
                                        <div className="col-span-2 md:col-span-3 text-center py-8">
                                            <p className="text-gray-400 text-sm">Henüz portfolio fotoğrafı eklenmemiş</p>
                                            {isEditing && <p className="text-gray-500 text-xs mt-2">Maksimum 10 adet fotoğraf ekleyebilirsiniz</p>}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Portfolio Metadata Editor Modal */}
                            {editingPortfolioIndex !== null && (
                                <PortfolioMetadataEditor item={portfolio[editingPortfolioIndex]} index={editingPortfolioIndex} onSave={handlePortfolioMetadataSave} onCancel={() => setEditingPortfolioIndex(null)} />
                            )}

                            {/* Skills Card */}
                            <div ref={skillsRef} className="bg-[#111]/80 backdrop-blur-sm rounded-2xl border border-white/10 p-6 hover:border-purple-500/30 transition-all">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500"></span>
                                        Yetenekler ({skills.length})
                                    </h3>
                                    {isEditing && (
                                        <button onClick={addSkill} className="px-3 py-1.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white text-sm rounded-xl transition-all">
                                            + Ekle
                                        </button>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    {skills.map((skill, index) => {
                                        const skillObj = typeof skill === 'string' ? { name: skill, level: 'intermediate' as const, percentage: 70, category: '' } : skill;
                                        const levelPercentages: Record<string, number> = { 'beginner': 40, 'intermediate': 70, 'advanced': 85, 'expert': 95 };
                                        const displayPercentage = skillObj.percentage || levelPercentages[skillObj.level || 'intermediate'];
                                        return (
                                            <div key={index} className="bg-white/5 rounded-xl p-3 border border-white/5">
                                                {isEditing ? (
                                                    <div className="space-y-2">
                                                        <div className="flex gap-2 items-center">
                                                            <input type="text" value={skillObj.name} onChange={(e) => updateSkill(index, 'name', e.target.value)} placeholder="Yetenek adı" className="flex-1 px-3 py-2 bg-white/5 border border-white/10 text-white rounded-xl text-sm focus:ring-2 focus:ring-purple-500" />
                                                            <select value={skillObj.level || 'intermediate'} onChange={(e) => updateSkill(index, 'level', e.target.value as CVSkill['level'])} className="px-3 py-2 bg-white/5 border border-white/10 text-white rounded-xl text-sm focus:ring-2 focus:ring-purple-500">
                                                                <option value="beginner">Başlangıç</option>
                                                                <option value="intermediate">Orta</option>
                                                                <option value="advanced">İleri</option>
                                                                <option value="expert">Uzman</option>
                                                            </select>
                                                            <button onClick={() => removeSkill(index)} className="px-2 py-1 text-red-400 hover:text-red-300 text-sm">Sil</button>
                                                        </div>
                                                        <input type="text" value={skillObj.category || ''} onChange={(e) => updateSkill(index, 'category', e.target.value)} placeholder="Kategori (örn: Frontend)" className="w-full px-3 py-2 bg-white/5 border border-white/10 text-white rounded-xl text-sm placeholder-gray-500 focus:ring-2 focus:ring-purple-500" />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="font-medium text-white">{skillObj.name}</span>
                                                            {skillObj.category && <span className="px-2 py-0.5 text-xs bg-purple-500/20 text-purple-300 rounded-full">{skillObj.category}</span>}
                                                        </div>
                                                        <div className="flex items-center gap-3 text-sm text-gray-400">
                                                            <span className="capitalize">{skillObj.level || 'intermediate'}</span>
                                                            <span>•</span>
                                                            <span>{displayPercentage}%</span>
                                                        </div>
                                                        <div className="mt-2 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                                            <div className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all" style={{ width: `${displayPercentage}%` }} />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                    {skills.length === 0 && <p className="text-gray-400 text-sm">Henüz yetenek eklenmemiş</p>}
                                </div>
                            </div>

                            {/* Languages Card */}
                            <div ref={languagesRef} className="bg-[#111]/80 backdrop-blur-sm rounded-2xl border border-white/10 p-6 hover:border-purple-500/30 transition-all">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500"></span>
                                        Diller ({languages.length})
                                    </h3>
                                    {isEditing && (
                                        <button onClick={addLanguage} className="px-3 py-1.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white text-sm rounded-xl transition-all">
                                            + Ekle
                                        </button>
                                    )}
                                </div>
                                <div className="space-y-3">
                                    {languages.map((lang, index) => {
                                        const langObj = typeof lang === 'string' ? { name: lang, level: 'intermediate' as const, percentage: 60, certifications: undefined, cefr: undefined } : lang;
                                        return (
                                            <div key={index} className="bg-white/5 rounded-xl p-3 border border-white/5">
                                                {isEditing ? (
                                                    <div className="space-y-2">
                                                        <div className="flex gap-2 items-center">
                                                            <input type="text" value={langObj.name} onChange={(e) => updateLanguage(index, 'name', e.target.value)} placeholder="Dil adı (ör: İngilizce)" className="flex-1 px-3 py-2 bg-white/5 border border-white/10 text-white rounded-xl text-sm focus:ring-2 focus:ring-purple-500" />
                                                            <select value={langObj.level || 'intermediate'} onChange={(e) => updateLanguage(index, 'level', e.target.value as CVLanguage['level'])} className="px-3 py-2 bg-white/5 border border-white/10 text-white rounded-xl text-sm focus:ring-2 focus:ring-purple-500">
                                                                <option value="native">Ana Dil</option>
                                                                <option value="fluent">Akıcı</option>
                                                                <option value="advanced">İleri</option>
                                                                <option value="intermediate">Orta</option>
                                                                <option value="basic">Başlangıç</option>
                                                            </select>
                                                            <button onClick={() => removeLanguage(index)} className="px-2 py-1 text-red-400 hover:text-red-300 text-sm">Sil</button>
                                                        </div>
                                                        <select value={langObj.cefr || ''} onChange={(e) => updateLanguage(index, 'cefr', e.target.value || undefined)} className="w-full px-3 py-2 bg-white/5 border border-white/10 text-white rounded-xl text-sm focus:ring-2 focus:ring-purple-500">
                                                            <option value="" disabled hidden={!!langObj.cefr}>CEFR Seviyesi (Opsiyonel)</option>
                                                            <option value="A1">A1 - Başlangıç</option>
                                                            <option value="A2">A2 - Temel</option>
                                                            <option value="B1">B1 - Orta Seviye</option>
                                                            <option value="B2">B2 - Orta-İleri</option>
                                                            <option value="C1">C1 - İleri</option>
                                                            <option value="C2">C2 - Üst Düzey</option>
                                                        </select>
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="font-medium text-white">{langObj.name}</span>
                                                            {langObj.cefr && <span className="px-2 py-0.5 text-xs bg-purple-500/20 text-purple-300 rounded-full">CEFR: {langObj.cefr}</span>}
                                                        </div>
                                                        <div className="text-sm text-gray-400 capitalize">{langObj.level || 'intermediate'}</div>
                                                        {langObj.certifications && langObj.certifications.length > 0 && (
                                                            <div className="mt-2 flex flex-wrap gap-1">
                                                                {langObj.certifications.map((cert, certIndex) => (
                                                                    <span key={certIndex} className="px-2 py-0.5 text-xs bg-green-500/20 text-green-300 rounded">ğŸ† {cert}</span>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                    {languages.length === 0 && <p className="text-gray-400 text-sm">Henüz dil eklenmemiş</p>}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right: Navigation Sidebar (Bölümler) */}
                {site && cvData && (
                    <div className="w-56 flex-shrink-0 self-start sticky top-6">
                        <div className="bg-[#111]/80 backdrop-blur-sm rounded-2xl border border-white/10 p-5">
                            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500"></span>
                                Bölümler
                            </h3>
                            <nav className="space-y-2 mb-6">
                                {[
                                    { label: "Kişisel Bilgiler", ref: personalInfoRef },
                                    { label: "Deneyimler", ref: experienceRef },
                                    { label: "Eğitim", ref: educationRef },
                                    { label: "Portfolyo", ref: portfolioRef },
                                    { label: "Yetenekler", ref: skillsRef },
                                    { label: "Diller", ref: languagesRef },
                                ].map((item, idx) => (
                                    <button key={idx} onClick={() => scrollToSection(item.ref)} className="w-full text-left px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                                        {item.label}
                                    </button>
                                ))}
                            </nav>

                            <div className="border-t border-white/10 pt-4 space-y-2">
                                {!isEditing ? (
                                    <button onClick={handleEdit} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-xl transition-all font-medium">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                        Düzenle
                                    </button>
                                ) : (
                                    <>
                                        <button onClick={handleSave} disabled={saving} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 disabled:from-gray-500 disabled:to-gray-600 text-white rounded-xl transition-all font-medium">
                                            {saving ? "Kaydediliyor..." : "Kaydet"}
                                        </button>
                                        <button onClick={handleCancel} disabled={saving} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all font-medium border border-white/10">
                                            İptal Et
                                        </button>
                                    </>
                                )}
                                <button onClick={onDelete} disabled={deleting || isEditing} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl transition-all font-medium border border-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    {deleting ? "Siliniyor..." : "CV'yi Sil"}
                                </button>
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
                title={
                    confirmDialog.type === "deletePendingPhoto" ? "Seçili Fotoğrafı Kaldır" :
                        confirmDialog.type === "deleteSavedPhoto" ? "Profil Fotoğrafını Sil" :
                            confirmDialog.type === "deletePortfolio" ? "Portfolio Fotoğrafını Sil" :
                                confirmDialog.type === "republish" ? "Siteyi Yeniden Yayınla" :
                                    "Değişiklikleri Geri Al"
                }
                message={
                    confirmDialog.type === "deletePendingPhoto" ? "Seçilen fotoğrafı kaldırmak istediğinizden emin misiniz?" :
                        confirmDialog.type === "deleteSavedPhoto" ? "Profil fotoğrafını silmek istediğinizden emin misiniz?" :
                            confirmDialog.type === "deletePortfolio" ? "Bu portfolio fotoğrafını silmek istediğinizden emin misiniz?" :
                                confirmDialog.type === "republish" ? "Sitenizi yeniden yayınlamak istediğinizden emin misiniz?" :
                                    "Değişiklikleri geri almak istediğinizden emin misiniz? Bu işlem geri alınamaz."
                }
                confirmText={
                    confirmDialog.type === "republish" ? "Yayınla" :
                        confirmDialog.type === "rollback" ? "Geri Al" :
                            "Sil"
                }
                variant={
                    confirmDialog.type === "rollback" ? "danger" :
                        confirmDialog.type === "republish" ? "info" :
                            "warning"
                }
                loading={publishing}
            />
        </>
    );
}
