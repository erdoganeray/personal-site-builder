import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Navigation Bar */}
      <nav className="border-b border-gray-700 bg-gray-800/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                SiteBuilder AI
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
              >
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Profile Content */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 shadow-xl">
          <h1 className="text-3xl font-bold text-white mb-6">Profil</h1>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Ad Soyad
              </label>
              <p className="text-white text-lg">{session.user?.name || "Belirtilmemiş"}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                E-posta
              </label>
              <p className="text-white text-lg">{session.user?.email}</p>
            </div>

            <div className="pt-6 border-t border-gray-700">
              <p className="text-gray-400 text-sm italic">
                Profil düzenleme özellikleri yakında eklenecek...
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
