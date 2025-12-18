"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/Toast";
import PasswordStrengthMeter from "@/components/ui/PasswordStrengthMeter";
import {
    Mail,
    Lock,
    User,
    Calendar,
    Clock,
    Pencil,
    Shield,
    Sparkles,
    Trash2,
    AlertTriangle,
    CheckCircle
} from "lucide-react";

export default function Settings() {
    const { data: session } = useSession();
    const router = useRouter();
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [email, setEmail] = useState(session?.user?.email || "");
    const [updatingPassword, setUpdatingPassword] = useState(false);
    const [updatingEmail, setUpdatingEmail] = useState(false);
    const [deleting, setDeleting] = useState(false);

    // User data state
    const [pendingEmail, setPendingEmail] = useState<string | null>(null);
    const [loadingUser, setLoadingUser] = useState(true);

    // Delete account modal state
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deletePassword, setDeletePassword] = useState("");
    const [deleteConfirmText, setDeleteConfirmText] = useState("");
    const [deleteError, setDeleteError] = useState("");

    // Fetch user data for pending email
    useEffect(() => {
        const fetchUserData = async () => {
            if (!session?.user?.id) return;

            try {
                const response = await fetch('/api/user/me');
                if (response.ok) {
                    const data = await response.json();
                    setPendingEmail(data.pendingEmail);
                }
            } catch (error) {
                console.error('Failed to fetch user data:', error);
            } finally {
                setLoadingUser(false);
            }
        };

        fetchUserData();
    }, [session?.user?.id]);

    const handlePasswordUpdate = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            toast.error("Yeni şifreler eşleşmiyor!");
            return;
        }

        if (newPassword.length < 6) {
            toast.error("Şifre en az 6 karakter olmalıdır!");
            return;
        }

        setUpdatingPassword(true);
        try {
            const response = await fetch("/api/user/update-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    currentPassword,
                    newPassword,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                toast.error(data.error || "Şifre güncellenirken bir hata oluştu");
                return;
            }

            // Başarılı
            toast.success("Şifreniz başarıyla güncellendi!");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (error) {
            console.error("Password update error:", error);
            toast.error("Bir hata oluştu. Lütfen tekrar deneyin.");
        } finally {
            setUpdatingPassword(false);
        }
    };

    const handleEmailUpdate = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !email.includes("@")) {
            toast.error("Geçerli bir e-posta adresi girin!");
            return;
        }

        setUpdatingEmail(true);
        try {
            const response = await fetch("/api/user/update-email", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ newEmail: email }),
            });

            const data = await response.json();

            if (!response.ok) {
                toast.error(data.error || "E-posta güncellenirken bir hata oluştu");
                return;
            }

            // Başarılı
            toast.success("Doğrulama e-postası gönderildi! Lütfen e-postanızı kontrol edin.");
        } catch (error) {
            console.error("Email update error:", error);
            toast.error("Bir hata oluştu. Lütfen tekrar deneyin.");
        } finally {
            setUpdatingEmail(false);
        }
    };

    const handleDeleteAccount = () => {
        setShowDeleteModal(true);
        setDeletePassword("");
        setDeleteConfirmText("");
        setDeleteError("");
    };

    const confirmDeleteAccount = async () => {
        if (!deletePassword) {
            setDeleteError("Şifrenizi girmeniz gerekiyor");
            return;
        }

        if (deleteConfirmText !== "HESABI SİL") {
            setDeleteError("Onaylamak için 'HESABI SİL' yazmanız gerekiyor");
            return;
        }

        setDeleting(true);
        setDeleteError("");

        try {
            const response = await fetch("/api/user/delete-account", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ password: deletePassword }),
            });

            const data = await response.json();

            if (!response.ok) {
                setDeleteError(data.error || "Hesap silinirken bir hata oluştu");
                setDeleting(false);
                return;
            }

            // Success - sign out and redirect
            toast.success("Hesabınız başarıyla silindi. Güle güle!");
            await signOut({ redirect: false });
            router.push("/login");
        } catch (error) {
            console.error("Delete account error:", error);
            setDeleteError("Bir hata oluştu. Lütfen tekrar deneyin.");
            setDeleting(false);
        }
    };

    const cancelDelete = () => {
        setShowDeleteModal(false);
        setDeletePassword("");
        setDeleteConfirmText("");
        setDeleteError("");
        setDeleting(false);
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-white mb-2">Ayarlar</h2>
                <p className="text-gray-400">
                    Hesap ayarlarınızı yönetin ve güvenlik bilgilerinizi güncelleyin
                </p>
            </div>

            {/* Email Update */}
            <div className="relative bg-[#1a1a1a]/60 backdrop-blur-xl rounded-2xl border border-white/10 p-6 overflow-hidden">
                {/* Background Gradient Effects */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/10 rounded-full blur-[60px] -mr-24 -mt-24" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full blur-[40px] -ml-16 -mb-16" />

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center border border-white/5">
                            <Mail className="w-5 h-5 text-purple-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white">E-posta Güncelleme</h3>
                    </div>

                    {/* Pending Email Notification */}
                    {pendingEmail && (
                        <div className="relative bg-amber-500/10 backdrop-blur-xl border border-amber-500/30 rounded-xl p-4 mb-4 overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-[30px] -mr-12 -mt-12" />
                            <div className="flex items-start gap-3 relative z-10">
                                <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center border border-amber-500/30 flex-shrink-0">
                                    <Clock className="w-5 h-5 text-amber-400" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-semibold text-amber-300 mb-1">
                                        E-posta değişikliği beklemede
                                    </p>
                                    <p className="text-sm text-gray-300">
                                        Yeni e-posta: <span className="font-mono text-amber-200">{pendingEmail}</span>
                                    </p>
                                    <p className="text-xs text-gray-400 mt-2">
                                        Lütfen e-postanızı kontrol edin ve doğrulama linkine tıklayın.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleEmailUpdate} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                E-posta Adresi
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 bg-[#0f0f0f]/80 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/30 transition-all duration-300 placeholder:text-gray-500"
                                placeholder="email@example.com"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={updatingEmail}
                            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 flex items-center justify-center gap-2"
                        >
                            {updatingEmail ? (
                                <>
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    <span>Güncelleniyor...</span>
                                </>
                            ) : (
                                <>
                                    <Mail className="w-5 h-5" />
                                    <span>E-postayı Güncelle</span>
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>

            {/* Password Update */}
            <div className="relative bg-[#1a1a1a]/60 backdrop-blur-xl rounded-2xl border border-white/10 p-6 overflow-hidden">
                {/* Background Gradient Effects */}
                <div className="absolute top-0 left-0 w-48 h-48 bg-blue-500/10 rounded-full blur-[60px] -ml-24 -mt-24" />
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-[40px] -mr-16 -mb-16" />

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center border border-white/5">
                            <Lock className="w-5 h-5 text-blue-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white">Şifre Güncelleme</h3>
                    </div>

                    <form onSubmit={handlePasswordUpdate} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Mevcut Şifre
                            </label>
                            <input
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-[#0f0f0f]/80 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/30 transition-all duration-300 placeholder:text-gray-500"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Yeni Şifre <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-[#0f0f0f]/80 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/30 transition-all duration-300 placeholder:text-gray-500"
                                placeholder="••••••••"
                                required
                                minLength={6}
                            />
                            <PasswordStrengthMeter password={newPassword} showRequirements={false} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Yeni Şifre (Tekrar) <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className={`w-full px-4 py-3 bg-[#0f0f0f]/80 border text-white rounded-xl focus:ring-2 focus:ring-purple-500/50 transition-all duration-300 placeholder:text-gray-500 ${confirmPassword && newPassword !== confirmPassword
                                    ? 'border-red-500/50'
                                    : confirmPassword && newPassword === confirmPassword
                                        ? 'border-green-500/50'
                                        : 'border-white/10'
                                    }`}
                                placeholder="••••••••"
                                required
                                minLength={6}
                            />
                            {confirmPassword && newPassword !== confirmPassword && (
                                <p className="text-xs text-red-400 mt-2 flex items-center gap-1">
                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                    Şifreler eşleşmiyor
                                </p>
                            )}
                            {confirmPassword && newPassword === confirmPassword && (
                                <p className="text-xs text-green-400 mt-2 flex items-center gap-1">
                                    <CheckCircle className="w-3 h-3" />
                                    Şifreler eşleşiyor
                                </p>
                            )}
                        </div>
                        <button
                            type="submit"
                            disabled={updatingPassword}
                            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 flex items-center justify-center gap-2"
                        >
                            {updatingPassword ? (
                                <>
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    <span>Güncelleniyor...</span>
                                </>
                            ) : (
                                <>
                                    <Lock className="w-5 h-5" />
                                    <span>Şifreyi Güncelle</span>
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>

            {/* Account Information */}
            <div className="relative bg-[#1a1a1a]/60 backdrop-blur-xl rounded-2xl border border-white/10 p-6 overflow-hidden">
                {/* Background Gradient Effects */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-[80px] -mr-32 -mt-32" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/5 rounded-full blur-[60px] -ml-24 -mb-24" />

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center border border-white/5">
                            <Shield className="w-5 h-5 text-purple-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white">Hesap Bilgileri</h3>
                    </div>

                    {loadingUser ? (
                        <div className="space-y-3">
                            <div className="h-12 bg-white/5 rounded-xl animate-pulse"></div>
                            <div className="h-12 bg-white/5 rounded-xl animate-pulse"></div>
                            <div className="h-12 bg-white/5 rounded-xl animate-pulse"></div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {/* Plan Type Badge */}
                            <div className="flex justify-between items-center py-3 border-b border-white/5">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center border border-white/5">
                                        <Sparkles className="w-4 h-4 text-purple-400" />
                                    </div>
                                    <span className="text-gray-400">Plan Tipi</span>
                                </div>
                                <div className="group relative">
                                    <span
                                        className={`px-4 py-2 rounded-xl font-bold text-sm cursor-help transition-all ${session?.user?.planType === "PAID"
                                            ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/50"
                                            : "bg-white/5 text-blue-400 border border-blue-500/30"
                                            }`}
                                    >
                                        {session?.user?.planType === "PAID" ? "💎 PAID" : "🆓 FREE"}
                                    </span>

                                    {/* Tooltip */}
                                    <div className="absolute right-0 top-full mt-2 w-72 bg-[#1a1a1a]/95 backdrop-blur-xl border border-white/10 rounded-xl p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 shadow-xl">
                                        <p className="text-sm font-semibold text-white mb-2">
                                            {session?.user?.planType === "PAID" ? "Ücretli Plan" : "Ücretsiz Plan"}
                                        </p>
                                        <div className="space-y-1 text-xs text-gray-300">
                                            <div className="flex justify-between">
                                                <span>Aylık Düzenleme:</span>
                                                <span className="font-semibold text-white">
                                                    {session?.user?.planType === "PAID" ? "20" : "5"}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Storage:</span>
                                                <span className="font-semibold text-white">
                                                    {session?.user?.planType === "PAID" ? "1 GB" : "100 MB"}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Domain Rezervasyon:</span>
                                                <span className="font-semibold text-white">
                                                    {session?.user?.planType === "PAID" ? "30 gün" : "7 gün"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* User Name */}
                            <div className="flex justify-between items-center py-3 border-b border-white/5">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center border border-white/5">
                                        <User className="w-4 h-4 text-blue-400" />
                                    </div>
                                    <span className="text-gray-400">Kullanıcı Adı</span>
                                </div>
                                <span className="text-white font-medium">
                                    {session?.user?.name || "Belirtilmemiş"}
                                </span>
                            </div>

                            {/* Email */}
                            <div className="flex justify-between items-center py-3 border-b border-white/5">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center border border-white/5">
                                        <Mail className="w-4 h-4 text-green-400" />
                                    </div>
                                    <span className="text-gray-400">E-posta</span>
                                </div>
                                <span className="text-white font-medium">{session?.user?.email}</span>
                            </div>

                            {/* Created At */}
                            <div className="flex justify-between items-center py-3 border-b border-white/5">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-500/20 to-orange-500/20 flex items-center justify-center border border-white/5">
                                        <Calendar className="w-4 h-4 text-yellow-400" />
                                    </div>
                                    <span className="text-gray-400">Hesap Oluşturma</span>
                                </div>
                                <span className="text-white font-medium">
                                    {session?.user?.createdAt
                                        ? new Date(session.user.createdAt).toLocaleDateString("tr-TR", {
                                            day: "numeric",
                                            month: "long",
                                            year: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })
                                        : "Bilinmiyor"}
                                </span>
                            </div>

                            {/* Updated At */}
                            <div className="flex justify-between items-center py-3 border-b border-white/5">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center border border-white/5">
                                        <Clock className="w-4 h-4 text-orange-400" />
                                    </div>
                                    <span className="text-gray-400">Son Güncelleme</span>
                                </div>
                                <span className="text-white font-medium">
                                    {session?.user?.updatedAt
                                        ? new Date(session.user.updatedAt).toLocaleDateString("tr-TR", {
                                            day: "numeric",
                                            month: "long",
                                            year: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })
                                        : "Bilinmiyor"}
                                </span>
                            </div>

                            {/* Monthly Edits */}
                            <div className="flex justify-between items-center py-3 border-b border-white/5">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500/20 to-rose-500/20 flex items-center justify-center border border-white/5">
                                        <Pencil className="w-4 h-4 text-pink-400" />
                                    </div>
                                    <span className="text-gray-400">Aylık Düzenleme Hakkı</span>
                                </div>
                                <span className="text-white font-medium">
                                    {(() => {
                                        const limit = session?.user?.planType === "PAID" ? 20 : 5;
                                        const used = session?.user?.editsThisMonth || 0;
                                        const remaining = limit - used;
                                        return `${remaining} / ${limit}`;
                                    })()}
                                </span>
                            </div>

                            {/* Account Status */}
                            <div className="flex justify-between items-center py-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center border border-white/5">
                                        <CheckCircle className="w-4 h-4 text-green-400" />
                                    </div>
                                    <span className="text-gray-400">Hesap Durumu</span>
                                </div>
                                <span className="text-green-400 font-medium flex items-center gap-2">
                                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                    Aktif
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Danger Zone */}
            <div className="relative bg-red-500/10 backdrop-blur-xl rounded-2xl border-2 border-red-500/30 p-6 overflow-hidden">
                {/* Background Gradient Effects */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-red-500/10 rounded-full blur-[60px] -mr-24 -mt-24" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-red-500/5 rounded-full blur-[40px] -ml-16 -mb-16" />

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center border border-red-500/30">
                            <AlertTriangle className="w-5 h-5 text-red-400" />
                        </div>
                        <h3 className="text-xl font-bold text-red-400">Tehlikeli Bölge</h3>
                    </div>

                    <p className="text-gray-300 mb-6">
                        Hesabınızı sildiğinizde, tüm verileriniz kalıcı olarak silinecektir. Bu işlem geri
                        alınamaz.
                    </p>

                    <div className="bg-[#0f0f0f]/60 rounded-xl p-4 mb-4 border border-white/5">
                        <h4 className="text-white font-semibold mb-2">Silinecek Veriler:</h4>
                        <ul className="space-y-1 text-sm text-gray-300">
                            <li className="flex items-center gap-2">
                                <span className="text-red-500">•</span> Hesap bilgileriniz
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-red-500">•</span> Yüklediğiniz CV
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-red-500">•</span> Oluşturduğunuz siteler
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-red-500">•</span> Abonelik bilgileriniz
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-red-500">•</span> Tüm diğer verileriniz
                            </li>
                        </ul>
                    </div>

                    <button
                        onClick={handleDeleteAccount}
                        disabled={deleting}
                        className="w-full bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 hover:border-red-500/50 disabled:opacity-50 text-red-400 hover:text-red-300 font-bold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
                    >
                        {deleting ? (
                            <>
                                <svg
                                    className="animate-spin h-5 w-5"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                </svg>
                                <span>Siliniyor...</span>
                            </>
                        ) : (
                            <>
                                <Trash2 className="w-5 h-5" />
                                <span>Hesabımı Kalıcı Olarak Sil</span>
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Delete Account Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="relative bg-[#1a1a1a]/95 backdrop-blur-xl rounded-2xl border-2 border-red-500/30 p-6 max-w-md w-full overflow-hidden">
                        {/* Background Gradient Effects */}
                        <div className="absolute top-0 right-0 w-48 h-48 bg-red-500/10 rounded-full blur-[60px] -mr-24 -mt-24" />
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-red-500/5 rounded-full blur-[40px] -ml-16 -mb-16" />

                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center border border-red-500/30">
                                    <AlertTriangle className="w-5 h-5 text-red-400" />
                                </div>
                                <h3 className="text-xl font-bold text-red-400">Hesabı Kalıcı Olarak Sil</h3>
                            </div>

                            <p className="text-gray-300 mb-4">
                                Bu işlem geri alınamaz! Hesabınız, tüm siteleriniz ve dosyalarınız kalıcı olarak silinecektir.
                            </p>

                            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-4">
                                <p className="text-sm text-red-300 font-semibold flex items-center gap-2">
                                    <AlertTriangle className="w-4 h-4" />
                                    Silinecek veriler:
                                </p>
                                <ul className="text-sm text-gray-300 mt-2 space-y-1 ml-6">
                                    <li>• Tüm site bilgileriniz</li>
                                    <li>• Yüklediğiniz CV ve görseller</li>
                                    <li>• Abonelik ve domain bilgileri</li>
                                </ul>
                            </div>

                            <div className="space-y-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Devam etmek için şifrenizi girin:
                                    </label>
                                    <input
                                        type="password"
                                        value={deletePassword}
                                        onChange={(e) => setDeletePassword(e.target.value)}
                                        className="w-full px-4 py-3 bg-[#0f0f0f]/80 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-red-500/50 focus:border-red-500/30 transition-all duration-300 placeholder:text-gray-500"
                                        placeholder="Şifrenizi girin"
                                        disabled={deleting}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Onaylamak için <span className="font-bold text-red-400">HESABI SİL</span> yazın:
                                    </label>
                                    <input
                                        type="text"
                                        value={deleteConfirmText}
                                        onChange={(e) => setDeleteConfirmText(e.target.value)}
                                        className="w-full px-4 py-3 bg-[#0f0f0f]/80 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-red-500/50 focus:border-red-500/30 transition-all duration-300 font-mono placeholder:text-gray-500"
                                        placeholder="HESABI SİL yazın"
                                        disabled={deleting}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter" && !deleting) {
                                                confirmDeleteAccount();
                                            }
                                        }}
                                    />
                                </div>

                                {deleteError && (
                                    <p className="text-red-400 text-sm flex items-center gap-2">
                                        <AlertTriangle className="w-4 h-4" />
                                        {deleteError}
                                    </p>
                                )}
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={cancelDelete}
                                    disabled={deleting}
                                    className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 disabled:opacity-50 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200"
                                >
                                    İptal
                                </button>
                                <button
                                    onClick={confirmDeleteAccount}
                                    disabled={deleting}
                                    className="flex-1 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 hover:border-red-500/50 disabled:opacity-50 text-red-400 hover:text-red-300 font-bold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
                                >
                                    {deleting ? (
                                        <>
                                            <svg
                                                className="animate-spin h-5 w-5"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <circle
                                                    className="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                ></circle>
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                ></path>
                                            </svg>
                                            <span>Siliniyor...</span>
                                        </>
                                    ) : (
                                        "Hesabı Sil"
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
