"use client";

export default function Subscriptions() {
    // Şimdilik statik bilgiler - gelecekte API'den çekilecek
    const subscription = {
        plan: "Ücretsiz Plan",
        remainingRevisions: 3,
        totalRevisions: 5,
        expiryDate: "Süresiz",
        features: [
            "1 Kişisel Site",
            "5 Revize Hakkı",
            "Temel Şablonlar",
            "Cloudflare Hosting",
        ],
    };

    const plans = [
        {
            name: "Ücretsiz",
            price: "0₺",
            period: "/ay",
            features: [
                "1 Kişisel Site",
                "5 Revize Hakkı",
                "Temel Şablonlar",
                "Cloudflare Hosting",
            ],
            current: true,
        },
        {
            name: "Pro",
            price: "99₺",
            period: "/ay",
            features: [
                "Sınırsız Site",
                "Sınırsız Revize",
                "Premium Şablonlar",
                "Özel Domain",
                "Analytics",
                "Öncelikli Destek",
            ],
            current: false,
            comingSoon: true,
        },
        {
            name: "Enterprise",
            price: "İletişim",
            period: "",
            features: [
                "Pro'daki Her Şey",
                "Özel Tasarım",
                "API Erişimi",
                "Özel Geliştirme",
                "7/24 Destek",
            ],
            current: false,
            comingSoon: true,
        },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-white mb-2">Aboneliklerim</h2>
                <p className="text-gray-400">Plan bilgilerinizi ve kullanım durumunuzu görüntüleyin</p>
            </div>

            {/* Current Plan */}
            <div className="bg-gradient-to-br from-blue-900/50 to-purple-900/50 rounded-xl border border-blue-700 p-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="text-2xl font-bold text-white mb-1">{subscription.plan}</h3>
                        <p className="text-blue-300">Aktif</p>
                    </div>
                    <div className="bg-blue-600 text-white px-4 py-2 rounded-full font-semibold">
                        Mevcut Plan
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-800/50 rounded-lg p-4">
                        <p className="text-gray-400 text-sm mb-1">Kalan Revize Hakkı</p>
                        <p className="text-3xl font-bold text-white">
                            {subscription.remainingRevisions}/{subscription.totalRevisions}
                        </p>
                        <div className="mt-2 bg-gray-700 rounded-full h-2">
                            <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{
                                    width: `${
                                        (subscription.remainingRevisions / subscription.totalRevisions) * 100
                                    }%`,
                                }}
                            ></div>
                        </div>
                    </div>

                    <div className="bg-gray-800/50 rounded-lg p-4">
                        <p className="text-gray-400 text-sm mb-1">Plan Bitiş Tarihi</p>
                        <p className="text-2xl font-bold text-white">{subscription.expiryDate}</p>
                    </div>
                </div>

                <div>
                    <h4 className="text-lg font-semibold text-white mb-3">Plan Özellikleri</h4>
                    <ul className="space-y-2">
                        {subscription.features.map((feature, index) => (
                            <li key={index} className="flex items-center gap-2 text-gray-300">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 text-green-500"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                                {feature}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Available Plans */}
            <div>
                <h3 className="text-xl font-bold text-white mb-4">Diğer Planlar</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {plans.map((plan, index) => (
                        <div
                            key={index}
                            className={`rounded-xl border p-6 transition-all duration-200 ${
                                plan.current
                                    ? "bg-gradient-to-br from-blue-900/30 to-purple-900/30 border-blue-600"
                                    : "bg-gray-800 border-gray-700 hover:border-gray-600"
                            }`}
                        >
                            <div className="mb-4">
                                <h4 className="text-xl font-bold text-white mb-2">{plan.name}</h4>
                                <div className="flex items-baseline">
                                    <span className="text-3xl font-bold text-white">{plan.price}</span>
                                    <span className="text-gray-400 ml-1">{plan.period}</span>
                                </div>
                            </div>

                            <ul className="space-y-3 mb-6">
                                {plan.features.map((feature, featureIndex) => (
                                    <li
                                        key={featureIndex}
                                        className="flex items-start gap-2 text-sm text-gray-300"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <button
                                disabled={plan.current || plan.comingSoon}
                                className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
                                    plan.current
                                        ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                                        : plan.comingSoon
                                        ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                                        : "bg-blue-600 hover:bg-blue-700 text-white"
                                }`}
                            >
                                {plan.current
                                    ? "Mevcut Plan"
                                    : plan.comingSoon
                                    ? "Yakında"
                                    : "Planı Seç"}
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Usage Stats */}
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
                <h3 className="text-xl font-bold text-white mb-4">Kullanım İstatistikleri</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-700/50 rounded-lg p-4">
                        <p className="text-gray-400 text-sm mb-1">Toplam Site</p>
                        <p className="text-3xl font-bold text-white">1</p>
                    </div>
                    <div className="bg-gray-700/50 rounded-lg p-4">
                        <p className="text-gray-400 text-sm mb-1">Kullanılan Revize</p>
                        <p className="text-3xl font-bold text-white">
                            {subscription.totalRevisions - subscription.remainingRevisions}
                        </p>
                    </div>
                    <div className="bg-gray-700/50 rounded-lg p-4">
                        <p className="text-gray-400 text-sm mb-1">Yayınlanma Sayısı</p>
                        <p className="text-3xl font-bold text-white">0</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
