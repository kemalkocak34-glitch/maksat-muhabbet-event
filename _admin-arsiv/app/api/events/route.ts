export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminSession } from '@/lib/admin-auth';

// GET /api/events - public list
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const all = searchParams.get('all') === 'true';

    const events = await prisma.event.findMany({
      where: all ? {} : { isActive: true },
      orderBy: { date: 'asc' },
      include: { _count: { select: { reservations: true } } },
    });
    return NextResponse.json(events);
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Hata' }, { status: 500 });
  }
}

// POST /api/events - admin only
export async function POST(req: NextRequest) {
  try {
    const admin = await getAdminSession();
    if (!admin) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });

    const body = await req.json();
    const slug = (body?.title ?? '')
      .toLowerCase()
      .replace(/[^a-z0-9\u00e7\u011f\u0131\u00f6\u015f\u00fc]+/g, '-')
      .replace(/(^-|-$)/g, '') + '-' + Date.now().toString(36);

    const event = await prisma.event.create({
      data: {
        title: body.title,
        slug,
        description: body.description ?? '',
        shortDescription: body.shortDescription ?? '',
        date: new Date(body.date),
        price: parseInt(body.price) || 0,
        capacity: parseInt(body.capacity) || 50,
        whatsIncluded: body.whatsIncluded ?? '',
        imageUrl: body.imageUrl ?? null,
        isPublicImage: body.isPublicImage ?? true,
        isActive: body.isActive ?? true,
      },
    });
    return NextResponse.json(event, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Hata' }, { status: 500 });
  }
}
