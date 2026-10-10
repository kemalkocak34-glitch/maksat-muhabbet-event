# Admin paneli arşivi

Bu klasör, sitenin ilk sürümündeki admin panelini ve veritabanı kodunu içerir. Site şu an
bunları kullanmıyor ve bu klasör derlemeye girmiyor. Panel gerektiğinde buradan geri alınır.

## İçindekiler
- `app/admin/` — panel sayfaları: etkinlikler, rezervasyonlar, galeri, site içeriği, giriş
- `app/api/` — panelin ve rezervasyon formunun kullandığı uçlar
- `components/admin-shell.tsx` — panel çerçevesi
- `lib/` — veritabanı bağlantısı (Prisma), oturum (JWT), görsel yükleme (S3)
- `prisma/schema.prisma` — tablolar: Event, Reservation, GalleryPhoto, SiteContent, AdminUser
- `scripts/seed.ts` — başlangıç verisi

## Panele geçiş adımları
1. Bir PostgreSQL veritabanı aç (ör. Neon), adresini `DATABASE_URL` olarak tanımla.
2. Paketleri geri ekle: `@prisma/client`, `prisma`, `bcryptjs`, `jsonwebtoken`,
   `@types/bcryptjs`, `@types/jsonwebtoken`, `tsx`, `dotenv`
   (görsel yükleme için `@aws-sdk/client-s3`, `@aws-sdk/s3-request-presigner` ya da başka bir depolama).
3. Bu klasördeki `app/admin`, `app/api`, `components/admin-shell.tsx`, `lib/*`, `prisma`, `scripts`
   yerlerine geri taşınır; `tsconfig.json` ve `eslint.config.mjs` içindeki `_admin-arsiv` dışlaması kaldırılır.
4. `lib/data.ts` ve `lib/site-content.ts` içindeki fonksiyonlar veritabanından okuyacak şekilde değiştirilir.
   Sayfalar veriyi yalnızca bu fonksiyonlarla aldığı için tasarıma dokunulmaz.
5. `content/events.ts` ve `content/gallery.ts` içindeki kayıtlar veritabanına aktarılır (alan adları şemayla aynı).
6. Rezervasyon formları WhatsApp'a ek olarak `/api/reservations` ucuna da kayıt atar.

## Geri almadan önce düzeltilmesi gerekenler
- `scripts/seed.ts` içinde sabit admin şifresi var; yeni ve güçlü bir şifre belirlenmeli.
- `lib/admin-auth.ts` sabit bir yedek JWT anahtarı içeriyor; kaldırılıp `ADMIN_JWT_SECRET` zorunlu yapılmalı.
- `app/api/reservations/route.ts` e-postayı Abacus servisiyle gönderiyor; başka bir e-posta servisine çevrilmeli.
- `prisma/schema.prisma` içindeki `binaryTargets` yayın ortamına göre ayarlanmalı.
