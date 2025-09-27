'use client';

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Call, CallRecording } from "@stream-io/video-react-sdk";
import { getMeetingChat } from "@/actions/streamAction/chat";

import { MeetingCardHeader } from "./meetingCardHeader";
import { MeetingCardDetails } from "./meetingCardDetails";
import { MeetingCardFooter } from "./meetingCardFooter";

interface MeetingCardProps {
  meeting: Call | CallRecording;
  type: "upcoming" | "ended" | "recordings";
}

const MeetingCardMain = ({ meeting, type }: MeetingCardProps) => {
  const router = useRouter();
  const [chatMessagesCount, setChatMessagesCount] = useState<number>(0);

  const meetingId = "id" in meeting ? meeting.id : null;

  // useEffect(() => {
  //   const fetchChatMessages = async () => {
  //     if (meetingId && type === "ended") {
  //       const messages = await getMeetingChat(meetingId);
  //       setChatMessagesCount(messages.length);
  //     }
  //   };
  //   fetchChatMessages();
  // }, [meetingId, type]);

  const handleCopyLink = () => {
    if (meetingId) {
      const meetingLink = `${window.location.origin}/dashboard/meeting/${meetingId}`;
      navigator.clipboard.writeText(meetingLink);
      toast.success("Meeting link copied to clipboard");
    }
  };

  const handleStartMeeting = () => {
    if (meetingId) {
      router.push(`/dashboard/meeting/${meetingId}`);
    }
  };

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden transition-all hover:shadow-md h-full flex flex-col">
      <MeetingCardHeader meeting={meeting} type={type} />
      <div className="flex-1">
        <MeetingCardDetails meeting={meeting} type={type} chatMessagesCount={chatMessagesCount} />
      </div>
      <MeetingCardFooter meeting={meeting} type={type} onCopyLink={handleCopyLink} onStartMeeting={handleStartMeeting} />
    </div>
  );
};

export default MeetingCardMain;
