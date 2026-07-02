'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { advisor, logout, loading } = useAuth();
  const isHome = pathname === '/';

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const homeNav = [
    { href: '/#how', label: 'How it works' },
    { href: '/#audience', label: "Who it's for" },
    { href: '/#samples', label: 'Sample projects' },
    { href: '/#faq', label: 'FAQ' },
  ];

  const appNav = [
    { href: '/', label: 'Home' },
    { href: '/analyze', label: 'Analyze Project' },
    { href: '/projects', label: 'Projects' },
  ];

  return (
    <header
      className={
        isHome
          ? 'sticky top-0 z-40 border-b border-slate-200 bg-[#f3efe6]/92 backdrop-blur'
          : 'bg-white border-b border-gray-200'
      }
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isHome ? 'border border-slate-300 bg-white' : 'bg-emerald-600'}`}>
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <div>
              <h1 className={`text-xl font-extrabold tracking-tight ${isHome ? 'text-slate-900' : 'text-gray-900'}`}>M300 Support Desk</h1>
              <p className={`text-sm ${isHome ? 'text-slate-600' : 'text-gray-500'}`}>Debt-Sensitive Grant Matching</p>
            </div>
          </Link>

          <div className="flex items-center space-x-4">
            <nav className="hidden md:flex space-x-2">
              {(isHome ? homeNav : appNav).map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 text-sm font-semibold rounded-full transition-colors ${
                    isHome
                      ? 'text-slate-700 hover:bg-slate-900/5 hover:text-slate-900'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              {advisor?.role === 'admin' && (
                <>
                  <Link
                    href="/admin/grants"
                    className={`px-3 py-2 text-sm font-semibold rounded-full transition-colors ${
                      isHome ? 'text-slate-700 hover:bg-slate-900/5 hover:text-slate-900' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Grant Discovery
                  </Link>
                  <Link
                    href="/admin/invites"
                    className={`px-3 py-2 text-sm font-semibold rounded-full transition-colors ${
                      isHome ? 'text-slate-700 hover:bg-slate-900/5 hover:text-slate-900' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Invites
                  </Link>
                  <Link
                    href="/admin/users"
                    className={`px-3 py-2 text-sm font-semibold rounded-full transition-colors ${
                      isHome ? 'text-slate-700 hover:bg-slate-900/5 hover:text-slate-900' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Users
                  </Link>
                </>
              )}
            </nav>

            <div className={`pl-4 flex items-center space-x-3 ${isHome ? 'border-l border-slate-300' : 'border-l border-gray-200'}`}>
              {loading ? (
                <div className="w-20 h-8 bg-gray-100 animate-pulse rounded" />
              ) : advisor ? (
                <>
                  <div className="text-sm text-right">
                    <div className={`font-medium ${isHome ? 'text-slate-900' : 'text-gray-900'}`}>{advisor.name}</div>
                    {advisor.organization && (
                      <div className={`${isHome ? 'text-slate-600' : 'text-gray-500'} text-xs`}>{advisor.organization}</div>
                    )}
                  </div>
                  {isHome && (
                    <Link
                      href="/projects"
                      className="hidden sm:inline-flex items-center rounded-full bg-[#6ed0bf] px-4 py-2 text-sm font-bold text-slate-950 transition hover:bg-[#82d9cb]"
                    >
                      Open Workspace
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className={`px-3 py-2 text-sm font-semibold ${isHome ? 'text-slate-700 hover:text-slate-900' : 'text-gray-600 hover:text-gray-900'}`}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className={`px-3 py-2 text-sm font-semibold ${isHome ? 'text-slate-700 hover:text-slate-900' : 'text-gray-600 hover:text-gray-900'}`}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className={`rounded-2xl px-4 py-2 text-sm font-bold transition-colors ${
                      isHome
                        ? 'bg-[#6ed0bf] text-slate-950 hover:bg-[#82d9cb]'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    }`}
                  >
                    Enter Invite
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
