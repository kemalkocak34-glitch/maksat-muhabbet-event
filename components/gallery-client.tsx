"use client";

import Image from 'next/image';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface Photo {
  id: string;
  imageUrl: string;
  caption: string | null;
}

export default function GalleryClient({ photos }: { photos: Photo[] }) {
  const [selected, setSelected] = useState<Photo | null>(null);
  const safePhotos = photos ?? [];

  if (safePhotos.length === 0) {
    return <p className="text-center text-[#F5EEE0]/40 py-16">Hen\u00fcz foto\u011fraf eklenmemi\u015f.</p>;
  }

  return (
    <>
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-3 space-y-3">
        {safePhotos.map((photo: Photo, i: number) => (
          <motion.div
            key={photo?.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06 }}
            className="break-inside-avoid cursor-pointer overflow-hidden"
            onClick={() => setSelected(photo)}
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src={photo?.imageUrl ?? '/venue/mekan-ayna.jpg'}
                alt={photo?.caption ?? 'Maksat Muhabbet'}
                fill
                className="object-cover photo-zoom"
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
            onClick={() => setSelected(null)}
          >
            <button
              className="absolute top-6 right-6 text-white hover:text-[#C9A84C] transition"
              onClick={() => setSelected(null)}
            >
              <X size={28} />
            </button>
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-w-4xl max-h-[85vh] w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full h-[70vh]">
                <Image
                  src={selected?.imageUrl ?? '/venue/mekan-ayna.jpg'}
                  alt={selected?.caption ?? ''}
                  fill
                  className="object-contain"
                />
              </div>
              {selected?.caption && (
                <p className="text-center text-sm text-[#F5EEE0]/60 mt-4">{selected.caption}</p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
