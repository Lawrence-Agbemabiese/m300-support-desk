'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

export function Header() {
  const router = useRouter();
  const { advisor, logout, loading } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/92 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          <Link href="/" className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 shadow-sm">
              <span className="text-lg font-bold text-white">M</span>
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-gray-900">M300 Support Desk</h1>
              <p className="text-sm text-gray-500">Debt-Sensitive Grant Matching</p>
            </div>
          </Link>

          <div className="flex items-center space-x-4">
            <nav className="flex space-x-4">
              <Link
                href="/"
                className="rounded-full px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-slate-100 hover:text-gray-900"
              >
                Home
              </Link>
              <Link
                href="/analyze"
                className="rounded-full px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-slate-100 hover:text-gray-900"
              >
                Analyze Project
              </Link>
              <Link
                href="/projects"
                className="rounded-full px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-slate-100 hover:text-gray-900"
              >
                Projects
              </Link>
              {advisor?.role === 'admin' && (
                <>
                  <Link
                    href="/admin/grants"
                    className="rounded-full px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-slate-100 hover:text-gray-900"
                  >
                    Grant Discovery
                  </Link>
                  <Link
                    href="/admin/invites"
                    className="rounded-full px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-slate-100 hover:text-gray-900"
                  >
                    Invites
                  </Link>
                  <Link
                    href="/admin/users"
                    className="rounded-full px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-slate-100 hover:text-gray-900"
                  >
                    Users
                  </Link>
                </>
              )}
            </nav>

            <div className="flex items-center space-x-3 border-l border-gray-200 pl-4">
              {loading ? (
                <div className="h-8 w-20 animate-pulse rounded bg-gray-100" />
              ) : advisor ? (
                <>
                  <div className="text-right text-sm">
                    <div className="font-medium text-gray-900">{advisor.name}</div>
                    {advisor.organization && (
                      <div className="text-xs text-gray-500">{advisor.organization}</div>
                    )}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="rounded-full px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-slate-100 hover:text-gray-900"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="rounded-full px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-slate-100 hover:text-gray-900"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-emerald-700"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
