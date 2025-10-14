'use client';

import { redirect, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Call, CallRecording } from "@stream-io/video-react-sdk";
import { MeetingCardHeader } from "./meetingCardHeader";
import { MeetingCardDetails } from "./meetingCardDetails";
import { MeetingCardFooter } from "./meetingCardFooter";
import {useGetCallById} from "@/hooks/useGetCallById";
import {formatTime} from "@/lib/utils";
interface MeetingCardProps {
  meeting: Call | CallRecording;
  type: "upcoming" | "ended" | "recordings";
}

const MeetingCardMain = ({ meeting, type }: MeetingCardProps) => {
  const router = useRouter();

  const meetingId = "id" in meeting ? meeting.id : null;
  const { call, isCallLoading, fetchCallById } = useGetCallById(false)
  const handleCopyLink = () => {
    if (meetingId) {
      const meetingLink = `${window.location.origin}/dashboard/meeting/${meetingId}`;
      navigator.clipboard.writeText(meetingLink);
      toast.success("Meeting link copied to clipboard");
    }
  };
  const handleStartMeeting = async () => {
    if(isCallLoading){
      toast.error("Loading call details");
      redirect("/dashboard");
      return;
    }
    if (meetingId) {
      await fetchCallById(meetingId)
      if(call && call.state?.startsAt?.getTime()&&call.state?.startsAt.getTime()>new Date().getTime()){
        toast.error(`Meeting has not started yet.It will start after ${formatTime(call.state?.startsAt)}`);
        return;
      }
      router.replace(`/dashboard/meeting/${meetingId}`);
    }
  };
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden transition-all hover:shadow-md h-full flex flex-col">
      <MeetingCardHeader meeting={meeting} type={type} />
      <div className="flex-1">
        <MeetingCardDetails meeting={meeting} />
      </div>
      <MeetingCardFooter meeting={meeting} type={type} onCopyLink={handleCopyLink} onStartMeeting={handleStartMeeting} />
    </div>
  );
};

export default MeetingCardMain;
