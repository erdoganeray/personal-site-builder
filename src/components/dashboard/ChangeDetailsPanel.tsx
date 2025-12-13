"use client";

import { useState } from "react";
import { DetailedChange, getDetailedCvChanges } from "@/lib/change-detection";

interface ChangeDetailsPanelProps {
    site: any;
}

export default function ChangeDetailsPanel({ site }: ChangeDetailsPanelProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const changes = getDetailedCvChanges(site);

    if (changes.length === 0) {
        return null;
    }

    return (
        <div className="mt-3">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center gap-2 text-yellow-200 hover:text-yellow-100 text-sm font-medium transition-colors"
            >
                <svg
                    className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? "rotate-90" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <span>{isExpanded ? "Detayları Gizle" : "Detayları Göster"} ({changes.length} değişiklik)</span>
            </button>

            {isExpanded && (
                <div className="mt-3 space-y-3 animate-slideDown">
                    {changes.map((change, index) => (
                        <div key={index}>
                            {change.type === "text" && (
                                <TextFieldChange
                                    label={change.label}
                                    oldValue={change.oldValue}
                                    newValue={change.newValue}
                                />
                            )}
                            {change.type === "nested" && change.changes && (
                                <NestedItemChange
                                    label={change.label}
                                    changes={change.changes}
                                />
                            )}
                            {change.type === "photo" && (
                                <PhotoChange
                                    label={change.label}
                                    oldValue={change.oldValue}
                                    newValue={change.newValue}
                                />
                            )}
                            {change.type === "portfolio" && (
                                <PortfolioChange
                                    oldValue={change.oldValue}
                                    newValue={change.newValue}
                                />
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// Text field change component
function TextFieldChange({ label, oldValue, newValue }: { label: string; oldValue: string; newValue: string }) {
    return (
        <div className="bg-yellow-900/20 border border-yellow-700/50 rounded-lg p-3">
            <h4 className="text-yellow-200 font-semibold text-sm mb-2">{label}</h4>
            <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                    <span className="text-yellow-300/70 block mb-1">Eski:</span>
                    <span className="text-yellow-100 break-words">{oldValue}</span>
                </div>
                <div>
                    <span className="text-yellow-300/70 block mb-1">Yeni:</span>
                    <span className="text-yellow-100 break-words">{newValue}</span>
                </div>
            </div>
        </div>
    );
}

// Nested item change component
function NestedItemChange({ label, changes }: { label: string; changes: any[] }) {
    return (
        <div className="bg-yellow-900/20 border border-yellow-700/50 rounded-lg p-3">
            <h4 className="text-yellow-200 font-semibold text-sm mb-2">{label}</h4>
            <div className="space-y-2">
                {changes.map((change, idx) => (
                    <div key={idx} className="border-l-2 border-yellow-600 pl-3">
                        <div className="text-yellow-100 font-medium text-xs mb-1">{change.itemLabel}</div>
                        <div className="grid grid-cols-2 gap-3 text-xs">
                            <div>
                                <span className="text-yellow-300/70">{change.fieldLabel}: </span>
                                <span className="text-yellow-100">{change.oldValue}</span>
                            </div>
                            <div>
                                <span className="text-yellow-300/70">{change.fieldLabel}: </span>
                                <span className="text-yellow-100">{change.newValue}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// Photo change component
function PhotoChange({ label, oldValue, newValue }: { label: string; oldValue: string; newValue: string }) {
    const isAdded = oldValue === "-" && newValue === "✓";
    const isRemoved = oldValue === "✓" && newValue === "-";

    return (
        <div className="bg-yellow-900/20 border border-yellow-700/50 rounded-lg p-3">
            <h4 className="text-yellow-200 font-semibold text-sm mb-2">{label}</h4>
            <div className="text-xs text-yellow-100">
                {isAdded && "✓ Profil fotoğrafı eklendi"}
                {isRemoved && "✗ Profil fotoğrafı kaldırıldı"}
                {!isAdded && !isRemoved && "↻ Profil fotoğrafı değiştirildi"}
            </div>
        </div>
    );
}

// Portfolio change component
function PortfolioChange({ oldValue, newValue }: { oldValue: any; newValue: any }) {
    const countChanged = oldValue.count !== newValue.count;
    const hasIdChanges = oldValue.hasIdChanges || newValue.hasIdChanges;

    return (
        <div className="bg-yellow-900/20 border border-yellow-700/50 rounded-lg p-3">
            <h4 className="text-yellow-200 font-semibold text-sm mb-2">Portfolio</h4>
            <div className="space-y-1 text-xs text-yellow-100">
                {countChanged && (
                    <div>
                        Fotoğraf sayısı: <span className="text-yellow-300">{oldValue.count}</span> → <span className="text-yellow-300">{newValue.count}</span>
                    </div>
                )}
                {hasIdChanges && (
                    <div className="flex items-center gap-1">
                        <svg className="w-3 h-3 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <span>Fotoğraf değişikliği var</span>
                    </div>
                )}
            </div>
        </div>
    );
}
