'use client';
import { redirect, useRouter } from "next/navigation";
import { toast } from "sonner";
import { MeetingCardHeader } from "./meetingCardHeader";
import { MeetingCardDetails } from "./meetingCardDetails";
import { MeetingCardFooter } from "./meetingCardFooter";
import { getMeetingById } from "@/actions/dbAction/meeting";
interface MeetingCardProps {
  meeting: any;
  type: "upcoming" | "ended" | "recordings";
}

const MeetingCardMain = ({ meeting, type }: MeetingCardProps) => {
  const router = useRouter();

  const meetingId = "meetingId" in meeting ? meeting.meetingId : null;
  const handleCopyLink = () => {
    if (meetingId) {
      const meetingLink = `${window.location.origin}/dashboard/meeting/${meetingId}`;
      navigator.clipboard.writeText(meetingLink);
      toast.success("Meeting link copied to clipboard");
    }
  };
  const handleStartMeeting = async () => {
    if (meetingId) {
      const meetingData = await getMeetingById(meetingId);
      if (!meetingData) {
        toast.error("Meeting not found");
        redirect("/dashboard");
      }
      const now=new Date();
      if(meetingData?.[0]?.startAt && new Date(meetingData?.[0]?.startAt) > now){
        toast.error(`Meeting is not started yet, it will start at ${meetingData?.[0]?.startAt}`);
        return;
      }
      router.replace(`/dashboard/meeting/${meetingId}`);
    }
  };
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden transition-all hover:shadow-md h-full flex flex-col">
      <MeetingCardHeader meeting={meeting} type={type} />
      <div className="flex-1">
        <MeetingCardDetails meeting={meeting} type={type}/>
      </div>
      <MeetingCardFooter meeting={meeting} type={type} onCopyLink={handleCopyLink} onStartMeeting={handleStartMeeting} />
    </div>
  );
};

export default MeetingCardMain;
