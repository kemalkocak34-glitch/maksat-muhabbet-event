export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminSession } from '@/lib/admin-auth';
import { CONTENT_DEFAULTS, CONTENT_KEYS, CONTENT_FIELDS } from '@/lib/site-content';

// Tüm içeriği (varsayılan + kayıtlı) alan meta verisiyle döndürür.
export async function GET() {
  try {
    const admin = await getAdminSession();
    if (!admin) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });

    const values: Record<string, string> = { ...CONTENT_DEFAULTS };
    const rows = await prisma.siteContent.findMany();
    for (const r of rows) {
      if (typeof r.value === 'string') values[r.key] = r.value;
    }
    return NextResponse.json({ fields: CONTENT_FIELDS, values });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Hata' }, { status: 500 });
  }
}

// Toplu kaydetme. Beklenen gövde: { values: { key: value, ... } }
export async function POST(req: NextRequest) {
  try {
    const admin = await getAdminSession();
    if (!admin) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });

    const body = await req.json();
    const incoming = (body?.values ?? {}) as Record<string, unknown>;

    const updates = CONTENT_KEYS.filter((k) => k in incoming).map((key) => {
      const value = String(incoming[key] ?? '');
      return prisma.siteContent.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      });
    });

    await prisma.$transaction(updates);
    return NextResponse.json({ ok: true, saved: updates.length });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Hata' }, { status: 500 });
  }
}
