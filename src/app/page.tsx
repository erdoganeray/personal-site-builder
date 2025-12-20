import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import SignOutButton from "@/components/SignOutButton";
import HeroPromptSection from "@/components/HeroPromptSection";
import {
  FileText,
  Upload,
  CheckCircle2,
  Zap,
  Layout,
  Globe,
  ArrowRight,
  ChevronDown,
  User,
  LogOut,
  LayoutDashboard,
  HelpCircle,
} from "lucide-react";
import Image from "next/image";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <div className="min-h-screen bg-[#0a0a0a] selection:bg-purple-500/30">
      {/* Navigation Bar */}
      <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 animate-slide-down">
        <nav className="bg-gray-900/80 backdrop-blur-md border border-white/10 rounded-full px-6 py-3 w-full max-w-5xl shadow-2xl shadow-purple-500/5">
          <div className="flex justify-between items-center">
            {/* Scroll to top link */}
            <Link href="#" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <span className="text-white font-bold text-lg">P</span>
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 group-hover:from-white group-hover:to-white transition-all">
                Profilly
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <Link href="#how-it-works" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
                Nasıl Çalışır?
              </Link>

              <Link href="#pricing" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
                Fiyatlandırma
              </Link>
              <Link href="#faq" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
                SSS
              </Link>
            </div>

            <div className="flex items-center gap-4">
              {session ? (
                <div className="relative group">
                  <button className="flex items-center gap-3 pl-1 pr-2 py-1 rounded-full hover:bg-white/5 transition-colors border border-transparent hover:border-white/10">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 p-[1px] overflow-hidden">
                      {session.user?.image ? (
                        <Image
                          src={session.user.image}
                          alt="Profile"
                          width={32}
                          height={32}
                          className="rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-xs font-bold text-white">
                          {session.user?.name?.[0]?.toUpperCase() || session.user?.email?.[0]?.toUpperCase() || "U"}
                        </div>
                      )}
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                  </button>

                  {/* Dropdown Menu */}
                  <div className="absolute right-0 top-full mt-2 w-56 rounded-xl bg-gray-900 border border-white/10 shadow-xl overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform origin-top-right scale-95 group-hover:scale-100">
                    <div className="p-2">
                      <div className="px-3 py-2 border-b border-white/5 mb-1">
                        <p className="text-sm font-medium text-white truncate">{session.user?.name}</p>
                        <p className="text-xs text-gray-500 truncate">{session.user?.email}</p>
                      </div>
                      <Link
                        href="/dashboard"
                        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        Panel
                      </Link>
                      <SignOutButton />
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-sm font-medium text-gray-300 hover:text-white transition-colors hidden sm:block"
                  >
                    Giriş
                  </Link>
                  <Link
                    href="/register"
                    className="px-5 py-2 bg-white text-black text-sm font-semibold rounded-full hover:bg-gray-200 transition-colors"
                  >
                    Ücretsiz Dene
                  </Link>
                </>
              )}
            </div>
          </div>
        </nav>
      </div>

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 px-4 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] -z-10 animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-blue-600/10 rounded-full blur-[100px] -z-10" />

        <div className="max-w-5xl mx-auto">
          {/* Badge */}
          <div className="flex justify-center mb-6 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-xs font-medium text-gray-300">Yapay Zeka Destekli Site Oluşturucu</span>
            </div>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight tracking-tight text-center animate-slide-up">
            Hayalinizdeki Siteyi{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400">
              Saniyeler İçinde
            </span>{" "}
            Kurun
          </h1>

          {/* Subtitle */}
          <p className="text-base md:text-lg text-gray-400 mb-8 text-center max-w-3xl mx-auto animate-slide-up animation-delay-100">
            Kodlama veya tasarım bilgisine ihtiyacınız yok. Sadece ne istediğinizi söyleyin veya CV'nizi yükleyin, gerisini Profilly halletsin.
          </p>

          {/* Prompt Input Section */}
          <HeroPromptSection className="mb-8 animate-scale-in" />
        </div>
      </section>



      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Nasıl Çalışır?</h2>
            <p className="text-gray-400 max-w-xl mx-auto">Karmaşık süreçleri unutun. Modern web teknolojisi ile tanışın.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Upload className="w-6 h-6 text-purple-400" />,
                title: "1. İçerik Sağlayın",
                desc: "CV'nizi yükleyin veya kendinizi kısaca anlatın."
              },
              {
                icon: <Zap className="w-6 h-6 text-blue-400" />,
                title: "2. AI Analizi",
                desc: "Yapay zeka içeriğinizi analiz eder ve en uygun yapıyı kurgular."
              },
              {
                icon: <Layout className="w-6 h-6 text-pink-400" />,
                title: "3. Canlıya Alın",
                desc: "Siteniz saniyeler içinde oluşturulur ve yayınlanır."
              }
            ].map((step, i) => (
              <div key={i} className="group p-8 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all duration-300">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                <p className="text-gray-400 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-4 bg-gradient-to-b from-[#0a0a0a] to-[#111]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Basit Fiyatlandırma</h2>
            <p className="text-gray-400">Gizli ücret yok, taahhüt yok.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <div className="p-10 rounded-3xl bg-[#0a0a0a] border border-white/10 hover:border-white/20 transition-all relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gray-500/10 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-gray-500/20"></div>

              <h3 className="text-xl font-medium text-gray-400 mb-2">Başlangıç</h3>
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-4xl font-bold text-white">₺0</span>
                <span className="text-gray-500">/ay</span>
              </div>

              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-gray-300">
                  <CheckCircle2 className="w-5 h-5 text-gray-500" />
                  <span>1 Web Sitesi</span>
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <CheckCircle2 className="w-5 h-5 text-gray-500" />
                  <span>Profilly Subdomain</span>
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <CheckCircle2 className="w-5 h-5 text-gray-500" />
                  <span>Aylık Düzenleme Hakkı</span>
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <CheckCircle2 className="w-5 h-5 text-gray-500" />
                  <span>5 Versiyon Geçmişi</span>
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <CheckCircle2 className="w-5 h-5 text-gray-500" />
                  <span>Tek Sayfa Tasarım</span>
                </li>
              </ul>

              <Link href="/register" className="block w-full py-4 rounded-xl bg-white/5 text-white text-center font-semibold hover:bg-white/10 transition-colors border border-white/5">
                Ücretsiz Başla
              </Link>
            </div>

            {/* Paid Plan */}
            <div className="p-10 rounded-3xl bg-[#0f0f0f] border border-purple-500/30 hover:border-purple-500/50 transition-all relative overflow-hidden group shadow-2xl shadow-purple-900/10">
              <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl -mr-20 -mt-20 transition-all group-hover:bg-purple-500/30"></div>
              <div className="absolute top-6 right-6 px-3 py-1 bg-purple-500/20 text-purple-300 text-xs font-bold rounded-full border border-purple-500/30">
                POPÜLER
              </div>

              <h3 className="text-xl font-medium text-white mb-2">Pro</h3>
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-4xl font-bold text-white">₺99</span>
                <span className="text-gray-500">/ay</span>
              </div>

              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-white">
                  <CheckCircle2 className="w-5 h-5 text-purple-400" />
                  <span>Sınırsız Web Sitesi</span>
                </li>
                <li className="flex items-center gap-3 text-white">
                  <CheckCircle2 className="w-5 h-5 text-purple-400" />
                  <span>Özel Domain Bağlama</span>
                </li>
                <li className="flex items-center gap-3 text-white">
                  <CheckCircle2 className="w-5 h-5 text-purple-400" />
                  <span>Daha Fazla Düzenleme Hakkı</span>
                </li>
                <li className="flex items-center gap-3 text-white">
                  <CheckCircle2 className="w-5 h-5 text-purple-400" />
                  <span>Blog Sayfası & Editör</span>
                </li>
                <li className="flex items-center gap-3 text-white">
                  <CheckCircle2 className="w-5 h-5 text-purple-400" />
                  <span>Çok Sayfalı Tasarım</span>
                </li>
                <li className="flex items-center gap-3 text-white">
                  <CheckCircle2 className="w-5 h-5 text-purple-400" />
                  <span>Daha Fazla Versiyon Geçmişi</span>
                </li>
              </ul>

              <Link href="/register" className="block w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white text-center font-bold hover:shadow-lg hover:shadow-purple-500/25 transition-all transform hover:-translate-y-1">
                Hemen Yükselt
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 px-4 bg-[#0a0a0a]">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Sıkça Sorulan Sorular</h2>
            <p className="text-gray-400">Akıllardaki soru işaretlerini giderelim.</p>
          </div>

          <div className="space-y-4">
            {[
              { q: "Profilly nasıl çalışır?", a: "CV'nizi yükleyin veya kısa bir açıklama yazın. Yapay zekamız içeriğinizi analiz eder ve size özel, profesyonel bir web sitesi oluşturur. Kodlama bilgisine ihtiyacınız yok!" },
              { q: "Ücretsiz planda neler var?", a: "Ücretsiz planda 1 web sitesi, Profilly subdomain, aylık düzenleme hakkı ve 5 versiyon geçmişi bulunur. Kredi kartı gerektirmez." },
              { q: "Kendi domain adımı kullanabilir miyim?", a: "Evet! Pro plana geçtiğinizde kendi .com, .net gibi özel alan adlarınızı bağlayabilirsiniz." },
              { q: "Sitemi sonradan düzenleyebilir miyim?", a: "Kesinlikle! Editör panelimizden istediğiniz zaman sitenizi güncelleyebilir, içerik ekleyip çıkarabilirsiniz. Değişiklikleriniz anında yayına alınır." },
              { q: "Versiyon geçmişi ne işe yarar?", a: "Yaptığınız değişiklikleri geri alabilir, önceki versiyonlara dönebilirsiniz. Ücretsiz planda 5, Pro planda daha fazla versiyon saklanır." }
            ].map((faq, i) => (
              <div key={i} className="group rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 overflow-hidden transition-colors">
                <details className="group">
                  <summary className="flex cursor-pointer items-center justify-between gap-1.5 p-6 text-white font-medium list-none">
                    <span>{faq.q}</span>
                    <span className="relative size-5 shrink-0">
                      <ChevronDown className="absolute inset-0 size-5 transition-transform duration-300 group-open:-rotate-180" />
                    </span>
                  </summary>
                  <div className="px-6 pb-6 text-gray-400 leading-relaxed">
                    <p>{faq.a}</p>
                  </div>
                </details>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pre-Footer CTA */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto bg-gradient-to-r from-gray-900 to-gray-800 rounded-[2.5rem] p-12 md:p-20 text-center border border-white/5 relative overflow-hidden">

          <div className="absolute -top-24 -left-24 w-64 h-64 bg-purple-500/20 rounded-full blur-[80px]"></div>
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-blue-500/20 rounded-full blur-[80px]"></div>

          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Kariyerinizi Bir Sonraki Seviyeye Taşıyın
            </h2>
            <p className="text-lg text-gray-400 mb-10 max-w-2xl mx-auto">
              Profilly ile oluşturulan profesyonel bir web sitesi ile işverenlerin ve müşterilerin dikkatini çekin.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-bold rounded-full text-lg hover:bg-gray-100 transition-all transform hover:scale-105"
            >
              Ücretsiz Başla
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 bg-[#050505]">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
              <span className="text-white font-bold">P</span>
            </div>
            <span className="text-xl font-bold text-white">Profilly</span>
          </div>

          <div className="flex items-center gap-8 text-sm text-gray-400">
            <Link href="#" className="hover:text-white transition-colors">Gizlilik</Link>
            <Link href="#" className="hover:text-white transition-colors">Kullanım Şartları</Link>
            <Link href="mailto:support@profilly.com" className="hover:text-white transition-colors">İletişim</Link>
          </div>

          <div className="text-sm text-gray-500">
            © 2025 Profilly. Tüm hakları saklıdır.
          </div>
        </div>
      </footer>
    </div>
  );
}
