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
        
        {/* Main content area - positioned next to sidebar */}
        <div 
          className={cn(
            "flex-1 transition-all duration-300 ease-in-out h-full overflow-y-auto",
            isCollapsed ? "ml-20" : "ml-64"
          )}
          style={{
            paddingLeft: isSidebarOpen && isCollapsed ? '5rem' : undefined
          }}
        >
          <main className="bg-gray-50 dark:bg-gray-900 min-h-[calc(100vh-4rem)] p-4 md:p-6">
            <div className="max-w-7xl mx-auto w-full">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
