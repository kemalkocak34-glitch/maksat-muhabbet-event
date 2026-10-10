export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminSession } from '@/lib/admin-auth';

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const admin = await getAdminSession();
    if (!admin) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });

    await prisma.galleryPhoto.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Hata' }, { status: 500 });
  }
}
