"use client";
import { Video } from "lucide-react";
import CallList from "@/components/meeting/callList";
import { useTheme } from "next-themes";

export default function RecordingsPage() {
  const { theme } = useTheme();
  return (
    <div
      className={`p-4 min-h-screen ${theme === "light" ? "bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50" : ""}`}
    >
      <h1 className="text-2xl font-bold mb-4 flex items-center justify-center gap-2">
        <Video className="h-6 w-6" />
        Recordings
      </h1>
      <CallList type="recordings" />
    </div>
  );
}
