import { NextRequest, NextResponse } from 'next/server';

function normalizeOrigin(origin: string): { protocol: string; host: string } | null {
  try {
    const parsed = new URL(origin);
    return {
      protocol: parsed.protocol,
      host: parsed.host,
    };
  } catch {
    return null;
  }
}

export function rejectIfCrossOrigin(request: NextRequest): NextResponse | null {
  const origin = request.headers.get('origin');
  if (!origin) {
    return null;
  }

  const normalized = normalizeOrigin(origin);
  if (!normalized) {
    return NextResponse.json(
      { error: 'Invalid request origin' },
      { status: 403 }
    );
  }

  const host = request.headers.get('x-forwarded-host') || request.headers.get('host');
  const forwardedProto = request.headers.get('x-forwarded-proto');
  const expectedProtocol = forwardedProto ? `${forwardedProto}:` : normalized.protocol;

  if (!host) {
    return NextResponse.json(
      { error: 'Invalid request origin' },
      { status: 403 }
    );
  }

  if (normalized.host !== host || normalized.protocol !== expectedProtocol) {
    return NextResponse.json(
      { error: 'Invalid request origin' },
      { status: 403 }
    );
  }

  return null;
}
