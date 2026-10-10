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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://maksatmuhabbetevent.com'),
  title: 'Maksat Muhabbet — Sofranın Etrafında Muhabbet Başlar',
  description: 'Maksat Ocakbaşı\'nın terasında; iyi yemek, özenli müzik ve sahici sohbet. Etkinlikler, özel geceler ve rezervasyon.',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
  },
  openGraph: {
    title: 'Maksat Muhabbet',
    description: 'Sofranın etrafında muhabbet başlar. Etkinlikler ve rezervasyon.',
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
