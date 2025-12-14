"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

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
            alert("Yeni şifreler eşleşmiyor!");
            return;
        }

        if (newPassword.length < 6) {
            alert("Şifre en az 6 karakter olmalıdır!");
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
                alert(data.error || "Şifre güncellenirken bir hata oluştu");
                return;
            }

            // Başarılı
            alert("Şifreniz başarıyla güncellendi!");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (error) {
            console.error("Password update error:", error);
            alert("Bir hata oluştu. Lütfen tekrar deneyin.");
        } finally {
            setUpdatingPassword(false);
        }
    };

    const handleEmailUpdate = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !email.includes("@")) {
            alert("Geçerli bir e-posta adresi girin!");
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
                alert(data.error || "E-posta güncellenirken bir hata oluştu");
                return;
            }

            // Başarılı
            alert("Doğrulama e-postası gönderildi! Lütfen e-postanızı kontrol edin.");
        } catch (error) {
            console.error("Email update error:", error);
            alert("Bir hata oluştu. Lütfen tekrar deneyin.");
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

        if (deleteConfirmText !== "DELETE") {
            setDeleteError("Onaylamak için 'DELETE' yazmanız gerekiyor");
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
            alert("Hesabınız başarıyla silindi. Güle güle!");
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
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
                <h3 className="text-xl font-bold text-white mb-4">E-posta Güncelleme</h3>

                {/* Pending Email Notification */}
                {pendingEmail && (
                    <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-4 mb-4">
                        <div className="flex items-start gap-3">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 text-yellow-500 flex-shrink-0 mt-0.5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            <div className="flex-1">
                                <p className="text-sm font-semibold text-yellow-300 mb-1">
                                    ⏳ E-posta değişikliği beklemede
                                </p>
                                <p className="text-sm text-gray-300">
                                    Yeni e-posta: <span className="font-mono text-yellow-200">{pendingEmail}</span>
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
                            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="email@example.com"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={updatingEmail}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                    >
                        {updatingEmail ? "Güncelleniyor..." : "E-postayı Güncelle"}
                    </button>
                </form>
            </div>

            {/* Password Update */}
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
                <h3 className="text-xl font-bold text-white mb-4">Şifre Güncelleme</h3>
                <form onSubmit={handlePasswordUpdate} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Mevcut Şifre
                        </label>
                        <input
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Yeni Şifre
                        </label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="••••••••"
                            required
                            minLength={6}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Yeni Şifre (Tekrar)
                        </label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="••••••••"
                            required
                            minLength={6}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={updatingPassword}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                    >
                        {updatingPassword ? "Güncelleniyor..." : "Şifreyi Güncelle"}
                    </button>
                </form>
            </div>

            {/* Account Information */}
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
                <h3 className="text-xl font-bold text-white mb-6">Hesap Bilgileri</h3>

                {loadingUser ? (
                    <div className="space-y-3">
                        <div className="h-12 bg-gray-700 rounded-lg animate-pulse"></div>
                        <div className="h-12 bg-gray-700 rounded-lg animate-pulse"></div>
                        <div className="h-12 bg-gray-700 rounded-lg animate-pulse"></div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {/* Plan Type Badge */}
                        <div className="flex justify-between items-center py-3 border-b border-gray-700">
                            <div className="flex items-center gap-2">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 text-purple-400"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                                    />
                                </svg>
                                <span className="text-gray-400">Plan Tipi</span>
                            </div>
                            <div className="group relative">
                                <span
                                    className={`px-4 py-2 rounded-lg font-bold text-sm cursor-help transition-all ${session?.user?.planType === "PAID"
                                        ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/50"
                                        : "bg-gray-700 text-blue-400 border border-blue-500/50"
                                        }`}
                                >
                                    {session?.user?.planType === "PAID" ? "💎 PAID" : "🆓 FREE"}
                                </span>

                                {/* Tooltip */}
                                <div className="absolute right-0 top-full mt-2 w-72 bg-gray-900 border border-gray-700 rounded-lg p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 shadow-xl">
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
                        <div className="flex justify-between items-center py-3 border-b border-gray-700">
                            <div className="flex items-center gap-2">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 text-blue-400"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                    />
                                </svg>
                                <span className="text-gray-400">Kullanıcı Adı</span>
                            </div>
                            <span className="text-white font-medium">
                                {session?.user?.name || "Belirtilmemiş"}
                            </span>
                        </div>

                        {/* Email */}
                        <div className="flex justify-between items-center py-3 border-b border-gray-700">
                            <div className="flex items-center gap-2">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 text-green-400"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                    />
                                </svg>
                                <span className="text-gray-400">E-posta</span>
                            </div>
                            <span className="text-white font-medium">{session?.user?.email}</span>
                        </div>

                        {/* Created At */}
                        <div className="flex justify-between items-center py-3 border-b border-gray-700">
                            <div className="flex items-center gap-2">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 text-yellow-400"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                    />
                                </svg>
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
                        <div className="flex justify-between items-center py-3 border-b border-gray-700">
                            <div className="flex items-center gap-2">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 text-orange-400"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
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
                        <div className="flex justify-between items-center py-3 border-b border-gray-700">
                            <div className="flex items-center gap-2">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 text-pink-400"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                    />
                                </svg>
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
                            <div className="flex items-center gap-2">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 text-green-400"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                                <span className="text-gray-400">Hesap Durumu</span>
                            </div>
                            <span className="text-green-500 font-medium flex items-center gap-1">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                Aktif
                            </span>
                        </div>
                    </div>
                )}
            </div>

            {/* Danger Zone */}
            <div className="bg-red-900/20 border-2 border-red-700 rounded-xl p-6">
                <h3 className="text-xl font-bold text-red-500 mb-4 flex items-center gap-2">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                    </svg>
                    Tehlikeli Bölge
                </h3>
                <p className="text-gray-300 mb-6">
                    Hesabınızı sildiğinizde, tüm verileriniz kalıcı olarak silinecektir. Bu işlem geri
                    alınamaz.
                </p>
                <div className="bg-gray-800 rounded-lg p-4 mb-4">
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
                    className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
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
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                            </svg>
                            <span>Hesabımı Kalıcı Olarak Sil</span>
                        </>
                    )}
                </button>
            </div>

            {/* Delete Account Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-800 rounded-xl border-2 border-red-700 p-6 max-w-md w-full">
                        <div className="flex items-center gap-3 mb-4">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-8 w-8 text-red-500"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                />
                            </svg>
                            <h3 className="text-xl font-bold text-red-500">Hesabı Kalıcı Olarak Sil</h3>
                        </div>

                        <p className="text-gray-300 mb-4">
                            Bu işlem geri alınamaz! Hesabınız, tüm siteleriniz ve dosyalarınız kalıcı olarak silinecektir.
                        </p>

                        <div className="bg-red-900/20 border border-red-700 rounded-lg p-3 mb-4">
                            <p className="text-sm text-red-300 font-semibold">
                                ⚠️ Silinecek veriler:
                            </p>
                            <ul className="text-sm text-gray-300 mt-2 space-y-1 ml-4">
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
                                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                    placeholder="Şifrenizi girin"
                                    disabled={deleting}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Onaylamak için <span className="font-bold text-red-400">DELETE</span> yazın:
                                </label>
                                <input
                                    type="text"
                                    value={deleteConfirmText}
                                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 font-mono"
                                    placeholder="DELETE yazın"
                                    disabled={deleting}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" && !deleting) {
                                            confirmDeleteAccount();
                                        }
                                    }}
                                />
                            </div>

                            {deleteError && (
                                <p className="text-red-400 text-sm mt-2">{deleteError}</p>
                            )}
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={cancelDelete}
                                disabled={deleting}
                                className="flex-1 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                            >
                                İptal
                            </button>
                            <button
                                onClick={confirmDeleteAccount}
                                disabled={deleting}
                                className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
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
            )}
        </div>
    );
}
