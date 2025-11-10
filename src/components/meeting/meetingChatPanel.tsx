import { MeetingChat } from "@/components/meeting/meetingChat";
import { X } from "lucide-react";

export const MeetingChatPanel = ({ channel, onClose }: any) => (
  <div className="fixed right-2 bottom-6 w-[380px] h-[calc(100vh-64px)] bg-[#1c1f2e]/90 backdrop-blur-md rounded-xl overflow-hidden border border-white/10 z-[100]">
    <button
      onClick={onClose}
      className="absolute top-2 right-2 p-2 rounded-md flex items-center justify-center text-white bg-red-500 z-[101]"
    >
      <X className="w-4 h-4" />
    </button>
    <MeetingChat channel={channel} />
  </div>
);
