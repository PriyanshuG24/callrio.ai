"use client";
import CallList from "@/components/meeting/callList";
import { Clock } from "lucide-react";
import { useTheme } from "next-themes";

export default function PreviousPage() {
  const { theme } = useTheme();
  return (
    <div
      className={`p-4 min-h-screen ${theme === "light" ? "bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50" : ""}`}
    >
      <h1 className="text-2xl font-bold mb-4 flex items-center justify-center gap-2">
        <Clock className="h-6 w-6" />
        Ended Meetings
      </h1>
      <CallList type="ended" />
    </div>
  );
}
