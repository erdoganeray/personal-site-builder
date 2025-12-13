'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';

export default function VerifyEmailPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const token = searchParams.get('token');

        if (!token) {
            setStatus('error');
            setMessage('Geçersiz doğrulama linki');
            return;
        }

        verifyEmail(token);
    }, [searchParams]);

    const verifyEmail = async (token: string) => {
        try {
            const response = await fetch(`/api/user/verify-email?token=${token}`);
            const data = await response.json();

            if (response.ok) {
                setStatus('success');
                setMessage('E-posta adresiniz başarıyla güncellendi! Yeni e-postanız ile giriş yapın.');

                // Logout to refresh session with new email
                setTimeout(async () => {
                    await signOut({ redirect: false });
                    router.push('/login');
                }, 3000);
            } else {
                setStatus('error');
                setMessage(data.error || 'Doğrulama başarısız');
            }
        } catch (error) {
            setStatus('error');
            setMessage('Bir hata oluştu');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-8 max-w-md w-full text-center">
                {status === 'verifying' && (
                    <>
                        <div className="flex justify-center mb-6">
                            <svg
                                className="animate-spin h-16 w-16 text-blue-500"
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
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">E-posta Doğrulanıyor...</h2>
                        <p className="text-gray-400">Lütfen bekleyin</p>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <div className="flex justify-center mb-6">
                            <div className="bg-green-500/20 rounded-full p-6">
                                <svg
                                    className="h-16 w-16 text-green-500"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Başarılı!</h2>
                        <p className="text-gray-300 mb-4">{message}</p>
                        <p className="text-sm text-gray-400">Giriş sayfasına yönlendiriliyorsunuz...</p>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <div className="flex justify-center mb-6">
                            <div className="bg-red-500/20 rounded-full p-6">
                                <svg
                                    className="h-16 w-16 text-red-500"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Doğrulama Başarısız</h2>
                        <p className="text-gray-300 mb-6">{message}</p>
                        <button
                            onClick={() => router.push('/dashboard')}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
                        >
                            Dashboard'a Dön
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
