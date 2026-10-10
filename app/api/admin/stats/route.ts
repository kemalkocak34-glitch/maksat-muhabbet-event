export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminSession } from '@/lib/admin-auth';

export async function GET() {
  try {
    const admin = await getAdminSession();
    if (!admin) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });

    const [totalEvents, pendingRes, confirmedRes, galleryCount, recentReservations] = await Promise.all([
      prisma.event.count(),
      prisma.reservation.count({ where: { status: 'PENDING' } }),
      prisma.reservation.count({ where: { status: 'CONFIRMED' } }),
      prisma.galleryPhoto.count(),
      prisma.reservation.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: { event: { select: { title: true } } },
      }),
    ]);

    return NextResponse.json({
      totalEvents,
      pendingRes,
      confirmedRes,
      galleryCount,
      recentReservations,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Hata' }, { status: 500 });
  }
}
