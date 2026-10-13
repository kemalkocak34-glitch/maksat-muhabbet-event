// Saatte bir yeniden üretilir; tarihi geçen etkinlik ana sayfadan kendiliğinden düşer.
export const revalidate = 3600;

import Image from 'next/image';
import Link from 'next/link';
import { getUpcomingEvents, getGalleryPhotos } from '@/lib/data';
import PublicHeader from '@/components/public-header';
import PublicFooter from '@/components/public-footer';
import HomeClient from '@/components/home-client';
import { getSiteContent } from '@/lib/site-content';
import { ArrowRight } from 'lucide-react';

export default async function HomePage() {
  const c = await getSiteContent();
  const events = await getUpcomingEvents(3);
  const gallery = await getGalleryPhotos(4);

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
        <div className="absolute inset-0 bg-gradient-to-b from-[#94585A]/80 via-[#94585A]/40 to-[#94585A]" />

        <section className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 pb-20 text-center pt-28">
          {c.hero_label && (
            <div className="mb-6 flex items-center gap-4 text-[#F0D592]">
              <span className="h-px w-12 bg-[#F0D592]" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.3em]">{c.hero_label}</span>
              <span className="h-px w-12 bg-[#F0D592]" />
            </div>
          )}
          <h1 className="serif max-w-[900px] text-5xl sm:text-6xl lg:text-[78px] leading-[0.98] font-semibold tracking-tight">
            {c.hero_title_1}<br />
            <span className="italic text-[#F7E6C4]">{c.hero_title_2}</span>
          </h1>
          <p className="mt-7 max-w-[640px] text-base leading-7 text-[#F5EEE0]/75">
            {c.hero_desc}
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-4">
            <Link
              href="/etkinlikler"
              className="bg-[#5C2629] px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.14em] hover:bg-[#6E3134] transition"
            >
              {c.hero_cta1}
            </Link>
            <Link
              href="/rezervasyon"
              className="border border-[#F5EEE0]/40 px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.14em] hover:bg-[#F5EEE0] hover:text-[#94585A] transition"
            >
              {c.hero_cta2}
            </Link>
          </div>

        </section>
      </header>

      <main>


        {/* YAKLAŞAN ETKİNLİKLER */}
        <section className="bg-[#8A4D50] py-24">
          <div className="mx-auto max-w-[1200px] px-6 lg:px-10">
            <div className="mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#F0D592]">{c.home_events_label}</p>
                <h2 className="serif text-4xl lg:text-[52px] font-semibold">{c.home_events_title}</h2>
              </div>
              <Link href="/etkinlikler" className="border-b border-[#F0D592] pb-1 text-xs font-semibold uppercase tracking-[0.14em] hover:text-[#F0D592] transition">
                Tüm Etkinlikler
              </Link>
            </div>

            <HomeClient events={events} />
          </div>
        </section>

        {/* GALERİ STRIP */}
        <section className="py-24">
          <div className="mx-auto max-w-[1200px] px-6 lg:px-10 mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#F0D592]">{c.home_gallery_label}</p>
              <h2 className="serif text-4xl lg:text-[52px] font-semibold">{c.home_gallery_title}</h2>
            </div>
            <Link href="/galeri" className="text-xs uppercase tracking-[0.14em] text-[#F5EEE0]/60 flex items-center gap-2 hover:text-[#F0D592] transition">
              Galeriyi Gör <ArrowRight size={14} className="text-[#F0D592]" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5 px-4">
            {gallery.map((photo) => (
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
