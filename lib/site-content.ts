import { prisma } from '@/lib/prisma';

export type ContentType = 'text' | 'textarea' | 'url';

export interface ContentField {
  key: string;
  label: string;
  group: string;
  type: ContentType;
  default: string;
  help?: string;
}

// Sitedeki tüm düzenlenebilir metin alanları.
// "default" değerleri sitenin mevcut hazır metinleridir; veritabanında
// kayıt yoksa bu değerler kullanılır.
export const CONTENT_FIELDS: ContentField[] = [
  // ---- ANA SAYFA - ÜST BÖLÜM (HERO) ----
  { key: 'hero_label', group: 'Ana Sayfa · Üst Bölüm', type: 'text', label: 'Üst etiket', default: 'Maksat Ocakbaşı’nın Terasında' },
  { key: 'hero_title_1', group: 'Ana Sayfa · Üst Bölüm', type: 'text', label: 'Başlık (1. satır)', default: 'Sofranın Etrafında' },
  { key: 'hero_title_2', group: 'Ana Sayfa · Üst Bölüm', type: 'text', label: 'Başlık (2. satır – vurgulu)', default: 'Muhabbet Başlar' },
  { key: 'hero_desc', group: 'Ana Sayfa · Üst Bölüm', type: 'textarea', label: 'Açıklama metni', default: 'Rakı sohbetleri, canlı müzik ve ocakbaşının dumanı… İstanbul gecelerini aynı sofrada buluşturan samimi bir teras deneyimi.' },
  { key: 'hero_cta1', group: 'Ana Sayfa · Üst Bölüm', type: 'text', label: '1. buton yazısı', default: 'Etkinlikleri Keşfet' },
  { key: 'hero_cta2', group: 'Ana Sayfa · Üst Bölüm', type: 'text', label: '2. buton yazısı', default: 'Rezervasyon Yap' },

  // ---- ANA SAYFA - TANITIM ----
  { key: 'intro_label', group: 'Ana Sayfa · Tanıtım', type: 'text', label: 'Etiket', default: 'Bir Sofradan Fazlası' },
  { key: 'intro_title', group: 'Ana Sayfa · Tanıtım', type: 'textarea', label: 'Başlık', default: 'Kadehler kalkar, hikâyeler anlatılır, gecenin tadı uzar.' },
  { key: 'intro_para', group: 'Ana Sayfa · Tanıtım', type: 'textarea', label: 'Paragraf', default: 'Maksat Muhabbet, Maksat Ocakbaşı’nın terasında; iyi yemek, özenli müzik ve sahici sohbet için kurulan özel bir buluşma noktası.' },

  // ---- ANA SAYFA - BÖLÜM BAŞLIKLARI ----
  { key: 'home_events_label', group: 'Ana Sayfa · Bölüm Başlıkları', type: 'text', label: 'Etkinlikler – etiket', default: 'Rezervasyon Yapın' },
  { key: 'home_events_title', group: 'Ana Sayfa · Bölüm Başlıkları', type: 'text', label: 'Etkinlikler – başlık', default: 'Yaklaşan Etkinlikler' },
  { key: 'home_gallery_label', group: 'Ana Sayfa · Bölüm Başlıkları', type: 'text', label: 'Galeri – etiket', default: 'Maksat Muhabbet' },
  { key: 'home_gallery_title', group: 'Ana Sayfa · Bölüm Başlıkları', type: 'text', label: 'Galeri – başlık', default: 'Seslerin Birbirine Karıştığı An' },

  // ---- ETKİNLİKLER SAYFASI ----
  { key: 'events_label', group: 'Etkinlikler Sayfası', type: 'text', label: 'Etiket', default: 'Program' },
  { key: 'events_title', group: 'Etkinlikler Sayfası', type: 'text', label: 'Başlık', default: 'Etkinlikler' },

  // ---- GALERİ SAYFASI ----
  { key: 'gallery_label', group: 'Galeri Sayfası', type: 'text', label: 'Etiket', default: 'Mekândan Kareler' },
  { key: 'gallery_title', group: 'Galeri Sayfası', type: 'text', label: 'Başlık', default: 'Galeri' },

  // ---- ETKİNLİK DETAY / REZERVASYON SAYFASI ----
  { key: 'event_about_heading', group: 'Etkinlik Detay · Rezervasyon', type: 'text', label: '“Etkinlik Hakkında” başlığı', default: 'Etkinlik Hakkında' },
  { key: 'event_included_heading', group: 'Etkinlik Detay · Rezervasyon', type: 'text', label: '“Neler Dahil” başlığı', default: 'Neler Dahil' },
  { key: 'event_reserve_heading', group: 'Etkinlik Detay · Rezervasyon', type: 'text', label: 'Rezervasyon formu başlığı', default: 'Rezervasyon Yap' },

  { key: 'hero_location', group: 'Ana Sayfa · Karşılama', type: 'text', label: 'Konum etiketi (sol alt)', default: 'Suadiye · İstanbul' },

  // ---- REZERVASYON SAYFASI ----
  { key: 'reservation_label', group: 'Rezervasyon Sayfası', type: 'text', label: 'Üst etiket', default: 'Yerinizi Ayırtın' },
  { key: 'reservation_title', group: 'Rezervasyon Sayfası', type: 'text', label: 'Başlık', default: 'Rezervasyon' },
  { key: 'reservation_desc', group: 'Rezervasyon Sayfası', type: 'textarea', label: 'Açıklama', default: 'Etkinlik olsun olmasın, terasımızda size özel bir sofra hazırlayalım. Formu doldurun, en kısa sürede sizinle iletişime geçelim.' },
  { key: 'reservation_form_heading', group: 'Rezervasyon Sayfası', type: 'text', label: 'Form başlığı', default: 'Rezervasyon Formu' },

  // ---- FOOTER (ALT BİLGİ) ----
  { key: 'footer_desc', group: 'Footer · Alt Bilgi', type: 'textarea', label: 'Logo altı açıklama', default: 'Maksat iyi yemek, güzel müzik ve uzun muhabbet. Terasta yerinizi ayırın.' },
  { key: 'footer_address', group: 'Footer · Alt Bilgi', type: 'textarea', label: 'Adres', default: 'Bağdat Caddesi, Suadiye\nİstanbul', help: 'Her satır ayrı gösterilir.' },
  { key: 'footer_phone', group: 'Footer · Alt Bilgi', type: 'text', label: 'Telefon', default: '+90 (216) 000 00 00' },
  { key: 'footer_email', group: 'Footer · Alt Bilgi', type: 'text', label: 'E-posta', default: 'maksatmuhabbet.event@gmail.com' },
  { key: 'footer_social_blurb', group: 'Footer · Alt Bilgi', type: 'textarea', label: '“Takip Edin” metni', default: 'Yeni geceler ve özel sofralar için bizi takip edin.' },
  { key: 'footer_copyright', group: 'Footer · Alt Bilgi', type: 'text', label: 'Telif / alt yazı (sol)', default: '© 2026 Maksat Muhabbet Event' },
  { key: 'footer_tagline', group: 'Footer · Alt Bilgi', type: 'text', label: 'Alt yazı (sağ)', default: 'Maksat Ocakbaşı’nın Terasında' },

  // ---- SOSYAL MEDYA ----
  { key: 'social_instagram', group: 'Sosyal Medya', type: 'url', label: 'Instagram bağlantısı', default: '', help: 'Boş bırakılırsa Instagram simgesi gizlenir.' },
  { key: 'social_facebook', group: 'Sosyal Medya', type: 'url', label: 'Facebook bağlantısı', default: '', help: 'Boş bırakılırsa Facebook simgesi gizlenir.' },
];

export const CONTENT_DEFAULTS: Record<string, string> = Object.fromEntries(
  CONTENT_FIELDS.map((f) => [f.key, f.default])
);

export const CONTENT_KEYS = CONTENT_FIELDS.map((f) => f.key);

/**
 * Sitenin tüm düzenlenebilir metinlerini döndürür.
 * Veritabanında kayıt olmayan anahtarlar için hazır (default) metin kullanılır.
 */
export async function getSiteContent(): Promise<Record<string, string>> {
  const map: Record<string, string> = { ...CONTENT_DEFAULTS };
  try {
    const rows = await prisma.siteContent.findMany();
    for (const r of rows) {
      if (typeof r.value === 'string') map[r.key] = r.value;
    }
  } catch {
    // Veritabanı erişilemezse hazır metinlerle devam et.
  }
  return map;
}
