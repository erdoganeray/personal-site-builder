import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import SignOutButton from "@/components/SignOutButton";

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
            <div className="hidden md:flex items-center gap-6">
              <Link href="/" className="text-gray-300 hover:text-white transition-colors">
                Ana Sayfa
              </Link>
              <Link href="#features" className="text-gray-300 hover:text-white transition-colors">
                Özellikler
              </Link>
              <Link href="#pricing" className="text-gray-300 hover:text-white transition-colors">
                Fiyatlandırma
              </Link>
              <Link href="#contact" className="text-gray-300 hover:text-white transition-colors">
                İletişim
              </Link>
            </div>
            <div className="flex items-center gap-4">
              {session ? (
                <>
                  <div className="relative group">
                    <button className="px-4 py-2 text-gray-300 hover:text-white transition-colors flex items-center gap-2">
                      {session.user?.name || session.user?.email}
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-xl border border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      <Link
                        href="/dashboard"
                        className="block px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors rounded-t-lg"
                      >
                        Profil
                      </Link>
                      <SignOutButton />
                    </div>
                  </div>
                </>
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
                    Kayıt Ol
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
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight animate-fade-in">
            AI ile 60 Saniyede{" "}
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent animate-pulse">
              Kişisel Web Sitenizi
            </span>{" "}
            Oluşturun
          </h1>
          <p className="text-xl sm:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto animate-slide-up animation-delay-200">
            CV'nizi yükleyin, yapay zeka sizin için profesyonel bir web sitesi oluştursun. 
            Kodlama bilgisi gerektirmez, dakikalar içinde yayına alın.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up animation-delay-300">
            <Link
              href="/register"
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white text-lg font-bold rounded-lg transition-all duration-300 shadow-2xl hover:shadow-purple-500/50 hover:scale-110 hover:-translate-y-1 w-full sm:w-auto transform"
            >
              Hemen Ücretsiz Dene →
            </Link>
            <Link
              href="#how-it-works"
              className="px-8 py-4 bg-gray-800 hover:bg-gray-700 text-white text-lg font-semibold rounded-lg transition-all duration-300 border border-gray-700 hover:border-purple-500 w-full sm:w-auto transform hover:scale-105"
            >
              Nasıl Çalışır?
            </Link>
          </div>
          <p className="mt-8 text-gray-400 text-sm animate-fade-in animation-delay-500">
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
          ].map((stat, index) => (
            <div key={stat.label} className="text-center transform hover:scale-110 transition-all duration-300 animate-fade-in" style={{animationDelay: `${index * 100}ms`}}>
              <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2 animate-bounce-slow">
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
          ].map((item, index) => (
            <div
              key={item.step}
              className="bg-gray-800 rounded-2xl p-8 border border-gray-700 shadow-xl hover:shadow-2xl hover:border-purple-500/50 transition-all duration-300 relative transform hover:scale-105 hover:-translate-y-2 animate-slide-up"
              style={{animationDelay: `${index * 150}ms`}}
            >
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg transform hover:rotate-12 transition-transform duration-300">
                {item.step}
              </div>
              <div className="text-5xl mb-4 text-center transform hover:scale-125 transition-transform duration-300">{item.icon}</div>
              <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
              <p className="text-gray-300">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32 bg-gray-800/30 rounded-3xl">
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
          ].map((feature, index) => (
            <div
              key={feature.title}
              className="bg-gray-800 rounded-2xl p-8 border border-gray-700 shadow-xl hover:shadow-2xl hover:scale-110 transition-all duration-300 transform hover:-translate-y-2 animate-fade-in group"
              style={{animationDelay: `${index * 100}ms`}}
            >
              <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-xl flex items-center justify-center text-3xl mb-4 shadow-lg transform group-hover:rotate-6 group-hover:scale-110 transition-all duration-300`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-gray-300">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Fiyatlandırma
          </h2>
          <p className="text-xl text-gray-300">
            Herkes için uygun planlar
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Free Plan */}
          <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 transform hover:-translate-y-2 animate-slide-up animation-delay-100">
            <h3 className="text-2xl font-bold text-white mb-2">Ücretsiz</h3>
            <div className="mb-6">
              <span className="text-5xl font-bold text-white">₺0</span>
              <span className="text-gray-400 ml-2">/ay</span>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3">
                <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-300">1 web sitesi</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-300">AI ile otomatik oluşturma</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-300">Ücretsiz subdomain</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-300">SSL sertifikası</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-300">1 ücretsiz revize</span>
              </li>
            </ul>
            <Link
              href="/register"
              className="block w-full text-center px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-all duration-200"
            >
              Başla
            </Link>
          </div>

          {/* Pro Plan */}
          <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl p-8 shadow-2xl hover:shadow-purple-500/50 hover:scale-110 transition-all duration-300 relative transform hover:-translate-y-3 animate-slide-up animation-delay-200 ring-4 ring-purple-500/20 hover:ring-purple-500/50">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-gray-900 px-4 py-1 rounded-full text-sm font-bold">
              Popüler
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Pro</h3>
            <div className="mb-6">
              <span className="text-5xl font-bold text-white">₺99</span>
              <span className="text-purple-200 ml-2">/ay</span>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3">
                <svg className="w-6 h-6 text-white flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-white">5 web sitesi</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-6 h-6 text-white flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-white">AI ile otomatik oluşturma</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-6 h-6 text-white flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-white">Özel domain desteği</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-6 h-6 text-white flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-white">Sınırsız revize</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-6 h-6 text-white flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-white">Öncelikli destek</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-6 h-6 text-white flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-white">Gelişmiş analytics</span>
              </li>
            </ul>
            <Link
              href="/register"
              className="block w-full text-center px-6 py-3 bg-white hover:bg-gray-100 text-purple-600 font-bold rounded-lg transition-all duration-200"
            >
              Şimdi Başla
            </Link>
          </div>

          {/* Enterprise Plan */}
          <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 transform hover:-translate-y-2 animate-slide-up animation-delay-300">
            <h3 className="text-2xl font-bold text-white mb-2">Kurumsal</h3>
            <div className="mb-6">
              <span className="text-5xl font-bold text-white">Özel</span>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3">
                <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-300">Sınırsız web sitesi</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-300">Özel AI modeli</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-300">API erişimi</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-300">Özel eğitim</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-300">Özel SLA</span>
              </li>
            </ul>
            <Link
              href="/contact"
              className="block w-full text-center px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-all duration-200"
            >
              İletişime Geç
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              İletişime Geçin
            </h2>
            <p className="text-xl text-gray-300">
              Sorularınız mı var? Size yardımcı olmaktan mutluluk duyarız!
            </p>
          </div>

          {/* Contact Form */}
          <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 shadow-xl mb-12 animate-slide-up animation-delay-200">
            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                  Adınız
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="Adınız Soyadınız"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  E-posta
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="ornek@email.com"
                  required
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                  Konu
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="Mesajınızın konusu"
                  required
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                  Mesajınız
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                  placeholder="Mesajınızı buraya yazın..."
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
              >
                Mesaj Gönder
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-white font-semibold mb-2">E-posta</h3>
              <a href="mailto:support@sitebuilder.ai" className="text-gray-400 hover:text-purple-400 transition-colors">
                support@sitebuilder.ai
              </a>
            </div>

            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </div>
              <h3 className="text-white font-semibold mb-2">GitHub</h3>
              <a href="https://github.com/erdoganeray/personal-site-builder" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-purple-400 transition-colors">
                @erdoganeray
              </a>
            </div>

            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-white font-semibold mb-2">Yanıt Süresi</h3>
              <p className="text-gray-400">24 saat içinde</p>
            </div>
          </div>
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
                  <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                    Ana Sayfa
                  </Link>
                </li>
                <li>
                  <Link href="#features" className="text-gray-400 hover:text-white transition-colors">
                    Özellikler
                  </Link>
                </li>
                <li>
                  <Link href="#pricing" className="text-gray-400 hover:text-white transition-colors">
                    Fiyatlandırma
                  </Link>
                </li>
                <li>
                  <Link href="#how-it-works" className="text-gray-400 hover:text-white transition-colors">
                    Nasıl Çalışır
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">İletişim</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="#contact" className="text-gray-400 hover:text-white transition-colors">
                    Bize Ulaşın
                  </Link>
                </li>
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
