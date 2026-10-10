"use client";

import AdminShell from '@/components/admin-shell';
import { useEffect, useState, useCallback } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

export default function AdminReservationsPage() {
  const [reservations, setReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [events, setEvents] = useState<any[]>([]);
  const [filterEvent, setFilterEvent] = useState('');

  const fetchData = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (filterStatus) params.set('status', filterStatus);
      if (filterEvent) params.set('eventId', filterEvent);
      const [resRes, evRes] = await Promise.all([
        fetch(`/api/reservations?${params.toString()}`),
        fetch('/api/events?all=true'),
      ]);
      const resData = await resRes.json();
      const evData = await evRes.json();
      setReservations(resData ?? []);
      setEvents(evData ?? []);
    } catch {} finally { setLoading(false); }
  }, [filterStatus, filterEvent]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/reservations/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    fetchData();
  };

  return (
    <AdminShell>
      <h1 className="serif text-3xl font-semibold mb-8">Rezervasyonlar</h1>

      <div className="flex flex-wrap gap-3 mb-6">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="bg-[#130909] border border-[#F5EEE0]/15 px-3 py-2 text-sm focus:border-[#C9A84C] focus:outline-none"
        >
          <option value="">Tüm Durumlar</option>
          <option value="PENDING">Beklemede</option>
          <option value="CONFIRMED">Onaylı</option>
          <option value="CANCELLED">İptal</option>
        </select>
        <select
          value={filterEvent}
          onChange={(e) => setFilterEvent(e.target.value)}
          className="bg-[#130909] border border-[#F5EEE0]/15 px-3 py-2 text-sm focus:border-[#C9A84C] focus:outline-none"
        >
          <option value="">Tüm Etkinlikler</option>
          {(events ?? []).map((ev: any) => (
            <option key={ev?.id} value={ev?.id}>{ev?.title}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="text-center text-[#F5EEE0]/40 py-12">Yükleniyor...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#F5EEE0]/10 text-left text-xs uppercase tracking-wider text-[#F5EEE0]/40">
                <th className="pb-3 pr-4">Ad Soyad</th>
                <th className="pb-3 pr-4">Etkinlik / Tür</th>
                <th className="pb-3 pr-4">Tarih</th>
                <th className="pb-3 pr-4">Kişi</th>
                <th className="pb-3 pr-4">Telefon</th>
                <th className="pb-3 pr-4">E-posta</th>
                <th className="pb-3 pr-4">Mesaj</th>
                <th className="pb-3 pr-4">Durum</th>
                <th className="pb-3">İşlem</th>
              </tr>
            </thead>
            <tbody>
              {(reservations ?? []).map((r: any) => (
                <tr key={r?.id} className="border-b border-[#F5EEE0]/5">
                  <td className="py-3 pr-4 font-medium">{r?.fullName}</td>
                  <td className="py-3 pr-4 text-[#F5EEE0]/60">{r?.event?.title ?? <span className="text-[#C9A84C]">Genel Rezervasyon</span>}</td>
                  <td className="py-3 pr-4 text-[#F5EEE0]/60">{(r?.event?.date || r?.reservationDate) ? new Date(r?.event?.date || r?.reservationDate).toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '-'}</td>
                  <td className="py-3 pr-4">{r?.guestCount}</td>
                  <td className="py-3 pr-4 text-[#F5EEE0]/60">{r?.phone}</td>
                  <td className="py-3 pr-4 text-[#F5EEE0]/60 truncate max-w-[150px]">{r?.email}</td>
                  <td className="py-3 pr-4 text-[#F5EEE0]/50 text-xs max-w-[150px] truncate">{r?.specialRequest ?? '-'}</td>
                  <td className="py-3 pr-4">
                    <span className={`text-xs font-semibold px-2 py-1 rounded ${
                      r?.status === 'CONFIRMED' ? 'bg-green-900/30 text-green-400' :
                      r?.status === 'CANCELLED' ? 'bg-red-900/30 text-red-400' :
                      'bg-yellow-900/30 text-yellow-400'
                    }`}>
                      {r?.status === 'CONFIRMED' ? 'Onaylı' : r?.status === 'CANCELLED' ? 'İptal' : 'Beklemede'}
                    </span>
                  </td>
                  <td className="py-3 flex gap-2">
                    {r?.status !== 'CONFIRMED' && (
                      <button onClick={() => updateStatus(r?.id, 'CONFIRMED')} title="Onayla" className="text-green-400/60 hover:text-green-400 transition">
                        <CheckCircle size={18} />
                      </button>
                    )}
                    {r?.status !== 'CANCELLED' && (
                      <button onClick={() => updateStatus(r?.id, 'CANCELLED')} title="İptal Et" className="text-red-400/60 hover:text-red-400 transition">
                        <XCircle size={18} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {(reservations ?? []).length === 0 && (
                <tr><td colSpan={9} className="py-8 text-center text-[#F5EEE0]/30">Rezervasyon bulunamadı.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </AdminShell>
  );
}
