import type { Metadata } from 'next';
import { Manrope } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/lib/auth-context';
import { Header } from '@/components/Header';

const manrope = Manrope({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'M300 Support Desk',
  description: 'Co-Intelligent Support for Mission 300 Energy Projects',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={manrope.className}>
        <AuthProvider>
          <div className="min-h-screen bg-[var(--surface-base)] text-slate-950">
            <Header />
            <main>{children}</main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
