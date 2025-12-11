"use client";

import { useState, useEffect } from "react";
import type { CVPortfolioItem } from "@/lib/gemini-pdf-parser";

interface PortfolioMetadataEditorProps {
    item: CVPortfolioItem;
    index: number;
    onSave: (index: number, updatedItem: CVPortfolioItem) => void;
    onCancel: () => void;
}

export default function PortfolioMetadataEditor({
    item,
    index,
    onSave,
    onCancel
}: PortfolioMetadataEditorProps) {
    const [title, setTitle] = useState(item.title || "");
    const [description, setDescription] = useState(item.description || "");
    const [category, setCategory] = useState(item.category || "");
    const [projectUrl, setProjectUrl] = useState(item.projectUrl || "");
    const [tags, setTags] = useState<string[]>(item.tags || []);
    const [newTag, setNewTag] = useState("");
    const [urlError, setUrlError] = useState("");

    const handleAddTag = () => {
        const trimmedTag = newTag.trim();
        if (trimmedTag && !tags.includes(trimmedTag) && tags.length < 10) {
            setTags([...tags, trimmedTag]);
            setNewTag("");
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    const validateUrl = (url: string): boolean => {
        if (!url.trim()) return true; // Empty URL is valid (optional field)

        try {
            const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
            return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
        } catch {
            return false;
        }
    };

    const handleSave = () => {
        // Validate URL if provided
        if (projectUrl.trim() && !validateUrl(projectUrl.trim())) {
            setUrlError("Geçerli bir URL girin (örn: https://example.com)");
            return;
        }

        setUrlError("");

        const updatedItem: CVPortfolioItem = {
            imageUrl: item.imageUrl,
            ...(title.trim() && { title: title.trim() }),
            ...(description.trim() && { description: description.trim() }),
            ...(category.trim() && { category: category.trim() }),
            ...(projectUrl.trim() && { projectUrl: projectUrl.trim() }),
            ...(tags.length > 0 && { tags })
        };

        onSave(index, updatedItem);
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-xl border border-gray-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 space-y-4">
                    {/* Header */}
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-bold text-white">Portfolio Detaylarını Düzenle</h3>
                        <button
                            onClick={onCancel}
                            className="text-gray-400 hover:text-gray-300"
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Image Preview */}
                    <div className="flex justify-center">
                        <img
                            src={item.imageUrl}
                            alt="Portfolio item"
                            className="max-h-48 rounded-lg object-contain"
                        />
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-4">
                        {/* Title */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                Başlık <span className="text-gray-500">(opsiyonel)</span>
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                maxLength={200}
                                placeholder="Proje başlığı"
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <p className="text-xs text-gray-400 mt-1">{title.length}/200 karakter</p>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                Açıklama <span className="text-gray-500">(opsiyonel)</span>
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                maxLength={1000}
                                rows={4}
                                placeholder="Proje hakkında detaylı açıklama"
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                            />
                            <p className="text-xs text-gray-400 mt-1">{description.length}/1000 karakter</p>
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                Kategori <span className="text-gray-500">(opsiyonel)</span>
                            </label>
                            <input
                                type="text"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                maxLength={100}
                                placeholder="Örn: Web Design, Mobile App, Photography"
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <p className="text-xs text-gray-400 mt-1">{category.length}/100 karakter</p>
                        </div>

                        {/* Project URL */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                Proje URL <span className="text-gray-500">(opsiyonel)</span>
                            </label>
                            <input
                                type="url"
                                value={projectUrl}
                                onChange={(e) => {
                                    setProjectUrl(e.target.value);
                                    setUrlError(""); // Clear error on change
                                }}
                                placeholder="https://example.com/project"
                                className={`w-full px-3 py-2 bg-gray-700 border ${urlError ? 'border-red-500' : 'border-gray-600'} text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                            />
                            {urlError ? (
                                <p className="text-xs text-red-400 mt-1">{urlError}</p>
                            ) : (
                                <p className="text-xs text-gray-400 mt-1">Canlı proje veya GitHub linki</p>
                            )}
                        </div>

                        {/* Tags */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                Etiketler <span className="text-gray-500">(opsiyonel, maksimum 10)</span>
                            </label>

                            {/* Tag Input */}
                            <div className="flex gap-2 mb-2">
                                <input
                                    type="text"
                                    value={newTag}
                                    onChange={(e) => setNewTag(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                                    maxLength={50}
                                    placeholder="Etiket ekle (Enter ile)"
                                    disabled={tags.length >= 10}
                                    className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                                />
                                <button
                                    onClick={handleAddTag}
                                    disabled={!newTag.trim() || tags.length >= 10}
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                                >
                                    Ekle
                                </button>
                            </div>

                            {/* Tag List */}
                            {tags.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {tags.map((tag, idx) => (
                                        <span
                                            key={idx}
                                            className="inline-flex items-center gap-1 px-3 py-1 bg-blue-600/20 border border-blue-500/30 text-blue-300 rounded-full text-sm"
                                        >
                                            {tag}
                                            <button
                                                onClick={() => handleRemoveTag(tag)}
                                                className="hover:text-blue-100"
                                            >
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            )}
                            <p className="text-xs text-gray-400 mt-1">{tags.length}/10 etiket</p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-700">
                        <button
                            onClick={onCancel}
                            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                        >
                            İptal
                        </button>
                        <button
                            onClick={handleSave}
                            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                        >
                            Kaydet
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
