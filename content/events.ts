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
  endTime?: string; // bitiş saati, örn. '23:45'; yazılırsa saat "18:30 - 23:45" görünür
  priceLabel?: string; // yazılırsa fiyat yerine bu metin görünür, örn. 'Özel Davet'
  includedHeading?: string; // "Neler Dahil" başlığı yerine bu etkinliğe özel başlık
  gallery?: string[]; // etkinlikten kareler; görseller public/events/<slug>/ klasörüne konur
}

export const EVENTS: SiteEvent[] = [
  {
    id: 'mudavim-sofrasi',
    title: 'Maksat Muhabbet Event Müdavim Sofrası',
    slug: 'mudavim-sofrasi',
    description:
      'Kelimelerin birbirine karıştığı, saatlerin hesapsızca aktığı bir akşam hayal edin.\n\n14 Ağustos akşamı, Maksat Ocakbaşı’nın yıllardır büyüyen o samimi bağlarını aynı sofranın çevresinde topluyoruz. Masaları dolaşan sahte telaşların ve gürültünün olmadığı; sesini kısmadan konuşabileceğin, iyi seçilmiş müziklerin ve her tabağa özenle can veren bir mutfağın eşlik edeceği telaşsız bir teras akşamına davetlisiniz. Eskinin o sıcak "aile katı" duygusunu yeniden hissetmek, tanıdık yüzlerle kadeh kaldırmak ve uzun uzun muhabbet etmek için 14 Ağustos’ta sofradaki yerini ayırtmayı unutma!',
    shortDescription: 'Tanıdık yüzler, iyi seçilmiş müzikler ve telaşsız bir teras akşamı.',
    date: '2026-08-14T18:30:00+03:00',
    endTime: '23:45',
    price: 0,
    priceLabel: 'Özel Davet',
    capacity: 0,
    includedHeading: 'Gecenin Menüsü & Eşlikçileri',
    whatsIncluded:
      'Başlangıç: Mevsim Kavunu, Beyaz Leblebi, Sıcak Pide, Tulum Peyniri, Tereyağı\nMezeler: Domates Kurusu, Patlıcan Salatası, Girit Ezmesi, Pilaki, Fava, Maksat Özel Salata\nAra Sıcak: Fındık Lahmacun\nAna Yemek: Adana Kebap, Çöp Şiş, Tavuk Şiş\nTatlı: Maksat Özel Tatlı\n\nMenü, 4 kişilik paylaşımlı servis sunulacaktır. 20cl kişi başı anason servis edilecektir.',
    imageUrl: '/events/mudavim-sofrasi/kapak.jpg',
    gallery: [
      '/events/mudavim-sofrasi/01.jpg',
      '/events/mudavim-sofrasi/02.jpg',
      '/events/mudavim-sofrasi/03.jpg',
      '/events/mudavim-sofrasi/04.jpg',
      '/events/mudavim-sofrasi/05.jpg',
      '/events/mudavim-sofrasi/06.jpg',
      '/events/mudavim-sofrasi/07.jpg',
      '/events/mudavim-sofrasi/08.jpg',
      '/events/mudavim-sofrasi/09.jpg',
      '/events/mudavim-sofrasi/10.jpg',
    ],
    isActive: true,
  },
  {
    id: 'raki-sohbetleri',
    title: 'Rakı Sohbetleri: Canlı Müzik Gecesi',
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
