export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminSession } from '@/lib/admin-auth';

export async function GET() {
  try {
    const photos = await prisma.galleryPhoto.findMany({ orderBy: { order: 'asc' } });
    return NextResponse.json(photos);
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Hata' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await getAdminSession();
    if (!admin) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });

    const body = await req.json();
    const maxOrder = await prisma.galleryPhoto.aggregate({ _max: { order: true } });
    const photo = await prisma.galleryPhoto.create({
      data: {
        imageUrl: body.imageUrl,
        isPublicImage: body.isPublicImage ?? true,
        caption: body.caption ?? null,
        order: (maxOrder?._max?.order ?? 0) + 1,
      },
    });
    return NextResponse.json(photo, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Hata' }, { status: 500 });
  }
}
