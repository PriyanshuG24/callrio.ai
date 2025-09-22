'use client';

import { Header } from './header';
import { usePathname } from 'next/navigation';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isDashboardRoute = pathname.startsWith('/dashboard');

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {!isDashboardRoute && <Header />}

      <main>{children}</main>
    </div>
  );
}
