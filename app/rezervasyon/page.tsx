import PublicHeader from '@/components/public-header';
import PublicFooter from '@/components/public-footer';
import ReservationClient from '@/components/reservation-client';
import { getSiteContent } from '@/lib/site-content';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Rezervasyon | Beyoğlu Rakı Sofrası ve Etkinlik | Maksat Muhabbet',
  description:
    'Taksim’e ve Nevizade’ye yürüme mesafesindeki Maksat Muhabbet’te rakı sofrası ve etkinlik rezervasyonu. Talebiniz WhatsApp üzerinden bize ulaşır.',
  alternates: { canonical: '/rezervasyon' },
};

export default async function RezervasyonPage() {
  const c = await getSiteContent();

  return (
    <>
      <PublicHeader />
      <main className="pt-20 min-h-screen">
        <section className="mx-auto max-w-[760px] px-6 lg:px-10 py-16 lg:py-24">
          <div className="text-center mb-12">
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#C9A84C]">{c.reservation_label}</p>
            <h1 className="serif text-4xl sm:text-5xl font-semibold leading-tight mb-5">{c.reservation_title}</h1>
            <p className="text-[#F5EEE0]/65 leading-7 max-w-[560px] mx-auto">{c.reservation_desc}</p>
          </div>

          <div className="bg-[#1A0A0A] border border-[#F5EEE0]/10 p-6 sm:p-8 lg:p-10">
            <h2 className="serif text-2xl font-semibold mb-6">{c.reservation_form_heading}</h2>
            <ReservationClient />
          </div>
        </section>
      </main>
      <PublicFooter />
    </>
  );
}
