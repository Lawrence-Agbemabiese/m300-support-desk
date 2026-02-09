import { NextResponse } from 'next/server';
import { clearAuthCookie } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST() {
  const cookieStore = await cookies();
  const cookie = clearAuthCookie();
  cookieStore.set(cookie.name, cookie.value, cookie);

  return NextResponse.json({ success: true });
}
