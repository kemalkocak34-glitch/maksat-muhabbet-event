export const revalidate = 3600;

import { getActiveEvents } from '@/lib/data';
import PublicHeader from '@/components/public-header';
import PublicFooter from '@/components/public-footer';
import EventsClient from '@/components/events-client';
import { getSiteContent } from '@/lib/site-content';

export const metadata = {
  title: 'Beyoğlu ve Taksim Etkinlikleri | Rakı Sofrası Geceleri | Maksat Muhabbet',
  description:
    'Taksim ve Beyoğlu etkinlik takvimi: Nevizade’nin yanı başında rakı sofrası geceleri, canlı müzik ve nostalji akşamları. Yaklaşan etkinlikleri inceleyin, yerinizi ayırtın.',
  alternates: { canonical: '/etkinlikler' },
};

export default async function EtkinliklerPage() {
  const c = await getSiteContent();
  const allEvents = await getActiveEvents();

  return (
    <>
      <PublicHeader />
      <main className="pt-20 min-h-screen">
        <section className="mx-auto max-w-[1200px] px-6 lg:px-10 py-20">
          <div className="mb-12">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#F0D592]">{c.events_label}</p>
            <h1 className="serif text-4xl lg:text-[56px] font-semibold">{c.events_title}</h1>
          </div>
          <EventsClient events={allEvents} />
        </section>
      </main>
      <PublicFooter />
    </>
  );
}
