"use client";

export default function DomainManagement() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-white mb-2">Domain Yönetimi</h2>
                <p className="text-gray-400">
                    Özel domain bağlama ve yönetim işlemlerinizi buradan gerçekleştirebilirsiniz
                </p>
            </div>

            {/* Coming Soon Card */}
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-12 text-center">
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
                                d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                            />
                        </svg>
                    </div>
                </div>

                <h3 className="text-3xl font-bold text-white mb-4">Domain Yönetimi</h3>
                <p className="text-xl text-gray-300 mb-6">Geliştiriliyor...</p>
                <p className="text-gray-400 max-w-2xl mx-auto mb-8">
                    Yakında kendi domain adınızı sitenize bağlayabilecek ve domain yönetimi
                    yapabileceksiniz. Bu özellik üzerinde aktif olarak çalışıyoruz.
                </p>

                {/* Features List */}
                <div className="bg-gray-700/50 rounded-lg p-6 max-w-2xl mx-auto text-left">
                    <h4 className="text-lg font-semibold text-white mb-4 text-center">
                        Yakında Gelen Özellikler
                    </h4>
                    <ul className="space-y-3">
                        <li className="flex items-start gap-3 text-gray-300">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 text-blue-400 flex-shrink-0"
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
                            <div>
                                <p className="font-medium text-white">Özel Domain Bağlama</p>
                                <p className="text-sm text-gray-400">
                                    Kendi domain adınızı sitenize bağlayın
                                </p>
                            </div>
                        </li>
                        <li className="flex items-start gap-3 text-gray-300">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 text-blue-400 flex-shrink-0"
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
                            <div>
                                <p className="font-medium text-white">SSL Sertifikası</p>
                                <p className="text-sm text-gray-400">
                                    Otomatik SSL sertifikası ile güvenli bağlantı
                                </p>
                            </div>
                        </li>
                        <li className="flex items-start gap-3 text-gray-300">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 text-blue-400 flex-shrink-0"
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
                            <div>
                                <p className="font-medium text-white">DNS Yönetimi</p>
                                <p className="text-sm text-gray-400">
                                    DNS kayıtlarınızı kolayca yönetin
                                </p>
                            </div>
                        </li>
                        <li className="flex items-start gap-3 text-gray-300">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 text-blue-400 flex-shrink-0"
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
                            <div>
                                <p className="font-medium text-white">Subdomain Desteği</p>
                                <p className="text-sm text-gray-400">
                                    Sınırsız subdomain oluşturun ve yönetin
                                </p>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Info Box */}
            <div className="bg-blue-900/30 border border-blue-700 rounded-xl p-6">
                <div className="flex items-start gap-4">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-blue-400 flex-shrink-0 mt-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                    <div>
                        <h4 className="text-lg font-semibold text-white mb-2">Bilgi</h4>
                        <p className="text-gray-300">
                            Şu anda siteniz <span className="font-semibold">*.pages.dev</span>{" "}
                            domain'i ile yayınlanmaktadır. Domain yönetimi özelliği aktif olduğunda,
                            kendi domain adınızı bağlayarak profesyonel bir web adresi kullanabileceksiniz.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
