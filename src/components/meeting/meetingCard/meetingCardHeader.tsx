import { Clock, CheckCircle } from "lucide-react";
import { Call, CallRecording } from "@stream-io/video-react-sdk";

interface MeetingCardHeaderProps {
  meeting: Call | CallRecording;
  type: "upcoming" | "ended" | "recordings";
}

export const MeetingCardHeader = ({ meeting, type }: MeetingCardHeaderProps) => {
  const isCall = "state" in meeting;
  const title = isCall
    ? meeting.state?.custom?.description || "No Title"
    : meeting.filename || "Recording";

  return (
    <div className="p-4">
      <div className="flex items-start justify-between">
        <h3 className="font-semibold text-lg line-clamp-2">{title}</h3>

        {type === "upcoming" && (
          <span className="flex items-center text-xs text-yellow-500 bg-yellow-50 px-2 py-1 rounded-full">
            <Clock className="h-3 w-3 mr-1" />
            Upcoming
          </span>
        )}
        {type === "ended" && (
          <span className="flex items-center text-xs text-green-500 bg-green-50 px-2 py-1 rounded-full">
            <CheckCircle className="h-3 w-3 mr-1" />
            Completed
          </span>
        )}
      </div>
    </div>
  );
};
