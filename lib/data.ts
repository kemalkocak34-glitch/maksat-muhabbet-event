// VERİ KATMANI
// Sayfalar veriyi yalnızca bu dosyadaki fonksiyonlarla okur; verinin nereden geldiğini bilmez.
// Şu an kaynak `content/` klasöründeki dosyalar. Admin paneline geçildiğinde yalnızca bu
// dosyanın içi veritabanı sorgularıyla değiştirilir (bkz. _admin-arsiv/README.md);
// sayfalara ve tasarıma dokunmak gerekmez. Fonksiyonlar bu yüzden şimdiden async.
import { EVENTS, type SiteEvent } from '@/content/events';
import { GALLERY, type GalleryPhoto } from '@/content/gallery';

export type { SiteEvent, GalleryPhoto };

const byDate = (a: SiteEvent, b: SiteEvent) =>
  new Date(a.date).getTime() - new Date(b.date).getTime();

/** Yayındaki tüm etkinlikler (geçmiş + gelecek), tarihe göre sıralı. */
export async function getActiveEvents(): Promise<SiteEvent[]> {
  return EVENTS.filter((e) => e.isActive).sort(byDate);
}

/** Tarihi geçmemiş etkinlikler. */
export async function getUpcomingEvents(take?: number): Promise<SiteEvent[]> {
  const now = Date.now();
  const list = (await getActiveEvents()).filter((e) => new Date(e.date).getTime() >= now);
  return typeof take === 'number' ? list.slice(0, take) : list;
}

export async function getEventBySlug(slug: string): Promise<SiteEvent | null> {
  return EVENTS.find((e) => e.isActive && e.slug === slug) ?? null;
}

export async function getGalleryPhotos(take?: number): Promise<GalleryPhoto[]> {
  const list = [...GALLERY].sort((a, b) => a.order - b.order);
  return typeof take === 'number' ? list.slice(0, take) : list;
}
