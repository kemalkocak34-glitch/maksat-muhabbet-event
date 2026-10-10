export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/admin-auth';
import { generatePresignedUploadUrl } from '@/lib/s3';

export async function POST(req: NextRequest) {
  try {
    const admin = await getAdminSession();
    if (!admin) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });

    const { fileName, contentType, isPublic } = await req.json();
    if (!fileName || !contentType) {
      return NextResponse.json({ error: 'fileName ve contentType gerekli.' }, { status: 400 });
    }

    const result = await generatePresignedUploadUrl(fileName, contentType, isPublic ?? true);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Hata' }, { status: 500 });
  }
}
