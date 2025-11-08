import { MeetingChat } from "@/components/meeting/meetingChat";

export const MeetingChatPanel = ({ channel, onClose }: any) => (
  <div className="fixed right-2 bottom-6 w-[400px] h-[calc(100vh-64px)] bg-[#1c1f2e]/90 backdrop-blur-md rounded-xl overflow-hidden border border-white/10">
    <MeetingChat channel={channel} />
  </div>
);
