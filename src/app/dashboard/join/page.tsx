// src/app/dashboard/join/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Video, Copy, AlertCircle, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useTheme } from "next-themes";

export default function JoinPage() {
  const [meetingLink, setMeetingLink] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { theme } = useTheme();

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setMeetingLink(text);
      setError("");
    } catch (err) {
      console.error("Failed to read clipboard:", err);
      toast("Could not access clipboard. Please paste manually.");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!meetingLink) {
      setError("Please enter a meeting link");
      return;
    }
    let meetingId = meetingLink;
    try {
      const url = new URL(meetingLink);
      meetingId = url.pathname.split("/").pop() || meetingLink;
    } catch (e) {}

    setIsLoading(true);

    setTimeout(() => {
      router.replace(`/dashboard/meeting/${meetingId}`);
    }, 500);
  };

  return (
    <div
      className={`p-4 min-h-screen ${theme === "light" ? "bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50" : ""}`}
    >
      <Card className="glass-card py-8 px-4">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Join a Meeting</CardTitle>
          <CardDescription>
            Enter the meeting link or ID to join
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="meeting-link">Meeting Link or ID</Label>
              <div className="relative w-full">
                <div className="flex items-center gap-2">
                  <Input
                    id="meeting-link"
                    placeholder="Paste meeting link or ID"
                    className="w-full pr-20"
                    value={meetingLink}
                    onChange={(e) => setMeetingLink(e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 h-9 text-xs"
                    onClick={handlePaste}
                  >
                    <Copy className="h-3.5 w-3.5 mr-1" />
                    Paste
                  </Button>
                </div>
              </div>
              {error && (
                <p className="text-sm text-red-500 flex items-center mt-1">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {error}
                </p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                type="submit"
                className="w-full sm:w-auto"
                disabled={isLoading || !meetingLink}
              >
                {isLoading ? (
                  "Joining..."
                ) : (
                  <>
                    Join Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full sm:w-auto"
                onClick={() => router.back()}
              >
                Go Back
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
