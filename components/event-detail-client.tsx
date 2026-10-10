"use client";

import { useState } from 'react';
import Link from 'next/link';
import { whatsappUrl, track } from '@/lib/contact';
import { WhatsAppIcon } from '@/components/contact-fab';
import WhatsAppSent from '@/components/whatsapp-sent';

const inputClass =
  'w-full bg-[#130909] border border-[#F5EEE0]/15 px-4 py-3 text-sm text-[#F5EEE0] placeholder:text-[#F5EEE0]/30 focus:border-[#C9A84C] focus:outline-none transition';
const labelClass = 'block text-xs font-semibold uppercase tracking-wider text-[#F5EEE0]/70 mb-1.5';

interface Props {
  eventTitle: string;
  eventDate: string;
  closed: boolean;
  closedReason: 'past' | 'soldOut';
}

export default function EventDetailClient({ eventTitle, eventDate, closed, closedReason }: Props) {
  const [form, setForm] = useState({ fullName: '', guestCount: 2, note: '' });
  const [sentUrl, setSentUrl] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const lines = [
      `Merhaba, "${eventTitle}" etkinliği için rezervasyon yapmak istiyorum.`,
      `Tarih: ${eventDate}`,
      `Ad Soyad: ${form.fullName.trim()}`,
      `Kişi sayısı: ${form.guestCount}`,
    ];
    if (form.note.trim()) lines.push(`Not: ${form.note.trim()}`);
    const url = whatsappUrl(lines.join('\n'));
    track('reservation_submit', { type: 'event', event_title: eventTitle, guests: form.guestCount });
    // Açılır pencere engellenirse aynı sekmede aç
    const win = window.open(url, '_blank');
    if (win) win.opener = null;
    else window.location.href = url;
    setSentUrl(url);
  };

  if (closed) {
    return (
      <div className="text-center py-8">
        <p className="text-lg font-semibold text-[#C9A84C]">
          {closedReason === 'past' ? 'Bu etkinlik sona erdi.' : 'Bu etkinlik dolmuştur.'}
        </p>
        <Link href="/etkinlikler" className="mt-3 inline-block text-sm text-[#F5EEE0]/60 underline hover:text-[#C9A84C] transition">
          Diğer etkinliklere göz atın
        </Link>
      </div>
    );
  }

  if (sentUrl) return <WhatsAppSent url={sentUrl} onEdit={() => setSentUrl(null)} />;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="ev-name" className={labelClass}>Ad Soyad *</label>
        <input
          id="ev-name"
          type="text"
          required
          autoComplete="name"
          value={form.fullName}
          onChange={(e) => setForm({ ...form, fullName: e.target.value })}
          className={inputClass}
          placeholder="Adınız ve soyadınız"
        />
      </div>

      <div>
        <label htmlFor="ev-guests" className={labelClass}>Kişi Sayısı *</label>
        <input
          id="ev-guests"
          type="number"
          min={1}
          max={50}
          required
          value={form.guestCount}
          onChange={(e) => setForm({ ...form, guestCount: parseInt(e.target.value) || 1 })}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="ev-note" className={labelClass}>Mesaj</label>
        <textarea
          id="ev-note"
          value={form.note}
          onChange={(e) => setForm({ ...form, note: e.target.value })}
          rows={3}
          className={`${inputClass} resize-none`}
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
