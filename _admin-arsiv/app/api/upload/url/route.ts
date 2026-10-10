export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/admin-auth';
import { getFileUrl } from '@/lib/s3';

export async function GET(req: NextRequest) {
  try {
    const admin = await getAdminSession();
    if (!admin) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const path = searchParams.get('path');
    const isPublic = searchParams.get('isPublic') === 'true';
    if (!path) return NextResponse.json({ error: 'path gerekli' }, { status: 400 });

    const url = await getFileUrl(path, 'image/jpeg', isPublic);
    return NextResponse.json({ url });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Hata' }, { status: 500 });
  }
}
