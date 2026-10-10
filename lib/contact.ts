import { CONTACT } from '@/content/site';

/** Hazır mesajla WhatsApp sohbeti açan bağlantı. */
export function whatsappUrl(text?: string): string {
  const base = `https://wa.me/${CONTACT.whatsapp}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

/**
 * Dönüşüm takibi: Google Tag Manager'a olay gönderir.
 * GTM kurulu değilse sessizce hiçbir şey yapmaz.
 * Olaylar: whatsapp_click, phone_click, reservation_submit
 */
export function track(event: string, params: Record<string, unknown> = {}): void {
  if (typeof window === 'undefined') return;
  const w = window as unknown as { dataLayer?: unknown[] };
  w.dataLayer = w.dataLayer ?? [];
  w.dataLayer.push({ event, ...params });
}
