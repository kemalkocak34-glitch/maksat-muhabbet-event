"use client";

import AdminShell from '@/components/admin-shell';
import { useEffect, useState, useCallback } from 'react';
import { Plus, Trash2, Loader2 } from 'lucide-react';
import Image from 'next/image';

export default function AdminGalleryPage() {
  const [photos, setPhotos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const fetchPhotos = useCallback(async () => {
    try {
      const res = await fetch('/api/gallery');
      const data = await res.json();
      setPhotos(data ?? []);
    } catch {} finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchPhotos(); }, [fetchPhotos]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target?.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const presignRes = await fetch('/api/upload/presigned', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName: file.name, contentType: file.type, isPublic: true }),
      });
      const { uploadUrl, cloud_storage_path } = await presignRes.json();
      await fetch(uploadUrl, { method: 'PUT', body: file, headers: { 'Content-Type': file.type } });
      const urlRes = await fetch(`/api/upload/url?path=${encodeURIComponent(cloud_storage_path)}&isPublic=true`);
      const { url } = await urlRes.json();
      await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl: url, isPublicImage: true }),
      });
      fetchPhotos();
    } catch (err) { console.error(err); } finally { setUploading(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu fotoğrafı silmek istediğinize emin misiniz?')) return;
    await fetch(`/api/gallery/${id}`, { method: 'DELETE' });
    fetchPhotos();
  };

  return (
    <AdminShell>
      <div className="flex items-center justify-between mb-8">
        <h1 className="serif text-3xl font-semibold">Galeri</h1>
        <label className="flex items-center gap-2 bg-[#7A1020] px-4 py-2 text-xs font-semibold uppercase tracking-wider hover:bg-[#93162A] transition cursor-pointer">
          {uploading ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
          Fotoğraf Ekle
          <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
        </label>
      </div>

      {loading ? (
        <p className="text-center text-[#F5EEE0]/40 py-12">Yükleniyor...</p>
      ) : (photos ?? []).length === 0 ? (
        <p className="text-center text-[#F5EEE0]/40 py-12">Henüz fotoğraf eklenmemiş.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {(photos ?? []).map((p: any) => (
            <div key={p?.id} className="relative group">
              <div className="relative aspect-square overflow-hidden bg-[#1A0A0A]">
                <Image src={p?.imageUrl ?? '/venue/mekan-ayna.jpg'} alt={p?.caption ?? 'Galeri'} fill className="object-cover" />
              </div>
              <button
                onClick={() => handleDelete(p?.id)}
                className="absolute top-2 right-2 bg-red-600/80 p-1.5 rounded opacity-0 group-hover:opacity-100 transition hover:bg-red-600"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </AdminShell>
  );
}
