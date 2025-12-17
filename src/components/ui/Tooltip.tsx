"use client";

import { useState, useRef, useEffect, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface TooltipProps {
    content: string | ReactNode;
    children: ReactNode;
    position?: "top" | "bottom" | "left" | "right";
    delay?: number;
    className?: string;
}

export default function Tooltip({
    content,
    children,
    position = "top",
    delay = 200,
    className
}: TooltipProps) {
    const [isVisible, setIsVisible] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);

    const showTooltip = () => {
        timeoutRef.current = setTimeout(() => {
            setIsVisible(true);
        }, delay);
    };

    const hideTooltip = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        setIsVisible(false);
    };

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    const positionClasses = {
        top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
        bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
        left: "right-full top-1/2 -translate-y-1/2 mr-2",
        right: "left-full top-1/2 -translate-y-1/2 ml-2"
    };

    const arrowClasses = {
        top: "top-full left-1/2 -translate-x-1/2 border-t-gray-700 border-x-transparent border-b-transparent",
        bottom: "bottom-full left-1/2 -translate-x-1/2 border-b-gray-700 border-x-transparent border-t-transparent",
        left: "left-full top-1/2 -translate-y-1/2 border-l-gray-700 border-y-transparent border-r-transparent",
        right: "right-full top-1/2 -translate-y-1/2 border-r-gray-700 border-y-transparent border-l-transparent"
    };

    return (
        <div
            className="relative inline-flex"
            onMouseEnter={showTooltip}
            onMouseLeave={hideTooltip}
            onFocus={showTooltip}
            onBlur={hideTooltip}
        >
            {children}

            {isVisible && (
                <div
                    ref={tooltipRef}
                    role="tooltip"
                    className={cn(
                        "absolute z-50 px-3 py-2 text-sm text-white bg-gray-700 rounded-lg shadow-lg",
                        "whitespace-nowrap",
                        "animate-in fade-in zoom-in-95 duration-150",
                        positionClasses[position],
                        className
                    )}
                >
                    {content}
                    {/* Arrow */}
                    <div
                        className={cn(
                            "absolute w-0 h-0 border-4",
                            arrowClasses[position]
                        )}
                    />
                </div>
            )}
        </div>
    );
}

// Simple tooltip wrapper for common use cases
export function InfoTooltip({ text }: { text: string }) {
    return (
        <Tooltip content={text}>
            <span className="inline-flex items-center justify-center w-4 h-4 text-xs text-gray-400 hover:text-gray-300 cursor-help transition-colors">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </span>
        </Tooltip>
    );
}
