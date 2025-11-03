// src/app/dashboard/layout.tsx
'use client'

import { StreamVideoProvider } from "@/providers/streamClientProvider";
import { StreamChatProvider } from "@/providers/streamChatClientProvider";
import { Sidebar } from "@/components/layout/sidebar";
import { useState } from "react";
import { useSession } from "@/lib/auth-client";
import Loader from "@/components/ui/loader";
import { redirect, usePathname } from "next/navigation";
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { data: session, isPending } = useSession();
  const pathname = usePathname();
  const match = pathname === '/dashboard';
  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  if (isPending) {
    return <Loader />; 
  }

  if (!session) {
    redirect('/login'); 
  }

  return (
    <StreamVideoProvider>
      <StreamChatProvider>
      <div className="flex h-screen">
        <div className="sm:block hidden">
          <div
          className={`${isSidebarCollapsed ? "w-16 mr-4" : "w-50"} transition-all duration-300 ${!match ? "hidden" : ""}`}
        >
          <Sidebar isCollapsed={isSidebarCollapsed} onToggleCollapse={toggleSidebar} />
        </div>
        </div>
        <main className="flex-1 overflow-auto p-4 sm:p-0">
          {children}
        </main>
      </div>
      </StreamChatProvider>
    </StreamVideoProvider>
  );
}
