"use client";

import { Toaster } from "sonner";

export function ToastProvider() {
    return (
        <Toaster
            position="top-right"
            toastOptions={{
                duration: 4000,
                style: {
                    background: "#1f2937",
                    color: "#f3f4f6",
                    border: "1px solid #374151",
                },
                classNames: {
                    success: "!bg-green-900/90 !border-green-700 !text-green-100",
                    error: "!bg-red-900/90 !border-red-700 !text-red-100",
                    warning: "!bg-yellow-900/90 !border-yellow-700 !text-yellow-100",
                    info: "!bg-blue-900/90 !border-blue-700 !text-blue-100",
                },
            }}
            richColors
            closeButton
        />
    );
}

// Re-export toast for easy imports
export { toast } from "sonner";
