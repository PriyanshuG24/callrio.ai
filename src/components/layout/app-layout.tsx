// src/components/layout/app-layout.tsx
'use client';

import { Header } from './header';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const shouldShowHeader = () => {
    if (pathname?.startsWith('/dashboard')) {
      return false;
    }
    return pathname === '/' || 
           pathname?.startsWith('/login') || 
           pathname?.startsWith('/register');
  };

  if (!isMounted) {
    return null;
  }

  const showHeader = shouldShowHeader();

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1">
      {showHeader && <Header />}
      </div>
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}