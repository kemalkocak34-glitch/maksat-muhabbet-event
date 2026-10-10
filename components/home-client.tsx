"use client";

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface EventCard {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  date: string;
  price: number;
  imageUrl: string | null;
}

export default function HomeClient({ events }: { events: EventCard[] }) {
  const safeEvents = events ?? [];

  if (safeEvents.length === 0) {
    return (
      <p className="text-center text-[#F5EEE0]/50 py-12">
        Henüz planlanmış etkinlik bulunmuyor. Yakında buradayız!
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {safeEvents.map((ev: EventCard, i: number) => {
        const d = new Date(ev?.date);
        const dateStr = d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', timeZone: 'Europe/Istanbul' });
        const timeStr = d.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Istanbul' });
        return (
          <motion.article
            key={ev?.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.12, duration: 0.5 }}
            className="group bg-[#241112] border border-[#F5EEE0]/8 overflow-hidden flex flex-col h-full"
          >
            <div className="relative h-[260px] lg:h-[300px] overflow-hidden">
              <Image
                src={ev?.imageUrl ?? '/venue/mekan-ayna.jpg'}
                alt={ev?.title ?? 'Etkinlik'}
                fill
                className="object-cover photo-zoom"
              />
            </div>
            <div className="p-6 flex flex-col flex-1">
              <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.14em] text-[#C9A84C]">
                <span>{dateStr} · {timeStr}</span>
                <span>₺{(ev?.price ?? 0).toLocaleString('tr-TR')}</span>
              </div>
              <h3 className="serif mt-4 text-2xl lg:text-[28px] leading-tight line-clamp-2 min-h-[60px] lg:min-h-[70px]">{ev?.title}</h3>
              <p className="mt-3 text-sm leading-6 text-[#F5EEE0]/55 line-clamp-2">{ev?.shortDescription}</p>
              <Link
                href={`/etkinlikler/${ev?.slug}`}
                className="mt-auto pt-5 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] hover:text-[#C9A84C] transition"
              >
                Detayı Gör <ArrowRight size={14} className="text-[#C9A84C]" />
              </Link>
            </div>
          </motion.article>
        );
      })}
    </div>
  );
}
