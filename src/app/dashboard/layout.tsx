// src/app/dashboard/layout.tsx
'use client'

import { StreamVideoProvider } from "@/providers/streamClientProvider";
import { Sidebar } from "@/components/layout/sidebar";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import Loader from "@/components/ui/loader";
import { useRouter } from "next/navigation";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/");
    } else if (!isPending && session) {
      setIsAuthorized(true);
    }
  }, [isPending, session, router]);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  if (isPending || !isAuthorized) {
    return <Loader />;
  }

  return (
    <StreamVideoProvider>
      <div className="flex h-screen">
        <div
          className={`${isSidebarCollapsed ? "w-16" : "w-64"} transition-all duration-300`}
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