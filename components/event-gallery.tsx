"use client";

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

// Etkinlik detay sayfasındaki "Etkinlikten Kareler" bölümü.
// Küçük görsele tıklanınca fotoğraf tam ekranda açılır; ok tuşları ve Esc çalışır.
export default function EventGallery({ images, title }: { images: string[]; title: string }) {
  const [open, setOpen] = useState<number | null>(null);
  const count = images.length;

  const close = useCallback(() => setOpen(null), []);
  const step = useCallback(
    (dir: 1 | -1) => setOpen((i) => (i === null ? i : (i + dir + count) % count)),
    [count],
  );

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, close, step]);

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {images.map((src, i) => (
          <button
            key={src}
            type="button"
            onClick={() => setOpen(i)}
            aria-label={`${title} fotoğraf ${i + 1}`}
            className="group relative aspect-[4/5] overflow-hidden border border-[#F5EEE0]/8 bg-[#A26467] focus:outline-none focus-visible:border-[#F0D592]"
          >
            <Image
              src={src}
              alt={`${title} fotoğraf ${i + 1}`}
              fill
              sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw"
              className="object-cover photo-zoom"
            />
          </button>
        ))}
      </div>

      {open !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Etkinlikten Kareler"
          onClick={close}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#6E3A3C]/95 p-4 sm:p-10"
        >
          <button
            type="button"
            onClick={close}
            aria-label="Kapat"
            className="absolute right-4 top-4 p-2 text-[#F5EEE0]/70 hover:text-[#F0D592] transition"
          >
            <X size={28} />
          </button>
          {count > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); step(-1); }}
                aria-label="Önceki fotoğraf"
                className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 p-2 text-[#F5EEE0]/70 hover:text-[#F0D592] transition"
              >
                <ChevronLeft size={36} />
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); step(1); }}
                aria-label="Sonraki fotoğraf"
                className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 p-2 text-[#F5EEE0]/70 hover:text-[#F0D592] transition"
              >
                <ChevronRight size={36} />
              </button>
            </>
          )}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={images[open]}
            alt={`${title} fotoğraf ${open + 1}`}
            onClick={(e) => e.stopPropagation()}
            className="max-h-full max-w-full object-contain"
          />
          <p className="absolute bottom-4 left-0 right-0 text-center text-[11px] uppercase tracking-[0.2em] text-[#F5EEE0]/50">
            {open + 1} / {count}
          </p>
        </div>
      )}
    </>
  );
}
