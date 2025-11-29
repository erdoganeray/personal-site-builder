"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function EditorPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        }
    }, [status, router]);

    if (status === "loading") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
                <div className="text-white text-xl">Loading...</div>
            </div>
        );
    }

    if (!session) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            {/* Navigation */}
            <nav className="bg-gray-800 border-b border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                            SiteBuilder AI
                        </Link>
                        <div className="flex items-center gap-4">
                            <Link
                                href="/"
                                className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                            >
                                Ana Sayfa
                            </Link>
                            <Link
                                href="/dashboard"
                                className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                            >
                                Dashboard
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex flex-col items-center justify-center min-h-[70vh]">
                    <div className="bg-gray-800 rounded-2xl shadow-2xl p-12 border border-gray-700 text-center max-w-2xl">
                        {/* Icon */}
                        <div className="flex justify-center mb-6">
                            <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 rounded-full">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-16 w-16 text-white"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                                    />
                                </svg>
                            </div>
                        </div>

                        {/* Title */}
                        <h1 className="text-4xl font-bold text-white mb-4">
                            Site Editörü
                        </h1>

                        {/* Description */}
                        <p className="text-xl text-gray-300 mb-8">
                            Geliştiriliyor...
                        </p>

                        <p className="text-gray-400 mb-8">
                            Site editörü özelliği yakında kullanıma sunulacak. Bu özellikle sitenizi 
                            görsel olarak düzenleyebilecek ve özelleştirebileceksiniz.
                        </p>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/"
                                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                            >
                                Ana Sayfa
                            </Link>
                            <Link
                                href="/dashboard"
                                className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors duration-200"
                            >
                                Dashboard'a Dön
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
