"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // Get anonymous token from URL if present
    const anonymousToken = searchParams.get("token");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                setError("Geçersiz e-posta veya şifre");
                setLoading(false);
                return;
            }

            // If there's an anonymous token, merge the data
            if (anonymousToken) {
                try {
                    const mergeResponse = await fetch("/api/anonymous/merge", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ anonymousSessionToken: anonymousToken }),
                    });

                    if (mergeResponse.ok) {
                        console.log("Anonymous session merged successfully");
                        // Clear localStorage
                        if (typeof window !== 'undefined') {
                            localStorage.removeItem('profilly_anonymous_session');
                        }
                    }
                } catch (mergeError) {
                    console.error("Failed to merge anonymous session:", mergeError);
                    // Continue even if merge fails
                }
            }

            router.push("/dashboard");
            router.refresh();
        } catch (error) {
            setError("Bir hata oluştu. Lütfen tekrar deneyin.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] selection:bg-purple-500/30 flex items-center justify-center px-4 relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-purple-600/20 rounded-full blur-[120px] -z-10 animate-pulse" style={{ animationDuration: '4s' }} />
            <div className="absolute bottom-0 right-0 w-[600px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] -z-10" />

            <div className="w-full max-w-md animate-slide-up">
                {/* Back to Home Link */}
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm font-medium">Ana Sayfaya Dön</span>
                </Link>

                {/* Login Card */}
                <div className="bg-[#1a1a1a]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl shadow-purple-500/5 relative overflow-hidden">
                    {/* Decorative Elements */}
                    <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

                    {/* Logo and Title */}
                    <div className="text-center mb-8 relative z-10">
                        <div className="flex justify-center mb-4">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-blue-600 flex items-center justify-center shadow-lg shadow-purple-500/25">
                                <span className="text-white font-bold text-2xl">P</span>
                            </div>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                            Tekrar Hoş Geldiniz
                        </h1>
                        <p className="text-gray-400 text-sm">
                            Hesabınıza giriş yapın ve devam edin
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm backdrop-blur-sm animate-fade-in">
                            {error}
                        </div>
                    )}

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                                E-posta
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                                placeholder="ornek@email.com"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                                Şifre
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 disabled:from-purple-800 disabled:to-blue-800 disabled:cursor-not-allowed text-white font-semibold py-3.5 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Giriş yapılıyor...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-5 h-5" />
                                    Giriş Yap
                                </>
                            )}
                        </button>
                    </form>

                    {/* Sign Up Link */}
                    <p className="mt-8 text-center text-gray-400 text-sm relative z-10">
                        Hesabınız yok mu?{" "}
                        <Link href="/register" className="text-purple-400 hover:text-purple-300 font-semibold transition-colors">
                            Ücretsiz Kayıt Ol
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
