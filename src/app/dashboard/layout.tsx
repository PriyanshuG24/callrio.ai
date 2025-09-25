// src/app/dashboard/layout.tsx
'use client'

import { StreamVideoProvider } from "@/providers/streamClientProvider";
import { Sidebar } from "@/components/layout/sidebar";
import { useState } from "react";
import { useSession } from "@/lib/auth-client";
import Loader from "@/components/ui/loader";
import { usePathname } from "next/navigation";
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { data: session, isPending } = useSession();
  const pathname = usePathname();
  const match = pathname === '/dashboard';
  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  if (isPending || !session) {
    return <Loader />;
  }

  return (
    <StreamVideoProvider>
      <div className="flex h-screen">
        <div
          className={`${isSidebarCollapsed ? "w-16 mr-4" : "w-64"} transition-all duration-300 ${!match ? "hidden" : ""}`}
        >
          <Sidebar isCollapsed={isSidebarCollapsed} onToggleCollapse={toggleSidebar} />
        </div>
        <main className="flex-1 overflow-auto p-4">
          {children}
        </main>
      </div>
    </StreamVideoProvider>
  );
}
