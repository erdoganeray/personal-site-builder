"use client";

import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import LoadingButton from "./LoadingButton";

interface ConfirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void | Promise<void>;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: "danger" | "warning" | "info";
    confirmInputText?: string; // If set, user must type this to confirm
    loading?: boolean;
}

const variantStyles = {
    danger: {
        icon: "text-red-400",
        iconBg: "bg-red-900/30",
        button: "danger" as const
    },
    warning: {
        icon: "text-yellow-400",
        iconBg: "bg-yellow-900/30",
        button: "primary" as const
    },
    info: {
        icon: "text-blue-400",
        iconBg: "bg-blue-900/30",
        button: "primary" as const
    }
};

export default function ConfirmDialog({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "Onayla",
    cancelText = "İptal",
    variant = "danger",
    confirmInputText,
    loading = false
}: ConfirmDialogProps) {
    const [inputValue, setInputValue] = useState("");
    const [isConfirming, setIsConfirming] = useState(false);

    const styles = variantStyles[variant];

    // Reset input when dialog opens/closes
    useEffect(() => {
        if (!isOpen) {
            setInputValue("");
        }
    }, [isOpen]);

    // Handle escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isOpen && !isConfirming) {
                onClose();
            }
        };

        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, [isOpen, isConfirming, onClose]);

    const handleConfirm = useCallback(async () => {
        if (confirmInputText && inputValue !== confirmInputText) {
            return;
        }

        setIsConfirming(true);
        try {
            await onConfirm();
        } finally {
            setIsConfirming(false);
        }
    }, [confirmInputText, inputValue, onConfirm]);

    const canConfirm = !confirmInputText || inputValue === confirmInputText;

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/60 transition-opacity"
                onClick={() => !isConfirming && onClose()}
            />

            {/* Dialog */}
            <div className="flex min-h-full items-center justify-center p-4">
                <div
                    className={cn(
                        "relative bg-gray-800 rounded-xl border border-gray-700 shadow-2xl",
                        "w-full max-w-md transform transition-all",
                        "animate-in fade-in zoom-in-95 duration-200"
                    )}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="p-6">
                        {/* Icon */}
                        <div className={cn(
                            "mx-auto flex h-12 w-12 items-center justify-center rounded-full mb-4",
                            styles.iconBg
                        )}>
                            {variant === "danger" && (
                                <svg className={cn("h-6 w-6", styles.icon)} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            )}
                            {variant === "warning" && (
                                <svg className={cn("h-6 w-6", styles.icon)} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            )}
                            {variant === "info" && (
                                <svg className={cn("h-6 w-6", styles.icon)} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            )}
                        </div>

                        {/* Content */}
                        <h3 className="text-lg font-bold text-white text-center mb-2">
                            {title}
                        </h3>
                        <p className="text-gray-300 text-center text-sm mb-4">
                            {message}
                        </p>

                        {/* Confirmation Input */}
                        {confirmInputText && (
                            <div className="mb-4">
                                <p className="text-xs text-gray-400 mb-2 text-center">
                                    Onaylamak için <span className="font-mono text-red-400">{confirmInputText}</span> yazın:
                                </p>
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-center focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                    placeholder={confirmInputText}
                                    autoFocus
                                />
                            </div>
                        )}

                        {/* Buttons */}
                        <div className="flex gap-3">
                            <button
                                onClick={onClose}
                                disabled={isConfirming || loading}
                                className="flex-1 px-4 py-2.5 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
                            >
                                {cancelText}
                            </button>
                            <LoadingButton
                                onClick={handleConfirm}
                                disabled={!canConfirm}
                                loading={isConfirming || loading}
                                loadingText="İşleniyor..."
                                variant={styles.button}
                                className="flex-1"
                            >
                                {confirmText}
                            </LoadingButton>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Hook for easier usage
export function useConfirmDialog() {
    const [isOpen, setIsOpen] = useState(false);
    const [dialogProps, setDialogProps] = useState<Partial<ConfirmDialogProps>>({});

    const confirm = useCallback((props: Omit<ConfirmDialogProps, "isOpen" | "onClose">) => {
        return new Promise<boolean>((resolve) => {
            setDialogProps({
                ...props,
                onConfirm: async () => {
                    await props.onConfirm();
                    setIsOpen(false);
                    resolve(true);
                }
            });
            setIsOpen(true);
        });
    }, []);

    const close = useCallback(() => {
        setIsOpen(false);
    }, []);

    return {
        isOpen,
        dialogProps: { ...dialogProps, isOpen, onClose: close } as ConfirmDialogProps,
        confirm,
        close
    };
}
