import { NextRequest, NextResponse } from 'next/server';
import { clearAuthCookie } from '@/lib/auth';
import { cookies } from 'next/headers';
import { rejectIfCrossOrigin } from '@/lib/request-security';

export async function POST(request: NextRequest) {
  const originError = rejectIfCrossOrigin(request);
  if (originError) return originError;

  const cookieStore = await cookies();
  const cookie = clearAuthCookie();
  cookieStore.set(cookie.name, cookie.value, cookie);

  return NextResponse.json({ success: true });
}
