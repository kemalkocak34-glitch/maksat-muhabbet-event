// ETKİNLİKLER — yeni etkinlik eklemek için listeye bir kayıt eklenir.
// Alanlar, arşivdeki veritabanı şemasıyla (Event) bire bir aynıdır; admin paneline
// geçildiğinde bu kayıtlar olduğu gibi veritabanına aktarılır.
export interface SiteEvent {
  id: string;
  title: string;
  slug: string; // adres çubuğundaki ad: /etkinlikler/<slug>
  description: string;
  shortDescription: string;
  date: string; // ISO biçimi, İstanbul saatiyle: 2026-11-15T20:30:00+03:00
  price: number; // kişi başı, TL
  capacity: number;
  whatsIncluded: string; // her satır ayrı gösterilir
  imageUrl: string | null;
  isActive: boolean; // false ise sitede görünmez
  soldOut?: boolean; // true ise "Doldu" yazar, rezervasyon kapanır
}

export const EVENTS: SiteEvent[] = [
  {
    id: 'raki-sohbetleri',
    title: 'Rakı Sohbetleri — Canlı Müzik Gecesi',
    slug: 'raki-sohbetleri-canli-muzik-gecesi',
    description:
      'Fasıl ezgileri eşliğinde, paylaşmalık mezelerin ve ocakbaşı lezzetlerinin sunulduğu samimi bir İstanbul gecesi. Maksat Muhabbet\'in özel terasında, kadehler kalktığında hikâyeler başlar.\n\nGeceye özel menümüz; soğuk mezeler, sıcak ara yemekler, kebap seçkisi ve mevsim tatlarıyla hazırlanmıştır. Müziğimiz ise geleneksel fasıldan modern Türk müziğine uzanan bir yelpazede akacak.',
    shortDescription: 'Fasıl ezgileri, paylaşmalık mezeler ve uzun bir İstanbul gecesi.',
    date: '2026-11-15T20:30:00+03:00',
    price: 850,
    capacity: 40,
    whatsIncluded:
      'Soğuk Mezeler: Peynir, kavun, ocaktan köz, Girit ezmesi, yoğurtlu semizotu, domates kurusu, Maksat salatası\nAra Sıcak: Fındık lahmacun\nAna Yemek: Adana, çöp şiş, yağlı kara\nTatlı & Meyve: Maksat tatlısı, mevsim meyveleri\nBeylerbeyi Rakıları Eşliğinde\nCanlı fasıl müziği',
    imageUrl: '/venue/mekan-ayna.jpg',
    isActive: true,
  },
  {
    id: 'kebap-tadim',
    title: 'Kebap Tadım Akşamı',
    slug: 'kebap-tadim-aksami',
    description:
      'Maksat Ocakbaşı\'nın ustalarının özenle hazırladığı kebap çeşitleri, mevsim mezeleri ve özel eşleşen içeceklerle dolu bir akşam. Her lokmada Güneydoğu\'nun ateşini hissedeceksiniz.\n\nSınırlı sayıda misafir için hazırlanan bu özel menüde, et seçiminden pişirme tekniğine kadar her detay titizlikle planlanmıştır.',
    shortDescription: 'Ustanın seçkisi, mevsim mezeleri ve eşleşen içeceklerle özel menü.',
    date: '2026-11-22T19:30:00+03:00',
    price: 1150,
    capacity: 30,
    whatsIncluded:
      'Hoş Geldin İçeceği\nSoğuk Meze Tabağı (8 çeşit)\nAra Sıcak: Fındık lahmacun, içli köfte\nAna Yemekler: Kuşbaşı, kaburga, beyti\nTatlı: Künefe\nLimitli şarap eşliği',
    imageUrl: '/venue/sofra-menu.jpg',
    isActive: true,
  },
  {
    id: 'ocakbasi-muhabbeti',
    title: 'Ocakbaşı Muhabbeti',
    slug: 'ocakbasi-muhabbeti',
    description:
      'Ateş başında sohbet, şefin sürpriz tabakları ve akustik performans. Maksat Muhabbet\'in en samimi gecesi. Ocağın sıcaklığında, tanımadığınız insanlarla tanışacak, bildiğiniz dostlarla yeni anılar biriktireceksiniz.',
    shortDescription: 'Ateş başında sohbet, şefin sürpriz tabakları ve akustik performans.',
    date: '2026-12-01T20:00:00+03:00',
    price: 950,
    capacity: 35,
    whatsIncluded:
      'Şefin Sürpriz Mezeleri\nOcakbaşı Karışık Et Seçkisi\nAkustik Müzik Performansı\nRakı veya Şarap (sınırsız)\nMevsim Tatlısı',
    imageUrl: '/venue/kismet-salon.jpg',
    isActive: true,
  },
];
