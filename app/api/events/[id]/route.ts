export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminSession } from '@/lib/admin-auth';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const event = await prisma.event.findUnique({ where: { id } });
    if (!event) return NextResponse.json({ error: 'Bulunamad\u0131' }, { status: 404 });
    return NextResponse.json(event);
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Hata' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const admin = await getAdminSession();
    if (!admin) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });

    const body = await req.json();
    const data: any = {};
    if (body.title !== undefined) data.title = body.title;
    if (body.description !== undefined) data.description = body.description;
    if (body.shortDescription !== undefined) data.shortDescription = body.shortDescription;
    if (body.date !== undefined) data.date = new Date(body.date);
    if (body.price !== undefined) data.price = parseInt(body.price) || 0;
    if (body.capacity !== undefined) data.capacity = parseInt(body.capacity) || 50;
    if (body.whatsIncluded !== undefined) data.whatsIncluded = body.whatsIncluded;
    if (body.imageUrl !== undefined) data.imageUrl = body.imageUrl;
    if (body.isPublicImage !== undefined) data.isPublicImage = body.isPublicImage;
    if (body.isActive !== undefined) data.isActive = body.isActive;

    const event = await prisma.event.update({ where: { id }, data });
    return NextResponse.json(event);
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Hata' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const admin = await getAdminSession();
    if (!admin) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });

    await prisma.event.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Hata' }, { status: 500 });
  }
}
