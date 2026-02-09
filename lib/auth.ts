import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { prisma } from './db';

const JWT_SECRET = process.env.JWT_SECRET || 'm300-support-desk-secret-key-change-in-production';
const COOKIE_NAME = 'm300_auth_token';

export interface AdvisorPayload {
  id: string;
  email: string;
  name: string;
  role: string;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function createToken(advisor: AdvisorPayload): string {
  return jwt.sign(advisor, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): AdvisorPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AdvisorPayload;
  } catch {
    return null;
  }
}

export async function getServerSession(): Promise<AdvisorPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) return null;

  const payload = verifyToken(token);
  if (!payload) return null;

  // Verify advisor still exists
  const advisor = await prisma.advisor.findUnique({
    where: { id: payload.id },
    select: { id: true, email: true, name: true, role: true },
  });

  if (!advisor) return null;

  return advisor;
}

export function setAuthCookie(token: string) {
  return {
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  };
}

export function clearAuthCookie() {
  return {
    name: COOKIE_NAME,
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: 0,
    path: '/',
  };
}
