import { Calendar, Clock } from "lucide-react";
import { Call, CallRecording } from "@stream-io/video-react-sdk";
import { formatDate, formatTime, getMeetingDuration } from "@/lib/utils";

interface MeetingCardDetailsProps {
  meeting: any;
  type: "upcoming" | "ended" | "recordings";
}

export const MeetingCardDetails = ({ meeting, type }: MeetingCardDetailsProps) => {
  if (type === "ended") {
    return (
      <div className="px-4 pb-4 space-y-2">
        <div className="flex items-center text-sm text-muted-foreground">
          <Calendar className="h-4 w-4 mr-2" />
          <span>{formatDate(meeting.startAt)}</span>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <Clock className="h-4 w-4 mr-2" />
          <span>{formatTime(meeting.startAt)}</span>
          {meeting.endedAt && (
            <>
              <span className="mx-1">-</span>
              <span>{formatTime(meeting.endedAt)}</span>
              <span className="ml-2">
                ({getMeetingDuration(meeting.startAt, meeting.endedAt)})
              </span>
            </>
          )}
        </div>
      </div>
    );
  }
  if (type === "upcoming") {
    return (
      <div className="px-4 pb-4 space-y-2">
        <p className="text-sm text-muted-foreground">This meeting will start after the this time</p>
        <div className="flex items-center text-sm text-muted-foreground">
          <Calendar className="h-4 w-4 mr-2" />
          <span>{formatDate(meeting.startAt)}</span>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <Clock className="h-4 w-4 mr-2" />
          <span>{formatTime(meeting.startAt)}</span>
        </div>
      </div>
    );
  }
  if (type === "recordings") {
    return (
      <div className="px-4 pb-4 space-y-2">
        <div className="flex items-center text-sm text-muted-foreground">
          <Calendar className="h-4 w-4 mr-2" />
          <span>Recorded on {formatDate(meeting.start_time)}</span>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <Clock className="h-4 w-4 mr-2" />
          <span>Duration: {getMeetingDuration(meeting.start_time, meeting.end_time)}</span>
        </div>
      </div>
    );
  }

  return null;
};
