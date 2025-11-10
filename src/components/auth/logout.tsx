"use client";

import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/auth-client";
import { ArrowBigLeft } from "lucide-react";
import { removeLinkedInToken } from "@/actions/linkedinPostAction/auth";

export function LogoutButton() {
  const handleLogout = async () => {
    try {
      await Promise.all([
        removeLinkedInToken(),
        signOut(),
        (() => {
          localStorage.removeItem("call-store-storage");
          sessionStorage.removeItem("meeting-session-cache");
        })(),
      ]);

      window.location.href = "/login";
    } catch (error) {
      console.error("Logout error:", error);
      alert("Failed to log out. Please try again.");
    }
  };

  return (
    <Button
      variant="outline"
      onClick={handleLogout}
      className="cursor-pointer flex items-center gap-2 hover:bg-gray-500 dark:hover:bg-gray-800 w-full justify-start"
    >
      <ArrowBigLeft className="h-4 w-4" />
      Logout
    </Button>
  );
}
