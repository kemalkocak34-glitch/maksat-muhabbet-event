import { Cormorant_Garamond, Montserrat, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/sonner';
import { ChunkLoadErrorHandler } from '@/components/chunk-load-error-handler';
import ContactFab from '@/components/contact-fab';
import Gtm from '@/components/gtm';

const cormorant = Cormorant_Garamond({
  subsets: ['latin', 'latin-ext'],
  weight: ['500', '600', '700'],
  variable: '--font-serif',
});
const montserrat = Montserrat({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
});
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.maksatmuhabbetevent.com'),
  title: 'Maksat Muhabbet Event | Beyoğlu ve Taksim’de Etkinlik, Rakı Sofrası',
  description:
    'Beyoğlu Balıkpazarı’nda, Nevizade’nin yanı başında ve Taksim’e yürüme mesafesinde etkinlik mekânı. Rakı sofrası, canlı müzik ve Beyoğlu nostaljisi Maksat Ocakbaşı’nın terasında. Etkinlikler ve rezervasyon.',
  keywords: [
    'Taksim Etkinlik',
    'Beyoğlu Etkinlik',
    'Rakı Sofrası',
    'Nevizade Etkinlik',
    'Nevizade Rakı Sofrası',
    'Beyoğlu Nostalji',
  ],
  alternates: { canonical: '/' },
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
  },
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    siteName: 'Maksat Muhabbet Event',
    title: 'Maksat Muhabbet Event | Beyoğlu ve Taksim’de Etkinlik, Rakı Sofrası',
    description: 'Nevizade’nin yanı başında rakı sofrası, canlı müzik ve Beyoğlu nostaljisi. Etkinlikler ve rezervasyon.',
    images: ['/og-image.png'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body
        className={`${cormorant.variable} ${montserrat.variable} ${jetbrainsMono.variable} font-sans bg-[#130909] text-[#F5EEE0] antialiased`}
      >
        <Gtm />
        {children}
        <ContactFab />
        <Toaster />
        <ChunkLoadErrorHandler />
      </body>
    </html>
  );
}
