"use client";

import { cn } from "@/lib/utils";
import Spinner from "./Spinner";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface LoadingButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    loading?: boolean;
    loadingText?: string;
    variant?: "primary" | "secondary" | "danger" | "success" | "ghost";
    size?: "sm" | "md" | "lg";
}

const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white",
    secondary: "bg-gray-600 hover:bg-gray-700 disabled:bg-gray-500 text-white",
    danger: "bg-red-600 hover:bg-red-700 disabled:bg-red-800 text-white",
    success: "bg-green-600 hover:bg-green-700 disabled:bg-green-800 text-white",
    ghost: "bg-transparent hover:bg-gray-700 text-gray-300 hover:text-white border border-gray-600"
};

const sizes = {
    sm: "px-3 py-1.5 text-sm rounded-md",
    md: "px-4 py-2.5 text-sm rounded-lg",
    lg: "px-6 py-3 text-base rounded-lg"
};

const LoadingButton = forwardRef<HTMLButtonElement, LoadingButtonProps>(
    ({
        children,
        loading = false,
        loadingText,
        variant = "primary",
        size = "md",
        disabled,
        className,
        ...props
    }, ref) => {
        return (
            <button
                ref={ref}
                disabled={disabled || loading}
                className={cn(
                    "font-semibold transition-all duration-200 inline-flex items-center justify-center",
                    "disabled:cursor-not-allowed disabled:opacity-70",
                    variants[variant],
                    sizes[size],
                    className
                )}
                {...props}
            >
                {loading && (
                    <Spinner size="sm" className="mr-2" />
                )}
                {loading && loadingText ? loadingText : children}
            </button>
        );
    }
);

LoadingButton.displayName = "LoadingButton";

export default LoadingButton;

// Common button presets for quick use
export function SubmitButton({
    children = "Gönder",
    loading,
    loadingText = "Gönderiliyor...",
    ...props
}: LoadingButtonProps) {
    return (
        <LoadingButton
            type="submit"
            loading={loading}
            loadingText={loadingText}
            variant="primary"
            {...props}
        >
            {children}
        </LoadingButton>
    );
}

export function DeleteButton({
    children = "Sil",
    loading,
    loadingText = "Siliniyor...",
    ...props
}: LoadingButtonProps) {
    return (
        <LoadingButton
            loading={loading}
            loadingText={loadingText}
            variant="danger"
            {...props}
        >
            {children}
        </LoadingButton>
    );
}

export function SaveButton({
    children = "Kaydet",
    loading,
    loadingText = "Kaydediliyor...",
    ...props
}: LoadingButtonProps) {
    return (
        <LoadingButton
            type="submit"
            loading={loading}
            loadingText={loadingText}
            variant="success"
            {...props}
        >
            {children}
        </LoadingButton>
    );
}
