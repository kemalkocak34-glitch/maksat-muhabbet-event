# Maksat Muhabbet Event — maksatmuhabbetevent.com

Next.js 16 + Tailwind ile yazılmış etkinlik sitesi. Veritabanı yok; içerik kod içindeki dosyalardan okunur,
rezervasyonlar WhatsApp'a düşer.

## İçerik nerede değişir
| Ne | Dosya |
|---|---|
| Telefon, WhatsApp, e-posta, adres, Instagram | `content/site.ts` |
| Etkinlikler | `content/events.ts` |
| Galeri fotoğrafları | `content/gallery.ts` (görseller `public/venue/`) |
| Sayfalardaki başlık ve metinler | `lib/site-content.ts` |

## Takip
`NEXT_PUBLIC_GTM_ID` tanımlanırsa Google Tag Manager yüklenir. Site şu olayları `dataLayer`'a gönderir:
`whatsapp_click`, `phone_click`, `reservation_submit`.

## Admin paneli
İlk sürümdeki panel `_admin-arsiv/` klasöründe duruyor. Geçiş adımları oradaki README'de.

## Çalıştırma
```
npm install
npm run dev
```
