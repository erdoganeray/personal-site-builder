"use client";

import { useMemo } from "react";

interface PasswordStrengthMeterProps {
    password: string;
    showRequirements?: boolean;
}

interface StrengthResult {
    score: number; // 0-4
    label: string;
    color: string;
    requirements: {
        met: boolean;
        text: string;
    }[];
}

export default function PasswordStrengthMeter({
    password,
    showRequirements = true
}: PasswordStrengthMeterProps) {
    const strength = useMemo((): StrengthResult => {
        const requirements = [
            { met: password.length >= 6, text: "En az 6 karakter" },
            { met: password.length >= 8, text: "En az 8 karakter (önerilen)" },
            { met: /[A-Z]/.test(password), text: "Büyük harf içermeli" },
            { met: /[a-z]/.test(password), text: "Küçük harf içermeli" },
            { met: /[0-9]/.test(password), text: "Rakam içermeli" },
            { met: /[^A-Za-z0-9]/.test(password), text: "Özel karakter içermeli" }
        ];

        const metCount = requirements.filter(r => r.met).length;

        // Calculate score (0-4)
        let score = 0;
        if (password.length >= 6) score = 1;
        if (password.length >= 8 && metCount >= 3) score = 2;
        if (password.length >= 8 && metCount >= 4) score = 3;
        if (password.length >= 10 && metCount >= 5) score = 4;

        const labels = ["Çok Zayıf", "Zayıf", "Orta", "Güçlü", "Çok Güçlü"];
        const colors = [
            "bg-red-500",
            "bg-orange-500",
            "bg-yellow-500",
            "bg-green-500",
            "bg-emerald-500"
        ];

        return {
            score,
            label: labels[score],
            color: colors[score],
            requirements
        };
    }, [password]);

    if (!password) return null;

    return (
        <div className="mt-2 space-y-2">
            {/* Strength Bar */}
            <div className="flex items-center gap-2">
                <div className="flex-1 flex gap-1">
                    {[0, 1, 2, 3].map((index) => (
                        <div
                            key={index}
                            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${index < strength.score
                                ? strength.color
                                : "bg-gray-600"
                                }`}
                        />
                    ))}
                </div>
                <span className={`text-xs font-medium ${strength.score === 0 ? "text-red-400" :
                    strength.score === 1 ? "text-orange-400" :
                        strength.score === 2 ? "text-yellow-400" :
                            strength.score === 3 ? "text-green-400" :
                                "text-emerald-400"
                    }`}>
                    {strength.label}
                </span>
            </div>

            {/* Requirements Checklist */}
            {showRequirements && (
                <div className="grid grid-cols-2 gap-1">
                    {strength.requirements.map((req, index) => (
                        <div
                            key={index}
                            className={`flex items-center gap-1.5 text-xs transition-colors ${req.met ? "text-green-400" : "text-gray-500"
                                }`}
                        >
                            {req.met ? (
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            ) : (
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            )}
                            <span>{req.text}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// Helper function to calculate password strength score
export function getPasswordStrengthScore(password: string): number {
    const requirements = [
        password.length >= 6,
        password.length >= 8,
        /[A-Z]/.test(password),
        /[a-z]/.test(password),
        /[0-9]/.test(password),
        /[^A-Za-z0-9]/.test(password)
    ];

    const metCount = requirements.filter(Boolean).length;

    let score = 0;
    if (password.length >= 6) score = 1;
    if (password.length >= 8 && metCount >= 3) score = 2;
    if (password.length >= 8 && metCount >= 4) score = 3;
    if (password.length >= 10 && metCount >= 5) score = 4;

    return score;
}

// Helper function to check if password meets minimum requirements (Güçlü or Çok Güçlü)
export function isPasswordStrong(password: string): boolean {
    return getPasswordStrengthScore(password) >= 3;
}

// Helper function to get password validation error message
export function getPasswordError(password: string): string | null {
    const score = getPasswordStrengthScore(password);
    if (score < 3) {
        return "Şifre en az 'Güçlü' seviyesinde olmalıdır (8+ karakter, büyük/küçük harf, rakam veya özel karakter)";
    }
    return null;
}
