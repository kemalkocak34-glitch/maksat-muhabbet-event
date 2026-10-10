"use client";

import AdminShell from '@/components/admin-shell';
import { useEffect, useState, useCallback } from 'react';
import { Loader2, Save, Check } from 'lucide-react';

interface Field {
  key: string;
  label: string;
  group: string;
  type: 'text' | 'textarea' | 'url';
  default: string;
  help?: string;
}

export default function AdminSiteContentPage() {
  const [fields, setFields] = useState<Field[]>([]);
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const fetchContent = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/content');
      if (!res.ok) throw new Error();
      const data = await res.json();
      setFields(data?.fields ?? []);
      setValues(data?.values ?? {});
    } catch {
      setError('İçerik yüklenemedi.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchContent(); }, [fetchContent]);

  const handleChange = (key: string, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSaved(false);
    try {
      const res = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ values }),
      });
      if (!res.ok) throw new Error();
      setSaved(true);
      setTimeout(() => setSaved(false), 4000);
    } catch {
      setError('Kaydedilemedi. Lütfen tekrar deneyin.');
    } finally {
      setSaving(false);
    }
  };

  // Alanları gruplara ayır
  const groups: { name: string; items: Field[] }[] = [];
  for (const f of fields) {
    let g = groups.find((x) => x.name === f.group);
    if (!g) { g = { name: f.group, items: [] }; groups.push(g); }
    g.items.push(f);
  }

  return (
    <AdminShell>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
        <div>
          <h1 className="serif text-3xl font-semibold">Site İçeriği</h1>
          <p className="text-sm text-[#F5EEE0]/50 mt-1">Sitedeki metinleri buradan düzenleyin. Kaydettikten sonra değişiklikler sitede görünür.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving || loading}
          className="flex items-center gap-2 bg-[#7A1020] px-5 py-3 text-xs font-semibold uppercase tracking-wider hover:bg-[#93162A] transition disabled:opacity-60 whitespace-nowrap self-start"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : saved ? <Check size={16} /> : <Save size={16} />}
          {saved ? 'Kaydedildi' : 'Değişiklikleri Kaydet'}
        </button>
      </div>

      {error && <p className="text-sm text-red-400 bg-red-900/20 p-3 mb-6">{error}</p>}

      {loading ? (
        <p className="text-center text-[#F5EEE0]/40 py-16">Yükleniyor...</p>
      ) : (
        <div className="space-y-10 mt-8 max-w-3xl">
          {groups.map((group) => (
            <section key={group.name} className="bg-[#1A0A0A] border border-[#F5EEE0]/8 p-6">
              <h2 className="serif text-xl font-semibold text-[#C9A84C] mb-5">{group.name}</h2>
              <div className="space-y-5">
                {group.items.map((f) => (
                  <div key={f.key}>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#F5EEE0]/70 mb-1.5">{f.label}</label>
                    {f.type === 'textarea' ? (
                      <textarea
                        value={values[f.key] ?? ''}
                        onChange={(e) => handleChange(f.key, e.target.value)}
                        rows={3}
                        className="w-full bg-[#130909] border border-[#F5EEE0]/15 px-4 py-3 text-sm text-[#F5EEE0] placeholder:text-[#F5EEE0]/30 focus:border-[#C9A84C] focus:outline-none transition resize-y"
                      />
                    ) : (
                      <input
                        type={f.type === 'url' ? 'url' : 'text'}
                        value={values[f.key] ?? ''}
                        onChange={(e) => handleChange(f.key, e.target.value)}
                        placeholder={f.type === 'url' ? 'https://...' : ''}
                        className="w-full bg-[#130909] border border-[#F5EEE0]/15 px-4 py-3 text-sm text-[#F5EEE0] placeholder:text-[#F5EEE0]/30 focus:border-[#C9A84C] focus:outline-none transition"
                      />
                    )}
                    {f.help && <p className="text-[11px] text-[#F5EEE0]/40 mt-1.5">{f.help}</p>}
                  </div>
                ))}
              </div>
            </section>
          ))}

          <div className="flex justify-end pb-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 bg-[#7A1020] px-5 py-3 text-xs font-semibold uppercase tracking-wider hover:bg-[#93162A] transition disabled:opacity-60"
            >
              {saving ? <Loader2 size={16} className="animate-spin" /> : saved ? <Check size={16} /> : <Save size={16} />}
              {saved ? 'Kaydedildi' : 'Değişiklikleri Kaydet'}
            </button>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
