// GALERİ — fotoğraflar public/venue klasörüne konur, buraya bir satır eklenir.
// Alanlar arşivdeki veritabanı şemasıyla (GalleryPhoto) aynıdır.
export interface GalleryPhoto {
  id: string;
  imageUrl: string;
  caption: string | null;
  order: number;
}

export const GALLERY: GalleryPhoto[] = [
  { id: 'galeri-uzun-sofra', imageUrl: '/venue/galeri-uzun-sofra.jpg', caption: 'Uzun sofrada muhabbet', order: 1 },
  { id: 'galeri-meze-kase', imageUrl: '/venue/galeri-meze-kase.jpg', caption: 'Sofradan bir kase meze', order: 2 },
  { id: 'galeri-teras-lamba', imageUrl: '/venue/galeri-teras-lamba.jpg', caption: 'Kristal lambalar ve teras sofrası', order: 3 },
  { id: 'galeri-dostlar', imageUrl: '/venue/galeri-dostlar.jpg', caption: 'Dostlarla bir gece', order: 4 },
  { id: 'galeri-sofra-ustten', imageUrl: '/venue/galeri-sofra-ustten.jpg', caption: 'Ocakbaşı sofrası', order: 5 },
  { id: 'galeri-kebap-tabak', imageUrl: '/venue/galeri-kebap-tabak.jpg', caption: 'Közden tabağa', order: 6 },
];
