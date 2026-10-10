export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { signAdminToken } from '@/lib/admin-auth';

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();
    if (!username || !password) {
      return NextResponse.json({ error: 'Kullan\u0131c\u0131 ad\u0131 ve \u015fifre gerekli.' }, { status: 400 });
    }

    const user = await prisma.adminUser.findUnique({ where: { username } });
    if (!user) {
      return NextResponse.json({ error: 'Ge\u00e7ersiz kullan\u0131c\u0131 ad\u0131 veya \u015fifre.' }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: 'Ge\u00e7ersiz kullan\u0131c\u0131 ad\u0131 veya \u015fifre.' }, { status: 401 });
    }

    const token = signAdminToken({ id: user.id, username: user.username });

    const res = NextResponse.json({ ok: true, username: user.username });
    res.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24,
    });
    return res;
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Hata' }, { status: 500 });
  }
}
