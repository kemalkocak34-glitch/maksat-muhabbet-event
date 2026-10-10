"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Loader2 } from 'lucide-react';

export default function EventDetailClient({ eventId, spotsLeft }: { eventId: string; spotsLeft: number }) {
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    guestCount: 1,
    specialRequest: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, eventId }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error ?? 'Bir hata oluştu.');
      }
      setSuccess(true);
    } catch (err: any) {
      setError(err?.message ?? 'Beklenmeyen bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-8"
      >
        <CheckCircle size={48} className="mx-auto text-green-500 mb-4" />
        <h3 className="serif text-xl font-semibold mb-2">Rezervasyonunuz Alındı!</h3>
        <p className="text-sm text-[#F5EEE0]/60">
          En kısa sürede sizinle iletişime geçeceğiz.
        </p>
      </motion.div>
    );
  }

  if (spotsLeft <= 0) {
    return (
      <div className="text-center py-8">
        <p className="text-lg font-semibold text-[#C9A84C]">Bu etkinlik dolmuştur.</p>
        <p className="text-sm text-[#F5EEE0]/50 mt-2">Diğer etkinliklere göz atın!</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && <p className="text-sm text-red-400 bg-red-900/20 p-3">{error}</p>}

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-[#F5EEE0]/70 mb-1.5">Ad Soyad *</label>
        <input
          type="text"
          required
          value={form.fullName}
          onChange={(e) => setForm({ ...form, fullName: e.target.value })}
          className="w-full bg-[#130909] border border-[#F5EEE0]/15 px-4 py-3 text-sm text-[#F5EEE0] placeholder:text-[#F5EEE0]/30 focus:border-[#C9A84C] focus:outline-none transition"
          placeholder="Adınız ve soyadınız"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-[#F5EEE0]/70 mb-1.5">Telefon *</label>
        <input
          type="tel"
          required
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className="w-full bg-[#130909] border border-[#F5EEE0]/15 px-4 py-3 text-sm text-[#F5EEE0] placeholder:text-[#F5EEE0]/30 focus:border-[#C9A84C] focus:outline-none transition"
          placeholder="05XX XXX XX XX"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-[#F5EEE0]/70 mb-1.5">E-posta *</label>
        <input
          type="email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full bg-[#130909] border border-[#F5EEE0]/15 px-4 py-3 text-sm text-[#F5EEE0] placeholder:text-[#F5EEE0]/30 focus:border-[#C9A84C] focus:outline-none transition"
          placeholder="ornek@email.com"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-[#F5EEE0]/70 mb-1.5">Kişi Sayısı *</label>
        <input
          type="number"
          min={1}
          max={spotsLeft}
          required
          value={form.guestCount}
          onChange={(e) => setForm({ ...form, guestCount: parseInt(e.target.value) || 1 })}
          className="w-full bg-[#130909] border border-[#F5EEE0]/15 px-4 py-3 text-sm text-[#F5EEE0] focus:border-[#C9A84C] focus:outline-none transition"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-[#F5EEE0]/70 mb-1.5">Mesaj</label>
        <textarea
          value={form.specialRequest}
          onChange={(e) => setForm({ ...form, specialRequest: e.target.value })}
          rows={3}
          className="w-full bg-[#130909] border border-[#F5EEE0]/15 px-4 py-3 text-sm text-[#F5EEE0] placeholder:text-[#F5EEE0]/30 focus:border-[#C9A84C] focus:outline-none transition resize-none"
          placeholder="Varsa belirtmek istediğiniz bir şey..."
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#7A1020] py-3.5 text-sm font-semibold uppercase tracking-wider hover:bg-[#93162A] transition disabled:opacity-60 flex items-center justify-center gap-2"
      >
        {loading && <Loader2 size={16} className="animate-spin" />}
        Rezervasyonu Tamamla
      </button>
    </form>
  );
}
