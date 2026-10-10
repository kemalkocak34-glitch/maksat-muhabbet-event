export const revalidate = 3600;

import type { Metadata } from 'next';
import { getActiveEvents, getEventBySlug } from '@/lib/data';
import { notFound } from 'next/navigation';
import PublicHeader from '@/components/public-header';
import PublicFooter from '@/components/public-footer';
import EventDetailClient from '@/components/event-detail-client';
import EventGallery from '@/components/event-gallery';
import Image from 'next/image';
import { Calendar, Clock, Users, Utensils } from 'lucide-react';
import { getSiteContent } from '@/lib/site-content';
import { CONTACT } from '@/content/site';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.maksatmuhabbetevent.com';

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getActiveEvents()).map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(decodeURIComponent(slug));
  if (!event) return { title: 'Etkinlik bulunamadı | Maksat Muhabbet' };
  const when = new Date(event.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', timeZone: 'Europe/Istanbul' });
  const description = `${event.shortDescription} ${when}, Maksat Ocakbaşı Teras, Beyoğlu. Taksim’e ve Nevizade’ye yürüme mesafesinde.`;
  return {
    title: `${event.title} | ${when}, Beyoğlu Etkinlik`,
    description,
    alternates: { canonical: `/etkinlikler/${event.slug}` },
    openGraph: {
      title: event.title,
      description,
      images: [event.imageUrl ?? '/og-image.png'],
    },
  };
}

export default async function EventDetailPage({ params }: Props) {
  const { slug } = await params;
  const c = await getSiteContent();
  const event = await getEventBySlug(decodeURIComponent(slug));
  if (!event) notFound();

  const isPast = new Date(event.date).getTime() < Date.now();
  const closed = isPast || event.soldOut === true;

  const d = new Date(event.date);
  const dateStr = d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Istanbul' });
  const dayStr = d.toLocaleDateString('tr-TR', { weekday: 'long', timeZone: 'Europe/Istanbul' });
  const timeStr = d.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Istanbul' });

  // Google'ın etkinliği tarih ve mekânıyla tanıması için yapılandırılmış veri (schema.org Event)
  const eventUrl = `${SITE_URL}/etkinlikler/${event.slug}`;
  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title,
    description: event.shortDescription,
    startDate: event.date,
    ...(event.endTime ? { endDate: `${event.date.slice(0, 11)}${event.endTime}:00${event.date.slice(19)}` } : {}),
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    image: [`${SITE_URL}${event.imageUrl ?? '/og-image.png'}`],
    url: eventUrl,
    location: {
      '@type': 'Place',
      name: 'Maksat Ocakbaşı Teras',
      address: {
        '@type': 'PostalAddress',
        streetAddress: CONTACT.addressLines[0],
        postalCode: '34435',
        addressLocality: 'Beyoğlu',
        addressRegion: 'İstanbul',
        addressCountry: 'TR',
      },
    },
    organizer: { '@type': 'Organization', name: 'Maksat Muhabbet Event', url: SITE_URL },
    ...(event.price > 0
      ? {
          offers: {
            '@type': 'Offer',
            price: event.price,
            priceCurrency: 'TRY',
            url: eventUrl,
            availability: closed ? 'https://schema.org/SoldOut' : 'https://schema.org/InStock',
          },
        }
      : {}),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PublicHeader />
      <main className="pt-20 min-h-screen">
        {/* HERO */}
        <section className="relative h-[50vh] min-h-[400px] overflow-hidden">
          <Image
            src={event.imageUrl ?? '/venue/mekan-ayna.jpg'}
            alt={event.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#130909] via-[#130909]/50 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-10">
            <div className="mx-auto max-w-[1200px]">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#C9A84C]">{dayStr}</p>
              <h1 className="serif text-3xl sm:text-4xl lg:text-[56px] font-semibold leading-tight">{event.title}</h1>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1200px] px-6 lg:px-10 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* SOL: Detaylar */}
            <div className="lg:col-span-7 space-y-10">
              {/* Meta */}
              <div className="flex flex-wrap gap-6 text-sm text-[#F5EEE0]/70">
                <span className="flex items-center gap-2"><Calendar size={16} className="text-[#C9A84C]" /> {dateStr}</span>
                <span className="flex items-center gap-2"><Clock size={16} className="text-[#C9A84C]" /> {event.endTime ? `${timeStr} - ${event.endTime}` : timeStr}</span>
                <span className="flex items-center gap-2"><Users size={16} className="text-[#C9A84C]" /> {isPast ? 'Etkinlik sona erdi' : event.soldOut ? 'Doldu!' : 'Sınırlı kontenjan'}</span>
              </div>

              {/* Açıklama */}
              <div>
                <h2 className="serif text-2xl font-semibold mb-4">{c.event_about_heading}</h2>
                <p className="text-[#F5EEE0]/70 leading-7 whitespace-pre-line">{event.description}</p>
              </div>

              {/* Neler Dahil */}
              <div className="bg-[#1A0A0A] border border-[#F5EEE0]/8 p-6">
                <h3 className="flex items-center gap-2 serif text-xl font-semibold mb-4">
                  <Utensils size={18} className="text-[#C9A84C]" /> {event.includedHeading ?? c.event_included_heading}
                </h3>
                <div className="text-sm text-[#F5EEE0]/65 leading-7 whitespace-pre-line">{event.whatsIncluded}</div>
              </div>

              {/* Fiyat */}
              <div className="flex items-baseline gap-2">
                {event.priceDetail ? (
                  <span className="serif text-2xl sm:text-3xl font-semibold text-[#C9A84C]">{event.priceDetail}</span>
                ) : event.priceLabel ? (
                  <span className="serif text-3xl font-semibold text-[#C9A84C]">{event.priceLabel}</span>
                ) : (
                  <>
                    <span className="serif text-3xl font-semibold text-[#C9A84C]">₺{event.price.toLocaleString('tr-TR')}</span>
                    <span className="text-sm text-[#F5EEE0]/50">/ kişi başı</span>
                  </>
                )}
              </div>
            </div>

            {/* SAĞ: Rezervasyon Formu */}
            <div className="lg:col-span-5">
              <div className="sticky top-28 bg-[#1A0A0A] border border-[#F5EEE0]/10 p-6 lg:p-8">
                <h2 className="serif text-2xl font-semibold mb-6">{c.event_reserve_heading}</h2>
                <EventDetailClient
                  eventTitle={event.title}
                  eventDate={`${dateStr}, ${timeStr}`}
                  closed={closed}
                  closedReason={isPast ? 'past' : 'soldOut'}
                />
              </div>
            </div>
          </div>

          {event.gallery && event.gallery.length > 0 && (
            <div className="mt-20">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#C9A84C]">Galeri</p>
              <h2 className="serif text-3xl lg:text-4xl font-semibold mb-8">Etkinlikten Kareler</h2>
              <EventGallery images={event.gallery} title={event.title} />
            </div>
          )}
        </section>
      </main>
      <PublicFooter />
    </>
  );
}
