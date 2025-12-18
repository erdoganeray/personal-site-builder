"use client";

import Link from "next/link";
import Image from "next/image";
import { signOut } from "next-auth/react";

interface DashboardMenuProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
    isCollapsed: boolean;
    onToggleCollapse: () => void;
    userName?: string;
    userImage?: string;
}

export default function DashboardMenu({
    activeTab,
    onTabChange,
    isCollapsed,
    onToggleCollapse,
    userName,
    userImage
}: DashboardMenuProps) {
    // Get full name and initials
    const fullName = userName || "Kullanıcı";
    const nameParts = userName?.split(" ") || [];
    const initials = nameParts.length >= 2
        ? `${nameParts[0]?.[0] || ""}${nameParts[nameParts.length - 1]?.[0] || ""}`.toUpperCase()
        : (nameParts[0]?.[0] || "U").toUpperCase();

    const menuItems = [
        {
            id: "overview",
            label: "Genel Bakış",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                </svg>
            ),
        },
        {
            id: "my-info",
            label: "Bilgiler",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            ),
        },
        {
            id: "my-site",
            label: "Sitem",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
            ),
        },
        {
            id: "subscriptions",
            label: "Faturalandırma",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
            ),
        },
        {
            id: "domain",
            label: "Site Yayınlama",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
            ),
        },
        {
            id: "settings",
            label: "Ayarlar",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            ),
        },
    ];

    const handleSignOut = () => {
        signOut({ callbackUrl: "/" });
    };

    return (
        <div className="relative bg-[#0a0a0a] h-screen flex flex-col border-r border-white/10 overflow-hidden">
            {/* Profile Section */}
            <div className="p-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                    {/* Profile Image - Always visible, size transitions */}
                    <div className={`rounded-full bg-gradient-to-br from-purple-500 to-blue-500 p-[2px] overflow-hidden flex-shrink-0 transition-all duration-300 ease-in-out ${isCollapsed ? 'w-10 h-10' : 'w-12 h-12'}`}>
                        {userImage ? (
                            <Image
                                src={userImage}
                                alt="Profile"
                                width={48}
                                height={48}
                                className="rounded-full object-cover w-full h-full"
                            />
                        ) : (
                            <div className={`w-full h-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center font-bold text-white rounded-full transition-all duration-300 ${isCollapsed ? 'text-sm' : 'text-lg'}`}>
                                {initials}
                            </div>
                        )}
                    </div>
                    {/* Text - Fades in/out with overflow hidden */}
                    <div className={`min-w-0 overflow-hidden transition-all duration-300 ease-in-out ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
                        <p className="text-sm text-gray-400 whitespace-nowrap">Merhaba,</p>
                        <p className="text-white font-semibold truncate whitespace-nowrap">{fullName}</p>
                    </div>
                </div>
            </div>

            {/* Menu Items */}
            <nav className="p-3 space-y-1 flex-1 overflow-y-auto overflow-x-hidden">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => onTabChange(item.id)}
                        className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 ease-in-out ${activeTab === item.id
                            ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/25"
                            : "text-gray-400 hover:bg-white/5 hover:text-white"
                            } ${isCollapsed ? 'justify-center px-0' : ''}`}
                        title={isCollapsed ? item.label : undefined}
                    >
                        <span className="flex-shrink-0">{item.icon}</span>
                        <span className={`font-medium whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
                            {item.label}
                        </span>
                    </button>
                ))}
            </nav>

            {/* Bottom Section */}
            <div className="p-3 border-t border-white/10 space-y-1 overflow-hidden">
                {/* Home Link */}
                <Link
                    href="/"
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition-all duration-300 ease-in-out ${isCollapsed ? 'justify-center px-0' : ''}`}
                    title={isCollapsed ? "Ana Sayfa" : undefined}
                >
                    <span className="flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                    </span>
                    <span className={`font-medium whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
                        Ana Sayfa
                    </span>
                </Link>

                {/* Editor Link */}
                <Link
                    href="/editor"
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition-all duration-300 ease-in-out ${isCollapsed ? 'justify-center px-0' : ''}`}
                    title={isCollapsed ? "Editor" : undefined}
                >
                    <span className="flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                    </span>
                    <span className={`font-medium whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
                        Editor
                    </span>
                </Link>

                {/* Sign Out Button */}
                <button
                    onClick={handleSignOut}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-300 ease-in-out ${isCollapsed ? 'justify-center px-0' : ''}`}
                    title={isCollapsed ? "Çıkış Yap" : undefined}
                >
                    <span className="flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                    </span>
                    <span className={`font-medium whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
                        Çıkış Yap
                    </span>
                </button>

                {/* Profilly Logo */}
                <div className="pt-4 pb-2">
                    <Link href="/" className={`flex items-center gap-2 group transition-all duration-300 ${isCollapsed ? 'justify-center' : ''}`}>
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform flex-shrink-0">
                            <span className="text-white font-bold text-lg">P</span>
                        </div>
                        <span className={`text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 group-hover:from-white group-hover:to-white whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
                            Profilly
                        </span>
                    </Link>
                </div>
            </div>

        </div>
    );
}
