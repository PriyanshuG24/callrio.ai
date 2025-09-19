'use client';

import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Home, Plus, Clock, Calendar, Video, ChevronRight, ChevronLeft } from 'lucide-react';
import { useSession } from '@/lib/auth-client'; 
import Link from 'next/link';

const navItems = [
  { name: 'Home', href: '/', icon: Home, alwaysShow: true },
  { name: 'New Meeting', href: '/create-meeting', icon: Plus, requiresAuth: true },
  { name: 'Previous', href: '/previous', icon: Clock, requiresAuth: true },
  { name: 'Upcoming', href: '/upcoming', icon: Calendar, requiresAuth: true },
  { name: 'Join', href: '/join', icon: Video, requiresAuth: true },
];

export function Sidebar({ isCollapsed, onToggleCollapse }: { isCollapsed: boolean; onToggleCollapse: () => void }) {
  const pathname = usePathname();
  const { data: session, isPending } = useSession();
  const filteredNavItems = navItems.filter(item => 
    item.alwaysShow || (session && item.requiresAuth)
  );
  if (isPending) {
    return null;
  }

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 h-screen bg-white dark:bg-gray-900 shadow-xl z-50 transition-all duration-300 ease-in-out flex flex-col',
        isCollapsed ? 'w-20 mt-16' : 'w-64 mt-16'
      )}
    >
     
      <div className="absolute -right-3 top-20 z-10 hidden md:block">
        <button
          onClick={onToggleCollapse}
          className="h-6 w-6 rounded-full border border-gray-300 bg-white dark:bg-gray-700 shadow-md flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4 text-gray-600 dark:text-gray-300" />
          ) : (
            <ChevronLeft className="h-4 w-4 text-gray-600 dark:text-gray-300" />
          )}
        </button>
      </div>

      <nav className="flex-1 px-3 py-4">
        <ul className="space-y-2">
          {filteredNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center p-2 rounded-lg transition-colors',
                    isActive
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-100'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800',
                    isCollapsed ? 'justify-center' : 'justify-start'
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {!isCollapsed && <span className="ml-3">{item.name}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}