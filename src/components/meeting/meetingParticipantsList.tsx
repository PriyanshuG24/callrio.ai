"use client";

import { cn } from "@/lib/utils";
import { CallParticipantsList } from "@stream-io/video-react-sdk";

export const MeetingParticipantsList = ({ showParticipants, onClose }: any) => {
  return (
    <div
      className={cn(
        "fixed right-2 bottom-6 hidden w-[300px] h-[calc(100vh-64px)]",
        "bg-[#1c1f2e]/80 backdrop-blur-md rounded-xl px-4 py-2 overflow-hidden shadow-2xl",
        "border border-white/10 shadow-lg",
        "transition-transform duration-300 transform",
        "translate-x-full",
        {
          "translate-x-0 block": showParticipants,
          "mr-4": showParticipants,
        }
      )}
    >
      <CallParticipantsList onClose={onClose} />
    </div>
  );
};
