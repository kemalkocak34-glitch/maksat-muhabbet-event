import type { MetadataRoute } from 'next';
import { getActiveEvents } from '@/lib/data';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.maksatmuhabbetevent.com';

// Site haritası: /sitemap.xml adresinde yayınlanır. Yeni etkinlikler kendiliğinden eklenir.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const events = (await getActiveEvents()).filter((e) => !e.linkUrl);
  return [
    { url: `${SITE_URL}/`, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/etkinlikler`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SITE_URL}/rezervasyon`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/galeri`, changeFrequency: 'monthly', priority: 0.6 },
    ...events.map((e) => ({
      url: `${SITE_URL}/etkinlikler/${e.slug}`,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
  ];
}
