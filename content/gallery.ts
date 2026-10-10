// GALERİ — fotoğraflar public/venue klasörüne konur, buraya bir satır eklenir.
// Alanlar arşivdeki veritabanı şemasıyla (GalleryPhoto) aynıdır.
export interface GalleryPhoto {
  id: string;
  imageUrl: string;
  caption: string | null;
  order: number;
}

export const GALLERY: GalleryPhoto[] = [
  { id: 'mekan-ayna', imageUrl: '/venue/mekan-ayna.jpg', caption: 'Bordo duvarlar ve antik ayna', order: 1 },
  { id: 'sofra-menu', imageUrl: '/venue/sofra-menu.jpg', caption: 'Özenli sofra düzeni', order: 2 },
  { id: 'kismet-salon', imageUrl: '/venue/kismet-salon.jpg', caption: 'All is Kismet', order: 3 },
  { id: 'teras-sofra', imageUrl: '/venue/teras-sofra.jpg', caption: 'Uzun sofra ve kristal lambalar', order: 4 },
];
