"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface EventItem {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  date: string;
  price: number;
  priceLabel?: string;
  linkUrl?: string;
  imageUrl: string | null;
}

export default function EventsClient({ events }: { events: EventItem[] }) {
  const [filter, setFilter] = useState<'upcoming' | 'past'>('upcoming');
  const now = new Date();
  const filtered = (events ?? []).filter((e: EventItem) => {
    const d = new Date(e?.date);
    return filter === 'upcoming' ? d >= now : d < now;
  });

  return (
    <>
      <div className="flex gap-4 mb-10">
        <button
          onClick={() => setFilter('upcoming')}
          className={`px-5 py-2 text-xs font-semibold uppercase tracking-wider transition ${
            filter === 'upcoming'
              ? 'bg-[#7A1020] text-[#F5EEE0]'
              : 'border border-[#F5EEE0]/20 text-[#F5EEE0]/60 hover:border-[#C9A84C]'
          }`}
        >
          Yaklaşanlar
        </button>
        <button
          onClick={() => setFilter('past')}
          className={`px-5 py-2 text-xs font-semibold uppercase tracking-wider transition ${
            filter === 'past'
              ? 'bg-[#7A1020] text-[#F5EEE0]'
              : 'border border-[#F5EEE0]/20 text-[#F5EEE0]/60 hover:border-[#C9A84C]'
          }`}
        >
          Geçmiş Etkinlikler
        </button>
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-[#F5EEE0]/40 py-16">Bu kategoride etkinlik bulunmuyor.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((ev: EventItem, i: number) => {
            const d = new Date(ev?.date);
            const dateStr = d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', timeZone: 'Europe/Istanbul' });
            const timeStr = d.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Istanbul' });
            return (
              <motion.article
                key={ev?.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.45 }}
                className="group bg-[#241112] border border-[#F5EEE0]/8 overflow-hidden"
              >
                <div className="relative h-[260px] overflow-hidden">
                  <Image
                    src={ev?.imageUrl ?? '/venue/mekan-ayna.jpg'}
                    alt={ev?.title ?? 'Etkinlik'}
                    fill
                    className="object-cover photo-zoom"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.14em] text-[#C9A84C]">
                    <span>{dateStr} · {timeStr}</span>
                    <span>{ev?.priceLabel ?? `₺${(ev?.price ?? 0).toLocaleString('tr-TR')}`}</span>
                  </div>
                  <h3 className="serif mt-4 text-2xl leading-tight">{ev?.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-[#F5EEE0]/55 line-clamp-2">{ev?.shortDescription}</p>
                  <Link
                    href={ev?.linkUrl ?? `/etkinlikler/${ev?.slug}`}
                    className="mt-5 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] hover:text-[#C9A84C] transition"
                  >
                    {d < now ? 'Etkinliği İncele' : ev?.linkUrl ? 'Rezervasyon' : 'Bilet Al / Rezervasyon'} <ArrowRight size={14} className="text-[#C9A84C]" />
                  </Link>
                </div>
              </motion.article>
            );
          })}
        </div>
      )}
    </>
  );
}
