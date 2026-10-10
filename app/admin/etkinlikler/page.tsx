"use client";

import AdminShell from '@/components/admin-shell';
import { useEffect, useState, useCallback } from 'react';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
interface EventItem {
  id: string;
  title: string;
  date: string;
  price: number;
  capacity: number;
  isActive: boolean;
  imageUrl: string | null;
  _count?: { reservations: number };
}

export default function AdminEventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: '', description: '', shortDescription: '', date: '',
    price: '', capacity: '50', whatsIncluded: '', isActive: true, imageUrl: '',
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const fetchEvents = useCallback(async () => {
    try {
      const res = await fetch('/api/events?all=true');
      const data = await res.json();
      setEvents(data ?? []);
    } catch {} finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchEvents(); }, [fetchEvents]);

  const resetForm = () => {
    setForm({ title: '', description: '', shortDescription: '', date: '', price: '', capacity: '50', whatsIncluded: '', isActive: true, imageUrl: '' });
    setEditId(null);
    setShowForm(false);
  };

  const handleEdit = (ev: EventItem) => {
    setEditId(ev.id);
    const d = new Date(ev.date);
    const localDate = d.toISOString().slice(0, 16);
    setForm({
      title: ev.title,
      description: '', shortDescription: '',
      date: localDate,
      price: String(ev.price),
      capacity: String(ev.capacity),
      whatsIncluded: '',
      isActive: ev.isActive,
      imageUrl: ev.imageUrl ?? '',
    });
    // fetch full event to populate remaining fields
    fetch(`/api/events/${ev.id}`).then(r => r.json()).then((full: any) => {
      setForm(prev => ({
        ...prev,
        description: full?.description ?? '',
        shortDescription: full?.shortDescription ?? '',
        whatsIncluded: full?.whatsIncluded ?? '',
      }));
    }).catch(() => {});
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu etkinliği silmek istediğinize emin misiniz?')) return;
    await fetch(`/api/events/${id}`, { method: 'DELETE' });
    fetchEvents();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
      // Get the public URL
      const urlRes = await fetch(`/api/upload/url?path=${encodeURIComponent(cloud_storage_path)}&isPublic=true`);
      const { url } = await urlRes.json();
      setForm(prev => ({ ...prev, imageUrl: url }));
    } catch (err) {
      console.error('Upload error', err);
    } finally { setUploading(false); }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const url = editId ? `/api/events/${editId}` : '/api/events';
      const method = editId ? 'PUT' : 'POST';
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      resetForm();
      fetchEvents();
    } catch {} finally { setSaving(false); }
  };

  return (
    <AdminShell>
      <div className="flex items-center justify-between mb-8">
        <h1 className="serif text-3xl font-semibold">Etkinlikler</h1>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="flex items-center gap-2 bg-[#7A1020] px-4 py-2 text-xs font-semibold uppercase tracking-wider hover:bg-[#93162A] transition"
        >
          <Plus size={16} /> Yeni Etkinlik
        </button>
      </div>

      {showForm && (
        <div className="bg-[#1A0A0A] border border-[#F5EEE0]/10 p-6 mb-8">
          <h2 className="serif text-xl font-semibold mb-4">{editId ? 'Etkinliği Düzenle' : 'Yeni Etkinlik Ekle'}</h2>
          <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#F5EEE0]/70 mb-1">Etkinlik Adı *</label>
              <input required value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} className="w-full bg-[#130909] border border-[#F5EEE0]/15 px-3 py-2 text-sm focus:border-[#C9A84C] focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#F5EEE0]/70 mb-1">Tarih ve Saat *</label>
              <input type="datetime-local" required value={form.date} onChange={(e) => setForm({...form, date: e.target.value})} className="w-full bg-[#130909] border border-[#F5EEE0]/15 px-3 py-2 text-sm focus:border-[#C9A84C] focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#F5EEE0]/70 mb-1">Fiyat (₺) *</label>
              <input type="number" required value={form.price} onChange={(e) => setForm({...form, price: e.target.value})} className="w-full bg-[#130909] border border-[#F5EEE0]/15 px-3 py-2 text-sm focus:border-[#C9A84C] focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#F5EEE0]/70 mb-1">Kapasite</label>
              <input type="number" value={form.capacity} onChange={(e) => setForm({...form, capacity: e.target.value})} className="w-full bg-[#130909] border border-[#F5EEE0]/15 px-3 py-2 text-sm focus:border-[#C9A84C] focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#F5EEE0]/70 mb-1">Fotoğraf</label>
              <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full text-xs text-[#F5EEE0]/60" />
              {uploading && <p className="text-xs text-[#C9A84C] mt-1">Yükleniyor...</p>}
              {form.imageUrl && <p className="text-xs text-green-400 mt-1 truncate">✓ Fotoğraf yüklendi</p>}
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#F5EEE0]/70 mb-1">Kısa Açıklama</label>
              <input value={form.shortDescription} onChange={(e) => setForm({...form, shortDescription: e.target.value})} className="w-full bg-[#130909] border border-[#F5EEE0]/15 px-3 py-2 text-sm focus:border-[#C9A84C] focus:outline-none" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#F5EEE0]/70 mb-1">Detaylı Açıklama</label>
              <textarea rows={4} value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} className="w-full bg-[#130909] border border-[#F5EEE0]/15 px-3 py-2 text-sm focus:border-[#C9A84C] focus:outline-none resize-none" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#F5EEE0]/70 mb-1">Neler Dahil</label>
              <textarea rows={3} value={form.whatsIncluded} onChange={(e) => setForm({...form, whatsIncluded: e.target.value})} className="w-full bg-[#130909] border border-[#F5EEE0]/15 px-3 py-2 text-sm focus:border-[#C9A84C] focus:outline-none resize-none" />
            </div>
            <div className="flex items-center gap-3">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#F5EEE0]/70">Aktif</label>
              <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({...form, isActive: e.target.checked})} className="h-4 w-4" />
            </div>
            <div className="md:col-span-2 flex gap-3">
              <button type="submit" disabled={saving} className="bg-[#7A1020] px-6 py-2 text-xs font-semibold uppercase tracking-wider hover:bg-[#93162A] transition disabled:opacity-60 flex items-center gap-2">
                {saving && <Loader2 size={14} className="animate-spin" />}
                {editId ? 'Güncelle' : 'Kaydet'}
              </button>
              <button type="button" onClick={resetForm} className="border border-[#F5EEE0]/20 px-6 py-2 text-xs font-semibold uppercase tracking-wider hover:bg-[#F5EEE0]/5 transition">
                İptal
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <p className="text-center text-[#F5EEE0]/40 py-12">Yükleniyor...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#F5EEE0]/10 text-left text-xs uppercase tracking-wider text-[#F5EEE0]/40">
                <th className="pb-3 pr-4">Etkinlik</th>
                <th className="pb-3 pr-4">Tarih</th>
                <th className="pb-3 pr-4">Fiyat</th>
                <th className="pb-3 pr-4">Kapasite</th>
                <th className="pb-3 pr-4">Durum</th>
                <th className="pb-3">İşlem</th>
              </tr>
            </thead>
            <tbody>
              {(events ?? []).map((ev: EventItem) => {
                const d = new Date(ev?.date);
                return (
                  <tr key={ev?.id} className="border-b border-[#F5EEE0]/5">
                    <td className="py-3 pr-4 font-medium">{ev?.title}</td>
                    <td className="py-3 pr-4 text-[#F5EEE0]/60">{d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Europe/Istanbul' })}</td>
                    <td className="py-3 pr-4">₺{(ev?.price ?? 0).toLocaleString('tr-TR')}</td>
                    <td className="py-3 pr-4">{ev?.capacity}</td>
                    <td className="py-3 pr-4">
                      <span className={`text-xs font-semibold px-2 py-1 rounded ${ev?.isActive ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
                        {ev?.isActive ? 'Aktif' : 'Pasif'}
                      </span>
                    </td>
                    <td className="py-3 flex gap-2">
                      <button onClick={() => handleEdit(ev)} className="text-[#C9A84C] hover:text-[#F5EEE0] transition"><Pencil size={16} /></button>
                      <button onClick={() => handleDelete(ev?.id)} className="text-red-400/60 hover:text-red-400 transition"><Trash2 size={16} /></button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </AdminShell>
  );
}
