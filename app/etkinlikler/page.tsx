export const dynamic = "force-dynamic";

import { prisma } from '@/lib/prisma';
import PublicHeader from '@/components/public-header';
import PublicFooter from '@/components/public-footer';
import EventsClient from '@/components/events-client';
import { getSiteContent } from '@/lib/site-content';

export const metadata = { title: 'Etkinlikler — Maksat Muhabbet' };

export default async function EtkinliklerPage() {
  const c = await getSiteContent();
  const allEvents = await prisma.event.findMany({
    where: { isActive: true },
    orderBy: { date: 'asc' },
  });

  return (
    <>
      <PublicHeader />
      <main className="pt-20 min-h-screen">
        <section className="mx-auto max-w-[1200px] px-6 lg:px-10 py-20">
          <div className="mb-12">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#C9A84C]">{c.events_label}</p>
            <h1 className="serif text-4xl lg:text-[56px] font-semibold">{c.events_title}</h1>
          </div>
          <EventsClient events={JSON.parse(JSON.stringify(allEvents ?? []))} />
        </section>
      </main>
      <PublicFooter />
    </>
  );
}
