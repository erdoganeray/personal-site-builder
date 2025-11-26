import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Navigation Bar */}
      <nav className="border-b border-gray-700 bg-gray-800/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                SiteBuilder AI
              </Link>
            </div>
            <div className="flex items-center gap-4">
              {session ? (
                <Link
                  href="/dashboard"
                  className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                  >
                    Giriş Yap
                  </Link>
                  <Link
                    href="/register"
                    className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    Ücretsiz Başla
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
        <div className="text-center">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            AI ile 60 Saniyede{" "}
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Kişisel Web Sitenizi
            </span>{" "}
            Oluşturun
          </h1>
          <p className="text-xl sm:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto">
            CV'nizi yükleyin, yapay zeka sizin için profesyonel bir web sitesi oluştursun. 
            Kodlama bilgisi gerektirmez, dakikalar içinde yayına alın.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/register"
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white text-lg font-bold rounded-lg transition-all duration-200 shadow-2xl hover:shadow-purple-500/50 hover:scale-105 w-full sm:w-auto"
            >
              Hemen Ücretsiz Dene →
            </Link>
            <Link
              href="#how-it-works"
              className="px-8 py-4 bg-gray-800 hover:bg-gray-700 text-white text-lg font-semibold rounded-lg transition-all duration-200 border border-gray-700 w-full sm:w-auto"
            >
              Nasıl Çalışır?
            </Link>
          </div>
          <p className="mt-8 text-gray-400 text-sm">
            ✓ Kredi kartı gerektirmez  ✓ Anında başlayın  ✓ Ücretsiz subdomain
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: "Site Oluşturuldu", value: "50+" },
            { label: "Ortalama Süre", value: "45 sn" },
            { label: "Memnuniyet", value: "98%" },
            { label: "Ücretsiz Revize", value: "1x" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
                {stat.value}
              </div>
              <div className="text-gray-400 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Nasıl Çalışır?
          </h2>
          <p className="text-xl text-gray-300">
            4 basit adımda kişisel web siteniz hazır
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              step: "1",
              title: "CV Yükle",
              description: "PDF formatında CV'nizi yükleyin. Maksimum 4MB.",
              icon: "📄",
            },
            {
              step: "2",
              title: "AI Analiz",
              description: "Gemini 2.0 Flash yapay zekası CV'nizi analiz eder ve yapılandırır.",
              icon: "🤖",
            },
            {
              step: "3",
              title: "Önizle & Revize",
              description: "Sitenizi görün, beğenmediyseniz 1 ücretsiz revize hakkınız var.",
              icon: "👁️",
            },
            {
              step: "4",
              title: "Yayınla",
              description: "Tek tıkla Cloudflare'de yayınlayın. SSL ve subdomain dahil.",
              icon: "🚀",
            },
          ].map((item) => (
            <div
              key={item.step}
              className="bg-gray-800 rounded-2xl p-8 border border-gray-700 shadow-xl hover:shadow-2xl hover:border-purple-500/50 transition-all duration-300 relative"
            >
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                {item.step}
              </div>
              <div className="text-5xl mb-4 text-center">{item.icon}</div>
              <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
              <p className="text-gray-300">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32 bg-gray-800/30 rounded-3xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Güçlü Özellikler
          </h2>
          <p className="text-xl text-gray-300">
            Her şey dahil, ek ücret yok
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              title: "AI-Powered Üretim",
              description: "Google Gemini 2.0 Flash ile otomatik HTML/CSS oluşturma",
              icon: "⚡",
              gradient: "from-purple-500 to-pink-500",
            },
            {
              title: "Tek Tık Deployment",
              description: "Cloudflare Pages ile anında yayınlama, manuel ayar yok",
              icon: "☁️",
              gradient: "from-blue-500 to-cyan-500",
            },
            {
              title: "SSL Sertifikası",
              description: "Otomatik HTTPS, güvenli bağlantı her zaman aktif",
              icon: "🔒",
              gradient: "from-green-500 to-emerald-500",
            },
            {
              title: "Özel Subdomain",
              description: "isminiz.sitebuilder.com gibi profesyonel subdomain",
              icon: "🌐",
              gradient: "from-orange-500 to-red-500",
            },
            {
              title: "1 Ücretsiz Revize",
              description: "İlk denemede beğenmediniz mi? 1 kez ücretsiz değişiklik",
              icon: "✏️",
              gradient: "from-yellow-500 to-orange-500",
            },
            {
              title: "LinkedIn & GitHub",
              description: "Sosyal profil linklerini kolayca ekleyin",
              icon: "🔗",
              gradient: "from-indigo-500 to-purple-500",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="bg-gray-800 rounded-2xl p-8 border border-gray-700 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-xl flex items-center justify-center text-3xl mb-4 shadow-lg`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-gray-300">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl p-12 sm:p-16 text-center shadow-2xl">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Kişisel Web Sitenizi Bugün Oluşturun
          </h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Binlerce profesyonel gibi siz de yapay zeka destekli web sitesi oluşturmanın tadını çıkarın. 
            Tamamen ücretsiz, kredi kartı gerektirmez.
          </p>
          <Link
            href="/register"
            className="inline-block px-12 py-5 bg-white hover:bg-gray-100 text-purple-600 text-xl font-bold rounded-lg transition-all duration-200 shadow-2xl hover:scale-105"
          >
            Hemen Başla - Ücretsiz →
          </Link>
          <p className="mt-6 text-purple-200 text-sm">
            60 saniyede hazır • Kodlama gerektirmez • SSL dahil
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-700 bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-4">
                SiteBuilder AI
              </h3>
              <p className="text-gray-400">
                Yapay zeka ile kişisel web sitenizi dakikalar içinde oluşturun.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Hızlı Bağlantılar</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="#how-it-works" className="text-gray-400 hover:text-white transition-colors">
                    Nasıl Çalışır
                  </Link>
                </li>
                <li>
                  <Link href="/register" className="text-gray-400 hover:text-white transition-colors">
                    Kayıt Ol
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="text-gray-400 hover:text-white transition-colors">
                    Giriş Yap
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">İletişim</h4>
              <ul className="space-y-2">
                <li>
                  <a href="https://github.com/erdoganeray/personal-site-builder" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                    GitHub
                  </a>
                </li>
                <li>
                  <a href="mailto:support@sitebuilder.ai" className="text-gray-400 hover:text-white transition-colors">
                    Destek
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 text-center text-gray-400 text-sm">
            <p>© 2025 SiteBuilder AI. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
