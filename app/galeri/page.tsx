import { getGalleryPhotos } from '@/lib/data';
import PublicHeader from '@/components/public-header';
import PublicFooter from '@/components/public-footer';
import GalleryClient from '@/components/gallery-client';
import { getSiteContent } from '@/lib/site-content';

export const metadata = { title: 'Galeri \u2014 Maksat Muhabbet' };

export default async function GaleriPage() {
  const c = await getSiteContent();
  const photos = await getGalleryPhotos();

  return (
    <>
      <PublicHeader />
      <main className="pt-20 min-h-screen bg-[#0D0505]">
        <section className="mx-auto max-w-[1200px] px-6 lg:px-10 py-20">
          <div className="mb-12">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#C9A84C]">{c.gallery_label}</p>
            <h1 className="serif text-4xl lg:text-[56px] font-semibold">{c.gallery_title}</h1>
          </div>
          <GalleryClient photos={photos} />
        </section>
      </main>
      <PublicFooter />
    </>
  );
}
