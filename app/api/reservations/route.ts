export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminSession } from '@/lib/admin-auth';

const RESERVATION_EMAIL = 'maksatmuhabbet.event@gmail.com';

async function sendReservationEmail(data: {
  fullName: string;
  phone: string;
  email: string;
  guestCount: number;
  message: string | null;
  eventTitle: string | null;
  eventDate: Date | null;
  reservationDate: Date | null;
}) {
  const apiKey = process.env.ABACUSAI_API_KEY;
  const notifId = process.env.NOTIF_ID_REZERVASYON_BILDIRIMI;
  const appId = process.env.WEB_APP_ID;
  if (!apiKey || !notifId || !appId) return;

  const tr = (d: Date | null) =>
    d ? new Date(d).toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric', timeZone: 'Europe/Istanbul' }) : null;

  const kind = data.eventTitle ? `Etkinlik: ${data.eventTitle}` : 'Genel Rezervasyon';
  const dateLine = data.eventTitle ? tr(data.eventDate) : tr(data.reservationDate);

  const row = (label: string, value: string) =>
    `<tr><td style="padding:8px 12px;font-weight:600;color:#7A1020;white-space:nowrap;vertical-align:top;">${label}</td><td style="padding:8px 12px;color:#222;">${value}</td></tr>`;

  const htmlBody = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
      <h2 style="color:#7A1020;border-bottom:2px solid #C9A84C;padding-bottom:10px;">Yeni Rezervasyon Talebi</h2>
      <table style="width:100%;border-collapse:collapse;background:#faf7f0;border-radius:8px;overflow:hidden;">
        ${row('Tür', kind)}
        ${dateLine ? row('Tarih', dateLine) : ''}
        ${row('Ad Soyad', data.fullName)}
        ${row('Telefon', data.phone)}
        ${row('E-posta', `<a href="mailto:${data.email}">${data.email}</a>`)}
        ${row('Kişi Sayısı', String(data.guestCount))}
        ${data.message ? row('Mesaj', data.message) : ''}
      </table>
      <p style="color:#888;font-size:12px;margin-top:16px;">Maksat Muhabbet web sitesi rezervasyon formu</p>
    </div>`;

  const appUrl = process.env.NEXTAUTH_URL || '';
  const hostname = appUrl ? new URL(appUrl).hostname : 'maksatmuhabbetevent.com';

  const res = await fetch('https://apps.abacus.ai/api/sendNotificationEmail', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      app_id: appId,
      notification_id: notifId,
      subject: `Yeni Rezervasyon — ${data.fullName} (${kind})`,
      body: htmlBody,
      is_html: true,
      recipient_email: RESERVATION_EMAIL,
      reply_to: data.email,
      sender_email: `noreply@${hostname}`,
      sender_alias: 'Maksat Muhabbet',
    }),
  });
  const result = await res.json().catch(() => ({}));
  if (!result?.success && !result?.notification_disabled) {
    throw new Error(result?.message || 'E-posta gönderilemedi');
  }
}

// POST - public reservation
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { eventId, fullName, phone, email, guestCount, specialRequest, message, reservationDate } = body ?? {};

    if (!fullName || !phone || !email || !guestCount) {
      return NextResponse.json({ error: 'Tüm zorunlu alanları doldurun.' }, { status: 400 });
    }

    // Etkinlik rezervasyonu ise kapasite kontrolü yap
    let eventTitle: string | null = null;
    let eventDate: Date | null = null;
    if (eventId) {
      const event = await prisma.event.findUnique({ where: { id: eventId } });
      if (!event) return NextResponse.json({ error: 'Etkinlik bulunamadı.' }, { status: 404 });
      eventTitle = event.title;
      eventDate = event.date;

      const currentCount = await prisma.reservation.aggregate({
        where: { eventId, status: { not: 'CANCELLED' } },
        _sum: { guestCount: true },
      });
      const used = currentCount?._sum?.guestCount ?? 0;
      if (used + parseInt(guestCount) > event.capacity) {
        return NextResponse.json({ error: 'Yeterli yer kalmamıştır.' }, { status: 400 });
      }
    }

    const finalMessage = message || specialRequest || null;
    const reservation = await prisma.reservation.create({
      data: {
        eventId: eventId || null,
        fullName,
        phone,
        email,
        guestCount: parseInt(guestCount),
        reservationDate: reservationDate ? new Date(reservationDate) : null,
        specialRequest: finalMessage,
        status: 'PENDING',
      },
    });

    // Mekan sahibine e-posta bildirimi gönder (hata olsa bile rezervasyonu etkilemez)
    try {
      await sendReservationEmail({
        fullName,
        phone,
        email,
        guestCount: parseInt(guestCount),
        message: finalMessage,
        eventTitle,
        eventDate,
        reservationDate: reservationDate ? new Date(reservationDate) : null,
      });
    } catch (mailErr) {
      console.error('Rezervasyon e-postası gönderilemedi:', mailErr);
    }

    return NextResponse.json(reservation, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Hata' }, { status: 500 });
  }
}

// GET - admin only
export async function GET(req: NextRequest) {
  try {
    const admin = await getAdminSession();
    if (!admin) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const eventId = searchParams.get('eventId');
    const status = searchParams.get('status');

    const where: any = {};
    if (eventId) where.eventId = eventId;
    if (status) where.status = status;

    const reservations = await prisma.reservation.findMany({
      where,
      include: { event: { select: { title: true, date: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(reservations);
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Hata' }, { status: 500 });
  }
}
