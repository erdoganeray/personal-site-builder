"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";

export default function Settings() {
    const { data: session } = useSession();
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [email, setEmail] = useState(session?.user?.email || "");
    const [updatingPassword, setUpdatingPassword] = useState(false);
    const [updatingEmail, setUpdatingEmail] = useState(false);
    const [deleting, setDeleting] = useState(false);

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
            // API endpoint'i gelecekte eklenecek
            await new Promise((resolve) => setTimeout(resolve, 1000));
            alert("Şifre güncelleme özelliği yakında eklenecek!");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (error) {
            alert("Bir hata oluştu");
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
            // API endpoint'i gelecekte eklenecek
            await new Promise((resolve) => setTimeout(resolve, 1000));
            alert("E-posta güncelleme özelliği yakında eklenecek!");
        } catch (error) {
            alert("Bir hata oluştu");
        } finally {
            setUpdatingEmail(false);
        }
    };

    const handleDeleteAccount = async () => {
        const confirmed = confirm(
            "Hesabınızı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz ve tüm verileriniz silinecektir."
        );

        if (!confirmed) return;

        const doubleConfirm = confirm(
            "SON UYARI: Hesabınız, siteniz ve tüm verileriniz kalıcı olarak silinecek. Devam etmek istediğinizden emin misiniz?"
        );

        if (!doubleConfirm) return;

        setDeleting(true);
        try {
            // API endpoint'i gelecekte eklenecek
            await new Promise((resolve) => setTimeout(resolve, 1000));
            alert("Hesap silme özelliği yakında eklenecek!");
        } catch (error) {
            alert("Bir hata oluştu");
        } finally {
            setDeleting(false);
        }
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
                <h3 className="text-xl font-bold text-white mb-4">Hesap Bilgileri</h3>
                <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-gray-700">
                        <span className="text-gray-400">Kullanıcı Adı</span>
                        <span className="text-white font-medium">
                            {session?.user?.name || "Belirtilmemiş"}
                        </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-700">
                        <span className="text-gray-400">E-posta</span>
                        <span className="text-white font-medium">{session?.user?.email}</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                        <span className="text-gray-400">Hesap Durumu</span>
                        <span className="text-green-500 font-medium">Aktif</span>
                    </div>
                </div>
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
        </div>
    );
}
