"use client";

import { useState } from "react";
import CVUploader from "@/components/CVUploader";
import type { CVData } from "@/lib/gemini-pdf-parser";

interface MyInfoProps {
    site: any;
    cvData: CVData | null;
    onDelete: () => void;
    onCVAnalyzed: (analyzedData: CVData, siteId: string) => void;
    deleting: boolean;
}

export default function MyInfo({ site, cvData, onDelete, onCVAnalyzed, deleting }: MyInfoProps) {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-white mb-2">Bilgilerim</h2>
                <p className="text-gray-400">
                    CV'nizi yükleyin veya mevcut CV bilgilerinizi görüntüleyin
                </p>
            </div>

            {!site || !cvData ? (
                <CVUploader onAnalyzed={onCVAnalyzed} />
            ) : (
                <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-white">CV'im</h3>
                        <button
                            onClick={onDelete}
                            disabled={deleting}
                            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white rounded-lg transition-colors duration-200"
                        >
                            {deleting ? (
                                <>
                                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span>Siliniyor...</span>
                                </>
                            ) : (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    <span>CV'yi Sil</span>
                                </>
                            )}
                        </button>
                    </div>

                    <div className="space-y-4">
                        {/* Personal Info */}
                        <div className="bg-gray-700/50 rounded-lg p-4">
                            <h4 className="text-lg font-semibold text-white mb-3">Kişisel Bilgiler</h4>
                            <div className="space-y-2 text-sm">
                                <p className="text-gray-300">
                                    <strong>Ad Soyad:</strong> {cvData.personalInfo.name}
                                </p>
                                {cvData.personalInfo.title && (
                                    <p className="text-gray-300">
                                        <strong>Ünvan:</strong> {cvData.personalInfo.title}
                                    </p>
                                )}
                                {cvData.personalInfo.email && (
                                    <p className="text-gray-300">
                                        <strong>Email:</strong> {cvData.personalInfo.email}
                                    </p>
                                )}
                                {cvData.personalInfo.phone && (
                                    <p className="text-gray-300">
                                        <strong>Telefon:</strong> {cvData.personalInfo.phone}
                                    </p>
                                )}
                                {cvData.personalInfo.location && (
                                    <p className="text-gray-300">
                                        <strong>Konum:</strong> {cvData.personalInfo.location}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Summary */}
                        {cvData.summary && (
                            <div className="bg-gray-700/50 rounded-lg p-4">
                                <h4 className="text-lg font-semibold text-white mb-3">Özet</h4>
                                <p className="text-sm text-gray-300">{cvData.summary}</p>
                            </div>
                        )}

                        {/* Experience */}
                        {cvData.experience.length > 0 && (
                            <div className="bg-gray-700/50 rounded-lg p-4">
                                <h4 className="text-lg font-semibold text-white mb-3">
                                    İş Deneyimi ({cvData.experience.length})
                                </h4>
                                <div className="space-y-3">
                                    {cvData.experience.map((exp, index) => (
                                        <div key={index} className="text-sm">
                                            <p className="font-medium text-white">
                                                {exp.position} - {exp.company}
                                            </p>
                                            <p className="text-gray-400">{exp.duration}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Education */}
                        {cvData.education.length > 0 && (
                            <div className="bg-gray-700/50 rounded-lg p-4">
                                <h4 className="text-lg font-semibold text-white mb-3">
                                    Eğitim ({cvData.education.length})
                                </h4>
                                <div className="space-y-3">
                                    {cvData.education.map((edu, index) => (
                                        <div key={index} className="text-sm">
                                            <p className="font-medium text-white">
                                                {edu.degree} - {edu.field}
                                            </p>
                                            <p className="text-gray-400">
                                                {edu.school} ({edu.year})
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Skills */}
                        {cvData.skills.length > 0 && (
                            <div className="bg-gray-700/50 rounded-lg p-4">
                                <h4 className="text-lg font-semibold text-white mb-3">Yetenekler</h4>
                                <div className="flex flex-wrap gap-2">
                                    {cvData.skills.map((skill, index) => (
                                        <span
                                            key={index}
                                            className="px-3 py-1 text-sm bg-blue-600 text-white rounded-full"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Languages */}
                        {cvData.languages.length > 0 && (
                            <div className="bg-gray-700/50 rounded-lg p-4">
                                <h4 className="text-lg font-semibold text-white mb-3">Diller</h4>
                                <div className="flex flex-wrap gap-2">
                                    {cvData.languages.map((lang, index) => (
                                        <span
                                            key={index}
                                            className="px-3 py-1 text-sm bg-green-600 text-white rounded-full"
                                        >
                                            {lang}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
