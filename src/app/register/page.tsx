"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import PasswordStrengthMeter, { isPasswordStrong } from "@/components/ui/PasswordStrengthMeter";
import { ArrowLeft, Sparkles, UserPlus } from "lucide-react";

export default function RegisterPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [name, setName] = useState("");
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
            const response = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                    anonymousSessionToken: anonymousToken || undefined
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "Kayıt başarısız oldu");
                return;
            }

            // Clear anonymous session from localStorage
            if (anonymousToken && typeof window !== 'undefined') {
                localStorage.removeItem('profilly_anonymous_session');
            }

            // Redirect to login after successful registration
            router.push("/login?registered=true");
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

                {/* Register Card */}
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
                            Hesap Oluşturun
                        </h1>
                        <p className="text-gray-400 text-sm">
                            Ücretsiz başlayın, kredi kartı gerektirmez
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm backdrop-blur-sm animate-fade-in">
                            {error}
                        </div>
                    )}

                    {/* Register Form */}
                    <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                                İsim <span className="text-gray-500 text-xs">(Opsiyonel)</span>
                            </label>
                            <input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                                placeholder="Adınız Soyadınız"
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                                E-posta <span className="text-purple-400">*</span>
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
                                Şifre <span className="text-purple-400">*</span>
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                                className="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                                placeholder="En az 6 karakter"
                            />
                            <PasswordStrengthMeter password={password} />
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !isPasswordStrong(password)}
                            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 disabled:from-purple-800 disabled:to-blue-800 disabled:cursor-not-allowed text-white font-semibold py-3.5 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2 disabled:opacity-60"
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Hesap oluşturuluyor...
                                </>
                            ) : (
                                <>
                                    <UserPlus className="w-5 h-5" />
                                    Ücretsiz Hesap Oluştur
                                </>
                            )}
                        </button>
                        {password && !isPasswordStrong(password) && (
                            <p className="text-xs text-amber-400/80 text-center mt-2">
                                Kayıt olabilmek için şifreniz en az "Güçlü" seviyesinde olmalıdır.
                            </p>
                        )}
                    </form>

                    {/* Sign In Link */}
                    <p className="mt-8 text-center text-gray-400 text-sm relative z-10">
                        Zaten hesabınız var mı?{" "}
                        <Link href="/login" className="text-purple-400 hover:text-purple-300 font-semibold transition-colors">
                            Giriş Yap
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
