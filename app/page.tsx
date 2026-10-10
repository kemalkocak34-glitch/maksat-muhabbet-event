export const dynamic = "force-dynamic";

import Image from 'next/image';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import PublicHeader from '@/components/public-header';
import PublicFooter from '@/components/public-footer';
import HomeClient from '@/components/home-client';
import { getSiteContent } from '@/lib/site-content';
import { ArrowRight } from 'lucide-react';

export default async function HomePage() {
  const c = await getSiteContent();
  const events = await prisma.event.findMany({
    where: { isActive: true, date: { gte: new Date() } },
    orderBy: { date: 'asc' },
    take: 3,
  });

  const gallery = await prisma.galleryPhoto.findMany({
    orderBy: { order: 'asc' },
    take: 4,
  });

  return (
    <>
      <PublicHeader />

      {/* HERO */}
      <header className="relative min-h-screen overflow-hidden">
        <Image
          src="/venue/mekan-ayna.jpg"
          alt="Maksat Muhabbet salonu"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#130909]/80 via-[#130909]/40 to-[#130909]" />

        <section className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 pb-20 text-center pt-28">
          <div className="mb-6 flex items-center gap-4 text-[#C9A84C]">
            <span className="h-px w-12 bg-[#C9A84C]" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.3em]">{c.hero_label}</span>
            <span className="h-px w-12 bg-[#C9A84C]" />
          </div>
          <h1 className="serif max-w-[900px] text-5xl sm:text-6xl lg:text-[78px] leading-[0.98] font-semibold tracking-tight">
            {c.hero_title_1}<br />
            <span className="italic text-[#E7D4B4]">{c.hero_title_2}</span>
          </h1>
          <p className="mt-7 max-w-[640px] text-base leading-7 text-[#F5EEE0]/75">
            {c.hero_desc}
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-4">
            <Link
              href="/etkinlikler"
              className="bg-[#7A1020] px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.14em] hover:bg-[#93162A] transition"
            >
              {c.hero_cta1}
            </Link>
            <Link
              href="/etkinlikler"
              className="border border-[#F5EEE0]/40 px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.14em] hover:bg-[#F5EEE0] hover:text-[#130909] transition"
            >
              {c.hero_cta2}
            </Link>
          </div>

        </section>
      </header>

      <main>


        {/* YAKLAŞAN ETKİNLİKLER */}
        <section className="bg-[#1A0A0A] py-24">
          <div className="mx-auto max-w-[1200px] px-6 lg:px-10">
            <div className="mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#C9A84C]">{c.home_events_label}</p>
                <h2 className="serif text-4xl lg:text-[52px] font-semibold">{c.home_events_title}</h2>
              </div>
              <Link href="/etkinlikler" className="border-b border-[#C9A84C] pb-1 text-xs font-semibold uppercase tracking-[0.14em] hover:text-[#C9A84C] transition">
                Tüm Etkinlikler
              </Link>
            </div>

            <HomeClient events={JSON.parse(JSON.stringify(events ?? []))} />
          </div>
        </section>

        {/* GALERİ STRIP */}
        <section className="py-24">
          <div className="mx-auto max-w-[1200px] px-6 lg:px-10 mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#C9A84C]">{c.home_gallery_label}</p>
              <h2 className="serif text-4xl lg:text-[52px] font-semibold">{c.home_gallery_title}</h2>
            </div>
            <Link href="/galeri" className="text-xs uppercase tracking-[0.14em] text-[#F5EEE0]/60 flex items-center gap-2 hover:text-[#C9A84C] transition">
              Galeriyi Gör <ArrowRight size={14} className="text-[#C9A84C]" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5 px-4">
            {(gallery ?? []).map((photo: any) => (
              <div key={photo?.id} className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={photo?.imageUrl ?? '/venue/mekan-ayna.jpg'}
                  alt={photo?.caption ?? 'Maksat Muhabbet'}
                  fill
                  className="object-cover photo-zoom"
                />
              </div>
            ))}
          </div>
        </section>
      </main>

      <PublicFooter />
    </>
  );
}
