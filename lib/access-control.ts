import { NextResponse } from 'next/server';
import { getServerSession, type AdvisorPayload } from '@/lib/auth';

type AuthResult =
  | { ok: true; session: AdvisorPayload }
  | { ok: false; response: NextResponse };

export function isAdmin(session: AdvisorPayload): boolean {
  return session.role === 'admin';
}

export async function requireAuth(): Promise<AuthResult> {
  const session = await getServerSession();
  if (!session) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      ),
    };
  }

  return { ok: true, session };
}

export async function requireAdmin(): Promise<AuthResult> {
  const auth = await requireAuth();
  if (!auth.ok) return auth;

  if (!isAdmin(auth.session)) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      ),
    };
  }

  return auth;
}
