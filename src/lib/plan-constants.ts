/**
 * Subscription Plan Constants
 * Defines plan types, limits, and features for the subscription system
 */

export enum PlanType {
    FREE = "FREE",
    PAID = "PAID",
}

export interface PlanLimits {
    editsPerMonth: number;
    versionHistory: number;
    domainReservationDays: number;
    totalPages: "one" | "multiple";
    portfolio: "image" | "image_video";
    storageGB: number;
    languages: number;
    dayNight: boolean;
    blogPage: boolean;
    customDomain: boolean;
    cvUpload: string[];
    blogImages: number;
    googleAnalytics: boolean;
    seo: "basic" | "advanced";
    contactForm: "basic" | "custom";
    customFavicon: boolean;
    custom404: boolean;
}

export const PLAN_LIMITS: Record<PlanType, PlanLimits> = {
    [PlanType.FREE]: {
        editsPerMonth: 5,
        versionHistory: 1,
        domainReservationDays: 7,
        totalPages: "one",
        portfolio: "image",
        storageGB: 0.1, // 100 MB
        languages: 2,
        dayNight: true,
        blogPage: false,
        customDomain: false,
        cvUpload: ["pdf", "word", "linkedin"],
        blogImages: 0,
        googleAnalytics: false,
        seo: "basic",
        contactForm: "basic",
        customFavicon: false,
        custom404: false,
    },
    [PlanType.PAID]: {
        editsPerMonth: 20,
        versionHistory: 3,
        domainReservationDays: 30,
        totalPages: "multiple",
        portfolio: "image_video",
        storageGB: 1, // 1 GB
        languages: 5,
        dayNight: true,
        blogPage: true,
        customDomain: true,
        cvUpload: ["pdf", "word", "linkedin"],
        blogImages: 100,
        googleAnalytics: true,
        seo: "advanced",
        contactForm: "custom",
        customFavicon: true,
        custom404: true,
    },
};

export interface PlanFeature {
    name: string;
    free: string | boolean;
    paid: string | boolean;
}

export const PLAN_FEATURES: PlanFeature[] = [
    {
        name: "Düzenleme Hakkı",
        free: "5 / ay",
        paid: "20 / ay",
    },
    {
        name: "Version History",
        free: "1",
        paid: "3",
    },
    {
        name: "Domain Rezervasyonu",
        free: "7 gün",
        paid: "30 gün",
    },
    {
        name: "Total Page",
        free: "Tek sayfa",
        paid: "Çoklu sayfa",
    },
    {
        name: "Portfolio",
        free: "Sadece görsel",
        paid: "Görsel + Video",
    },
    {
        name: "Storage",
        free: "100 MB",
        paid: "1 GB",
    },
    {
        name: "Multiple Languages",
        free: "2 dil",
        paid: "5 dil",
    },
    {
        name: "Day / Night Mode",
        free: true,
        paid: true,
    },
    {
        name: "Blog Page + Blog Editor",
        free: false,
        paid: true,
    },
    {
        name: "Domain",
        free: "Subdomain",
        paid: "Subdomain + Custom Domain",
    },
    {
        name: "CV Upload",
        free: "PDF + Word + LinkedIn",
        paid: "PDF + Word + LinkedIn",
    },
    {
        name: "Blog Görselleri",
        free: "-",
        paid: "100 görsel",
    },
    {
        name: "Google Analytics",
        free: false,
        paid: true,
    },
    {
        name: "SEO",
        free: "Temel",
        paid: "Gelişmiş",
    },
    {
        name: "Contact Form",
        free: "Temel",
        paid: "Custom Fields",
    },
    {
        name: "Custom Favicon",
        free: false,
        paid: true,
    },
    {
        name: "Custom 404",
        free: false,
        paid: true,
    },
];

/**
 * Get plan limits for a specific plan type
 */
export function getPlanLimits(planType: PlanType): PlanLimits {
    return PLAN_LIMITS[planType];
}

/**
 * Get storage limit in bytes for a plan type
 */
export function getStorageLimitBytes(planType: PlanType): bigint {
    const limits = getPlanLimits(planType);
    return BigInt(Math.floor(limits.storageGB * 1024 * 1024 * 1024));
}

/**
 * Get plan price in TL
 */
export function getPlanPrice(planType: PlanType): number {
    return planType === PlanType.FREE ? 0 : 150;
}

/**
 * Get plan display name
 */
export function getPlanName(planType: PlanType): string {
    return planType === PlanType.FREE ? "Free Plan" : "Paid Plan";
}

/**
 * Get plan display name in Turkish
 */
export function getPlanNameTR(planType: PlanType): string {
    return planType === PlanType.FREE ? "Ücretsiz Plan" : "Ücretli Plan";
}
