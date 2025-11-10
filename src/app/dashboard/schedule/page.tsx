// src/app/dashboard/schedule/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMeetingState } from "@/hooks/useMeetingState";
import { useState } from "react";
import DatePicker from "react-datepicker";
import { toast } from "sonner";
import { MeetingLinkDialog } from "@/components/meeting/meetingLinkDialog";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useTheme } from "next-themes";

export default function SchedulePage() {
  const { theme } = useTheme();
  const { values, setValues, user, createMeeting } = useMeetingState();
  const [showDialog, setShowDialog] = useState(false);
  const [meetingLink, setMeetingLink] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const handleCreateMeeting = async () => {
    try {
      setIsLoading(true);
      const newMeeting = await createMeeting(
        false,
        values.dateTime as any,
        values.description
      );
      if (!newMeeting?.id) {
        throw new Error("Meeting ID not returned");
      }
      const link = `${window.location.origin}/dashboard/meeting/${newMeeting.id}`;
      setMeetingLink(link);
      setShowDialog(true);
    } catch (error) {
      console.error("Error creating meeting:", error);
      toast.error("Failed to create meeting. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`p-4 min-h-screen ${theme === "light" ? "bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50" : ""}`}
    >
      <div className="py-8 px-4 glass-card ">
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Schedule a Meeting</h1>
              <p className="text-muted-foreground mt-2">
                Set up a new meeting with date, time, and details.
              </p>
            </div>
            <div className="flex justify-end">
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => router.back()}
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <Label htmlFor="description" className="mx-1">
                Meeting Title
              </Label>
              <Input
                id="description"
                placeholder="Team standup, Client call, etc."
                value={values.description}
                onChange={(e) =>
                  setValues({ ...values, description: e.target.value })
                }
                className="mt-2 "
                required
              />
            </div>

            <div>
              <Label htmlFor="dateTime" className="mx-1">
                Date & Time
              </Label>
              <div className="mt-2">
                <DatePicker
                  selected={values.dateTime}
                  onChange={(date) =>
                    setValues({ ...values, dateTime: date || new Date() })
                  }
                  showTimeSelect
                  timeIntervals={15}
                  minDate={new Date()}
                  timeFormat="HH:mm:ss"
                  timeCaption="Time"
                  dateFormat="MMMM d, yyyy HH:mm:ss"
                  className="w-full h-10 rounded-md border bg-background px-2 py-1 text-sm ring-offset-background"
                  wrapperClassName="w-full"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4">
              <div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/dashboard")}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
              </div>
              <div>
                <Button
                  onClick={handleCreateMeeting}
                  disabled={isLoading || !values.dateTime || !user}
                  className="w-full sm:w-auto"
                >
                  {isLoading ? "Scheduling..." : "Schedule Meeting"}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <MeetingLinkDialog
          isOpen={showDialog}
          onClose={() => setShowDialog(false)}
          meetingLink={meetingLink}
        />
      </div>
    </div>
  );
}
