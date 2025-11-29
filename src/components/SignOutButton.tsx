'use client';

import { signOut } from 'next-auth/react';

export default function SignOutButton() {
  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  return (
    <button
      onClick={handleSignOut}
      className="w-full text-left px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors rounded-b-lg"
    >
      Çıkış Yap
    </button>
  );
}
