"use client";

import AdminShell from '@/components/admin-shell';
import { useEffect, useState } from 'react';
import { CalendarDays, Clock, CheckCircle, ImageIcon } from 'lucide-react';

interface Stats {
  totalEvents: number;
  pendingRes: number;
  confirmedRes: number;
  galleryCount: number;
  recentReservations: any[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch('/api/admin/stats')
      .then((r) => r.json())
      .then((d) => setStats(d))
      .catch(() => {});
  }, []);

  const cards = [
    { label: 'Toplam Etkinlik', value: stats?.totalEvents ?? 0, icon: CalendarDays, color: 'text-[#C9A84C]' },
    { label: 'Bekleyen Rezervasyon', value: stats?.pendingRes ?? 0, icon: Clock, color: 'text-yellow-400' },
    { label: 'Onaylı Rezervasyon', value: stats?.confirmedRes ?? 0, icon: CheckCircle, color: 'text-green-400' },
    { label: 'Galeri Fotoğraf', value: stats?.galleryCount ?? 0, icon: ImageIcon, color: 'text-blue-400' },
  ];

  return (
    <AdminShell>
      <h1 className="serif text-3xl font-semibold mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.label} className="bg-[#1A0A0A] border border-[#F5EEE0]/8 p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#F5EEE0]/50">{c.label}</span>
                <Icon size={18} className={c.color} />
              </div>
              <p className="text-3xl font-bold">{c.value}</p>
            </div>
          );
        })}
      </div>

      <h2 className="serif text-xl font-semibold mb-4">Son Rezervasyonlar</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#F5EEE0]/10 text-left text-xs uppercase tracking-wider text-[#F5EEE0]/40">
              <th className="pb-3 pr-4">Ad Soyad</th>
              <th className="pb-3 pr-4">Etkinlik</th>
              <th className="pb-3 pr-4">Kişi</th>
              <th className="pb-3 pr-4">Durum</th>
            </tr>
          </thead>
          <tbody>
            {(stats?.recentReservations ?? []).map((r: any) => (
              <tr key={r?.id} className="border-b border-[#F5EEE0]/5">
                <td className="py-3 pr-4">{r?.fullName}</td>
                <td className="py-3 pr-4 text-[#F5EEE0]/60">{r?.event?.title}</td>
                <td className="py-3 pr-4">{r?.guestCount}</td>
                <td className="py-3 pr-4">
                  <span className={`text-xs font-semibold px-2 py-1 rounded ${
                    r?.status === 'CONFIRMED' ? 'bg-green-900/30 text-green-400' :
                    r?.status === 'CANCELLED' ? 'bg-red-900/30 text-red-400' :
                    'bg-yellow-900/30 text-yellow-400'
                  }`}>
                    {r?.status === 'CONFIRMED' ? 'Onaylı' : r?.status === 'CANCELLED' ? 'İptal' : 'Beklemede'}
                  </span>
                </td>
              </tr>
            ))}
            {(stats?.recentReservations ?? []).length === 0 && (
              <tr><td colSpan={4} className="py-8 text-center text-[#F5EEE0]/30">Henüz rezervasyon yok.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
