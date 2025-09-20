'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from './sidebar';
import { Header } from './header';
import { cn } from '@/lib/utils';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  // Close sidebar when route changes on mobile
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  // Return null for dashboard routes
  if (pathname?.startsWith('/dashboard')) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Header - fixed at top with highest z-index */}
      <div className="w-full fixed top-0 z-50 bg-white dark:bg-gray-800 shadow-sm">
        <Header />
      </div>
      
      <div className="flex flex-1 pt-16 h-full">
        {/* Sidebar - positioned below header */}
        <div className="fixed left-0 top-16 h-[calc(100vh-4rem)] z-40">
          <Sidebar 
            isCollapsed={isCollapsed} 
            onToggleCollapse={() => setIsCollapsed(!isCollapsed)} 
          />
        </div>
        
        {/* Main content area */}
        <main 
          className={cn(
            "flex-1 overflow-y-auto transition-all duration-300",
            isCollapsed ? "ml-16" : "ml-64"
          )}
        >
          {children}
        </main>
      </div>
    </div>
  );
}