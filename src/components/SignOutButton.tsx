'use client';

import { signOut } from 'next-auth/react';
import { LogOut } from 'lucide-react';

export default function SignOutButton() {
  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  return (
    <button
      onClick={handleSignOut}
      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-white/5 rounded-lg transition-colors text-left"
    >
      <LogOut className="w-4 h-4" />
      Çıkış Yap
    </button>
  );
}
