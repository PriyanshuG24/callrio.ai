'use client';

import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Plus, Clock, Calendar,CalendarClock, Video, ChevronRight, ChevronLeft,User,LogOut } from 'lucide-react';
import { useSession } from '@/lib/auth-client'; 
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signOut } from '@/lib/auth-client';
import { removeLinkedInToken } from '@/actions/linkedinPostAction/auth';

const navItems = [
  { name: 'New Meeting', href: '/dashboard/create-meeting', icon: Plus, requiresAuth: true },
  { name: 'Previous', href: '/dashboard/previous', icon: Clock, requiresAuth: true },
  { name: 'Upcoming', href: '/dashboard/upcoming', icon: CalendarClock, requiresAuth: true },
  { name: 'Schedule', href: '/dashboard/schedule', icon: Calendar, requiresAuth: true },
  { name: 'Recordings', href: '/dashboard/recordings', icon: Video, requiresAuth: true },
  {name:'Profile',href:'/dashboard/profile',icon:User,requiresAuth:true}
];

export function Sidebar({ isCollapsed, onToggleCollapse }: { isCollapsed: boolean; onToggleCollapse: () => void }) {
  const { data: session, isPending } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  if (isPending) {
    return null;
  }
  const handleLogout = async () => {
    localStorage.removeItem('call-store-storage');
    sessionStorage.removeItem('meeting-session-cache');
    await removeLinkedInToken();
    await signOut();
    router.replace('/login');
  };
  const filteredNavItems = navItems.filter(item => 
    session && item.requiresAuth
  );
  return (
    <aside
      className={cn(
        'fixed left-0 top-0 h-screen  z-50 transition-all duration-300 ease-in-out flex flex-col glass-card-sidebar',
        isCollapsed ? 'w-20  ' : 'w-50'
      )}
    >
     
      <div className="absolute -right-3 top-26 z-10 md:block">
        <button
          onClick={onToggleCollapse}
          className="h-6 w-6 rounded-full border border-gray-300 bg-white dark:bg-gray-700 shadow-md flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4 text-gray-600 dark:text-gray-300" /> : <ChevronLeft className="h-4 w-4 text-gray-600 dark:text-gray-300" />}
        </button>
      </div>

      <nav className="flex-1 px-3 py-4 mt-20">
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
        <hr className="my-4" />
        <button 
          className={cn(
            'flex items-center p-2 rounded-lg transition-colors cursor-pointer',
            'hover:bg-gray-100 dark:hover:bg-gray-800 w-full',
            isCollapsed ? 'justify-center w-full' : 'justify-start'
          )}
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5 text-red-500" />
          {!isCollapsed && <span className="ml-3 text-red-500">Logout</span>}
        </button>
      </nav>
    </aside>
  );
}