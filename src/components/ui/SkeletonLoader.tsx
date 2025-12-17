"use client";

import { cn } from "@/lib/utils";

interface SkeletonLoaderProps {
    className?: string;
    variant?: "text" | "circular" | "rectangular" | "card";
    width?: string;
    height?: string;
    lines?: number;
}

export default function SkeletonLoader({
    className,
    variant = "rectangular",
    width,
    height,
    lines = 1
}: SkeletonLoaderProps) {
    const baseClasses = "bg-gray-700 animate-pulse";

    const variantClasses = {
        text: "h-4 rounded",
        circular: "rounded-full",
        rectangular: "rounded-lg",
        card: "rounded-xl"
    };

    if (variant === "text" && lines > 1) {
        return (
            <div className={cn("space-y-2", className)}>
                {Array.from({ length: lines }).map((_, index) => (
                    <div
                        key={index}
                        className={cn(
                            baseClasses,
                            variantClasses.text,
                            index === lines - 1 ? "w-3/4" : "w-full"
                        )}
                        style={{ height: height || "1rem" }}
                    />
                ))}
            </div>
        );
    }

    return (
        <div
            className={cn(baseClasses, variantClasses[variant], className)}
            style={{ width, height }}
        />
    );
}

// Pre-built skeleton patterns for common use cases
export function SkeletonCard({ className }: { className?: string }) {
    return (
        <div className={cn("bg-gray-800 rounded-xl border border-gray-700 p-6 space-y-4", className)}>
            <SkeletonLoader height="1.5rem" width="60%" />
            <SkeletonLoader variant="text" lines={3} />
            <SkeletonLoader height="2.5rem" width="40%" />
        </div>
    );
}

export function SkeletonAvatar({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
    const sizes = {
        sm: "h-8 w-8",
        md: "h-12 w-12",
        lg: "h-16 w-16"
    };

    return (
        <SkeletonLoader
            variant="circular"
            className={sizes[size]}
        />
    );
}

export function SkeletonButton({ className }: { className?: string }) {
    return (
        <SkeletonLoader
            className={cn("h-12 w-full", className)}
            variant="rectangular"
        />
    );
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
    return (
        <div className="space-y-3">
            {/* Header */}
            <div className="flex gap-4 border-b border-gray-700 pb-3">
                <SkeletonLoader className="h-4 flex-1" />
                <SkeletonLoader className="h-4 flex-1" />
                <SkeletonLoader className="h-4 flex-1" />
            </div>
            {/* Rows */}
            {Array.from({ length: rows }).map((_, index) => (
                <div key={index} className="flex gap-4 py-2">
                    <SkeletonLoader className="h-4 flex-1" />
                    <SkeletonLoader className="h-4 flex-1" />
                    <SkeletonLoader className="h-4 flex-1" />
                </div>
            ))}
        </div>
    );
}
