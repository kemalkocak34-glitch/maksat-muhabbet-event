"use client";

import { useState, useRef, useEffect } from 'react';
import { CalendarDays } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import { tr } from 'date-fns/locale';
import { format } from 'date-fns';
import { whatsappUrl, track } from '@/lib/contact';
import { WhatsAppIcon } from '@/components/contact-fab';
import WhatsAppSent from '@/components/whatsapp-sent';

export default function ReservationClient() {
  const [form, setForm] = useState({
    fullName: '',
    reservationDate: '',
    guestCount: 2,
    message: '',
  });
  const [calendarOpen, setCalendarOpen] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);
  const [today, setToday] = useState<Date | null>(null);
  const [sentUrl, setSentUrl] = useState<string | null>(null);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dateText = format(new Date(form.reservationDate + 'T12:00:00'), 'd MMMM yyyy, EEEE', { locale: tr });
    const lines = [
      'Merhaba, Maksat Muhabbet için rezervasyon yapmak istiyorum.',
      `Tarih: ${dateText}`,
      `Ad Soyad: ${form.fullName.trim()}`,
      `Kişi sayısı: ${form.guestCount}`,
    ];
    if (form.message.trim()) lines.push(`Not: ${form.message.trim()}`);
    const url = whatsappUrl(lines.join('\n'));
    track('reservation_submit', { type: 'general', guests: form.guestCount });
    // Açılır pencere engellenirse aynı sekmede aç
    const win = window.open(url, '_blank');
    if (win) win.opener = null;
    else window.location.href = url;
    setSentUrl(url);
  };

  if (sentUrl) return <WhatsAppSent url={sentUrl} onEdit={() => setSentUrl(null)} />;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
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
        className="w-full bg-[#7A1020] py-3.5 text-sm font-semibold uppercase tracking-wider hover:bg-[#93162A] transition flex items-center justify-center gap-2"
      >
        <WhatsAppIcon size={18} />
        WhatsApp ile Rezervasyon
      </button>
      <p className="text-center text-xs text-[#F5EEE0]/40">
        Talebiniz WhatsApp üzerinden iletilir; yeriniz onay mesajıyla kesinleşir.
      </p>
    </form>
  );
}
