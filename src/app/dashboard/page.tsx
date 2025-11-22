"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
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
            <nav className="bg-gray-800 border-b border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <h1 className="text-xl font-bold text-white">Personal Site Builder</h1>
                        <button
                            onClick={() => signOut({ callbackUrl: "/login" })}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition duration-200"
                        >
                            Sign Out
                        </button>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-700">
                    <h2 className="text-3xl font-bold text-white mb-4">
                        Welcome, {session.user?.name || session.user?.email}! 👋
                    </h2>
                    <p className="text-gray-300 mb-8">
                        This is your dashboard. Soon you'll be able to create your personal website here.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-gray-700 p-6 rounded-xl border border-gray-600">
                            <h3 className="text-lg font-semibold text-white mb-2">Upload CV</h3>
                            <p className="text-gray-400 text-sm">Coming soon...</p>
                        </div>
                        <div className="bg-gray-700 p-6 rounded-xl border border-gray-600">
                            <h3 className="text-lg font-semibold text-white mb-2">My Sites</h3>
                            <p className="text-gray-400 text-sm">Coming soon...</p>
                        </div>
                        <div className="bg-gray-700 p-6 rounded-xl border border-gray-600">
                            <h3 className="text-lg font-semibold text-white mb-2">Settings</h3>
                            <p className="text-gray-400 text-sm">Coming soon...</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
