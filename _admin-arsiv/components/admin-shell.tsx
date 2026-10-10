"use client";

import { useEffect, useState, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { LayoutDashboard, CalendarDays, ClipboardList, Image as ImageIcon, FileText, LogOut, Menu, X } from 'lucide-react';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/etkinlikler', label: 'Etkinlikler', icon: CalendarDays },
  { href: '/admin/rezervasyonlar', label: 'Rezervasyonlar', icon: ClipboardList },
  { href: '/admin/galeri', label: 'Galeri', icon: ImageIcon },
  { href: '/admin/site-icerigi', label: 'Site İçeriği', icon: FileText },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const checkAuth = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/session');
      if (!res.ok) throw new Error();
      setAuthed(true);
    } catch {
      setAuthed(false);
      router.replace('/admin/login');
    }
  }, [router]);

  useEffect(() => { checkAuth(); }, [checkAuth]);

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.replace('/admin/login');
  };

  if (authed === null) {
    return <div className="min-h-screen flex items-center justify-center bg-[#130909]"><div className="animate-pulse text-[#C9A84C]">Yükleniyor...</div></div>;
  }
  if (!authed) return null;

  return (
    <div className="min-h-screen bg-[#130909] flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-[#0D0505] border-r border-[#F5EEE0]/8 p-6">
        <div className="flex items-center gap-3 mb-10">
          <Image src="/venue/logo-v2.png" alt="Logo" width={169} height={68} className="h-[68px] w-auto object-contain" />
          <span className="serif text-lg font-semibold">Yönetim</span>
        </div>
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition rounded ${
                  active
                    ? 'bg-[#7A1020]/30 text-[#C9A84C]'
                    : 'text-[#F5EEE0]/60 hover:bg-[#F5EEE0]/5 hover:text-[#F5EEE0]'
                }`}
              >
                <Icon size={18} /> {item.label}
              </Link>
            );
          })}
        </nav>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 text-sm text-[#F5EEE0]/50 hover:text-red-400 transition"
        >
          <LogOut size={18} /> Çıkış Yap
        </button>
      </aside>

      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-[#0D0505] border-b border-[#F5EEE0]/8 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image src="/venue/logo-v2.png" alt="Logo" width={135} height={55} className="h-[55px] w-auto object-contain" />
          <span className="serif text-base font-semibold">Yönetim</span>
        </div>
        <button onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-[#0D0505]/95 pt-16">
          <nav className="flex flex-col items-center gap-4 pt-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 text-sm font-medium text-[#F5EEE0]/70 hover:text-[#C9A84C]"
                >
                  <Icon size={18} /> {item.label}
                </Link>
              );
            })}
            <button onClick={handleLogout} className="flex items-center gap-3 text-sm text-[#F5EEE0]/50 hover:text-red-400 mt-4">
              <LogOut size={18} /> Çıkış Yap
            </button>
          </nav>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 lg:ml-0 min-h-screen">
        <div className="pt-16 lg:pt-0 p-6 lg:p-10">
          {children}
        </div>
      </div>
    </div>
  );
}
