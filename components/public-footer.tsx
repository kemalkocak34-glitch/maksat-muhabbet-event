import Link from 'next/link';
import Image from 'next/image';
import { Instagram, Facebook, MapPin, Phone, Mail } from 'lucide-react';
import { getSiteContent } from '@/lib/site-content';
import { CONTACT } from '@/content/site';
import { whatsappUrl } from '@/lib/contact';
import { WhatsAppIcon } from '@/components/contact-fab';

export default async function PublicFooter() {
  const c = await getSiteContent();
  const addressLines = (c.footer_address ?? '').split('\n').filter(Boolean);

  return (
    <footer id="iletisim" className="border-t border-[#C9A84C]/20 bg-[#0D0505]">
      <div className="mx-auto max-w-[1200px] px-6 lg:px-10 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-14">
          {/* Logo & desc */}
          <div className="md:col-span-4">
            <Image src="/venue/logo-v2.png" alt="Maksat Muhabbet" width={338} height={135} className="h-[135px] w-auto object-contain" />
            <p className="mt-4 max-w-xs text-sm leading-6 text-[#F5EEE0]/50">
              {c.footer_desc}
            </p>
          </div>

          {/* Keşfet */}
          <div className="md:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#C9A84C]">Keşfet</p>
            <div className="mt-4 space-y-3 text-sm text-[#F5EEE0]/60">
              <Link href="/etkinlikler" className="block hover:text-[#C9A84C] transition">Etkinlikler</Link>
              <Link href="/galeri" className="block hover:text-[#C9A84C] transition">Galeri</Link>
              <Link href="/rezervasyon" className="block hover:text-[#C9A84C] transition">Rezervasyon</Link>
            </div>
          </div>

          {/* İletişim */}
          <div className="md:col-span-3">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#C9A84C]">Bize Ulaşın</p>
            <div className="mt-4 space-y-3 text-sm text-[#F5EEE0]/60">
              {CONTACT.mapsUrl ? (
                <a href={CONTACT.mapsUrl} target="_blank" rel="noopener noreferrer" className="flex items-start gap-2 hover:text-[#C9A84C] transition"><MapPin size={14} className="mt-1 text-[#C9A84C] flex-shrink-0" /> <span>{addressLines.map((line, i) => (<span key={i}>{line}{i < addressLines.length - 1 && <br/>}</span>))}</span></a>
              ) : (
                <p className="flex items-start gap-2"><MapPin size={14} className="mt-1 text-[#C9A84C] flex-shrink-0" /> <span>{addressLines.map((line, i) => (<span key={i}>{line}{i < addressLines.length - 1 && <br/>}</span>))}</span></p>
              )}
              <a href={whatsappUrl('Merhaba, Maksat Muhabbet hakkında bilgi almak istiyorum.')} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-[#C9A84C] transition"><WhatsAppIcon size={14} className="text-[#C9A84C] flex-shrink-0" /> <span>WhatsApp’tan yazın</span></a>
              <a href={`tel:${c.footer_phone.replace(/[^+\d]/g, '')}`} className="flex items-center gap-2 hover:text-[#C9A84C] transition"><Phone size={14} className="text-[#C9A84C] flex-shrink-0" /> <span suppressHydrationWarning>{c.footer_phone}</span></a>
              <a href={`mailto:${c.footer_email}`} className="flex items-center gap-2 hover:text-[#C9A84C] transition"><Mail size={14} className="text-[#C9A84C] flex-shrink-0" /> <span suppressHydrationWarning>{c.footer_email}</span></a>
            </div>
          </div>

          {/* Sosyal */}
          <div className="md:col-span-3">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#C9A84C]">Takip Edin</p>
            <p className="mt-4 text-sm text-[#F5EEE0]/50">{c.footer_social_blurb}</p>
            {(c.social_instagram || c.social_facebook) && (
              <div className="mt-4 flex gap-3">
                {c.social_instagram && (
                  <a href={c.social_instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="flex h-10 w-10 items-center justify-center border border-[#F5EEE0]/15 hover:border-[#C9A84C] hover:text-[#C9A84C] transition">
                    <Instagram size={16} />
                  </a>
                )}
                {c.social_facebook && (
                  <a href={c.social_facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="flex h-10 w-10 items-center justify-center border border-[#F5EEE0]/15 hover:border-[#C9A84C] hover:text-[#C9A84C] transition">
                    <Facebook size={16} />
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between border-t border-[#F5EEE0]/10 pt-6 text-[10px] uppercase tracking-[0.14em] text-[#F5EEE0]/30 gap-2">
          <p>{c.footer_copyright}</p>
        </div>
      </div>
    </footer>
  );
}
