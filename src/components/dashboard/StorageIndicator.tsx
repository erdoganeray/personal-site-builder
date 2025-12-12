"use client";

import { useEffect, useState } from "react";

interface StorageInfo {
    storageUsed: number;
    storageLimit: number;
    usagePercentage: number;
    storageUsedFormatted: string;
    storageLimitFormatted: string;
}

export default function StorageIndicator() {
    const [storage, setStorage] = useState<StorageInfo | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStorage();
    }, []);

    const fetchStorage = async () => {
        try {
            const response = await fetch("/api/storage");
            if (response.ok) {
                const data = await response.json();
                setStorage(data);
            }
        } catch (error) {
            console.error("Storage fetch error:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-4 animate-pulse">
                <div className="h-4 bg-gray-700 rounded w-24 mb-2"></div>
                <div className="h-2 bg-gray-700 rounded mb-2"></div>
                <div className="h-3 bg-gray-700 rounded w-32"></div>
            </div>
        );
    }

    if (!storage) {
        return null;
    }

    // Color based on usage percentage
    const getProgressColor = () => {
        if (storage.usagePercentage >= 90) return "bg-red-500";
        if (storage.usagePercentage >= 75) return "bg-yellow-500";
        return "bg-green-500";
    };

    const getTextColor = () => {
        if (storage.usagePercentage >= 90) return "text-red-400";
        if (storage.usagePercentage >= 75) return "text-yellow-400";
        return "text-green-400";
    };

    return (
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"
                        />
                    </svg>
                    <h3 className="text-sm font-semibold text-white">Depolama</h3>
                </div>
                <span className={`text-xs font-medium ${getTextColor()}`}>
                    {storage.usagePercentage}%
                </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                <div
                    className={`h-2 rounded-full transition-all duration-300 ${getProgressColor()}`}
                    style={{ width: `${Math.min(storage.usagePercentage, 100)}%` }}
                ></div>
            </div>

            {/* Storage Info */}
            <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">
                    {storage.storageUsedFormatted}
                </span>
                <span className="text-gray-500">
                    / {storage.storageLimitFormatted}
                </span>
            </div>

            {/* Warning Message */}
            {storage.usagePercentage >= 90 && (
                <div className="mt-3 p-2 bg-red-900/20 border border-red-700/50 rounded text-xs text-red-400">
                    ⚠️ Depolama alanınız dolmak üzere!
                </div>
            )}
        </div>
    );
}
