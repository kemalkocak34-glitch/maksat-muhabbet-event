"use client";

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Loader2, CalendarDays } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import { tr } from 'date-fns/locale';
import { format } from 'date-fns';

export default function ReservationClient() {
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    reservationDate: '',
    guestCount: 1,
    message: '',
  });
  const [calendarOpen, setCalendarOpen] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);
  const [today, setToday] = useState<Date | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Bugünün tarihini client-side belirle (SSR uyumlu)
  useEffect(() => { setToday(new Date()); }, []);

  // Dışına tıklayınca takvimi kapat
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (calendarRef.current && !calendarRef.current.contains(e.target as Node)) {
        setCalendarOpen(false);
      }
    }
    if (calendarOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [calendarOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
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
        className="text-center py-10"
      >
        <CheckCircle size={48} className="mx-auto text-green-500 mb-4" />
        <h3 className="serif text-2xl font-semibold mb-2">Rezervasyon Talebiniz Alındı!</h3>
        <p className="text-sm text-[#F5EEE0]/60">
          En kısa sürede sizinle iletişime geçeceğiz. Teşekkür ederiz.
        </p>
      </motion.div>
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="relative" ref={calendarRef}>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#F5EEE0]/70 mb-1.5">Tarih *</label>
          <button
            type="button"
            onClick={() => setCalendarOpen(!calendarOpen)}
            className="w-full bg-[#130909] border border-[#F5EEE0]/15 px-4 py-3 text-sm text-left flex items-center justify-between focus:border-[#C9A84C] focus:outline-none transition"
          >
            <span className={form.reservationDate ? 'text-[#F5EEE0]' : 'text-[#F5EEE0]/30'}>
              {form.reservationDate
                ? format(new Date(form.reservationDate + 'T12:00:00'), 'd MMMM yyyy', { locale: tr })
                : 'Tarih seçiniz'}
            </span>
            <CalendarDays size={16} className="text-[#C9A84C]" />
          </button>
          {/* Hidden native input for form validation */}
          <input
            tabIndex={-1}
            required
            value={form.reservationDate}
            onChange={() => {}}
            className="absolute bottom-0 left-0 w-full h-0 opacity-0"
            onInvalid={(e) => {
              (e.target as HTMLInputElement).setCustomValidity('Lütfen bir tarih seçin');
            }}
            onInput={(e) => {
              (e.target as HTMLInputElement).setCustomValidity('');
            }}
          />
          {calendarOpen && (
            <div className="absolute z-50 mt-1 left-0 bg-[#1A0A0A] border border-[#F5EEE0]/15 rounded-lg shadow-2xl p-3">
              <DayPicker
                mode="single"
                locale={tr}
                selected={form.reservationDate ? new Date(form.reservationDate + 'T12:00:00') : undefined}
                onSelect={(day) => {
                  if (day) {
                    const y = day.getFullYear();
                    const m = String(day.getMonth() + 1).padStart(2, '0');
                    const d = String(day.getDate()).padStart(2, '0');
                    setForm({ ...form, reservationDate: `${y}-${m}-${d}` });
                  }
                  setCalendarOpen(false);
                }}
                disabled={today ? { before: today } : undefined}
                showOutsideDays
                className="rdp-maksat"
              />
            </div>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#F5EEE0]/70 mb-1.5">Kişi Sayısı *</label>
          <input
            type="number"
            min={1}
            required
            value={form.guestCount}
            onChange={(e) => setForm({ ...form, guestCount: parseInt(e.target.value) || 1 })}
            className="w-full bg-[#130909] border border-[#F5EEE0]/15 px-4 py-3 text-sm text-[#F5EEE0] focus:border-[#C9A84C] focus:outline-none transition"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-[#F5EEE0]/70 mb-1.5">Mesaj</label>
        <textarea
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          rows={4}
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
