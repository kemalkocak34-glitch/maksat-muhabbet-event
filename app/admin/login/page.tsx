"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Loader2, LogIn } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error ?? 'Giriş başarısız.');
      }
      router.push('/admin');
    } catch (err: any) {
      setError(err?.message ?? 'Bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#130909] px-4">
      <div className="w-full max-w-md bg-[#1A0A0A] border border-[#F5EEE0]/10 p-8">
        <div className="flex justify-center mb-6">
          <Image src="/venue/logo-v2.png" alt="Maksat Muhabbet" width={270} height={108} className="h-[108px] w-auto object-contain" />
        </div>
        <h1 className="serif text-2xl font-semibold text-center mb-6">Yönetim Paneli</h1>

        {error && <p className="text-sm text-red-400 bg-red-900/20 p-3 mb-4">{error}</p>}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#F5EEE0]/70 mb-1.5">Kullanıcı Adı</label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-[#130909] border border-[#F5EEE0]/15 px-4 py-3 text-sm text-[#F5EEE0] focus:border-[#C9A84C] focus:outline-none transition"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#F5EEE0]/70 mb-1.5">Şifre</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#130909] border border-[#F5EEE0]/15 px-4 py-3 text-sm text-[#F5EEE0] focus:border-[#C9A84C] focus:outline-none transition"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#7A1020] py-3 text-sm font-semibold uppercase tracking-wider hover:bg-[#93162A] transition disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <LogIn size={16} />}
            Giriş Yap
          </button>
        </form>
      </div>
    </div>
  );
}
