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
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">M300 Support Desk</h1>
              <p className="text-sm text-gray-500">Debt-Sensitive Grant Matching</p>
            </div>
          </Link>

          <div className="flex items-center space-x-4">
            <nav className="flex space-x-4">
              <Link
                href="/"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
              >
                Home
              </Link>
              <Link
                href="/analyze"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
              >
                Analyze Project
              </Link>
              <Link
                href="/projects"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
              >
                Projects
              </Link>
              {advisor && (
                <>
                  <Link
                    href="/admin/grants"
                    className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                  >
                    Grant Discovery
                  </Link>
                  {advisor.role === 'admin' && (
                    <Link
                      href="/admin/invites"
                      className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                    >
                      Invites
                    </Link>
                  )}
                </>
              )}
            </nav>

            <div className="border-l border-gray-200 pl-4 flex items-center space-x-3">
              {loading ? (
                <div className="w-20 h-8 bg-gray-100 animate-pulse rounded" />
              ) : advisor ? (
                <>
                  <div className="text-sm text-right">
                    <div className="font-medium text-gray-900">{advisor.name}</div>
                    {advisor.organization && (
                      <div className="text-gray-500 text-xs">{advisor.organization}</div>
                    )}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
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
