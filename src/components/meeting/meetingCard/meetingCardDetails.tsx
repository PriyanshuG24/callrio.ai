import { Calendar, Clock } from "lucide-react";
import { Call, CallRecording } from "@stream-io/video-react-sdk";
import { formatDate, formatTime, getMeetingDuration } from "@/lib/utils";

interface MeetingCardDetailsProps {
  meeting: Call | CallRecording;
}

export const MeetingCardDetails = ({ meeting }: MeetingCardDetailsProps) => {
  if ("state" in meeting) {
    return (
      <div className="px-4 pb-4 space-y-2">
        <div className="flex items-center text-sm text-muted-foreground">
          <Calendar className="h-4 w-4 mr-2" />
          <span>{formatDate(meeting.state?.startsAt)}</span>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <Clock className="h-4 w-4 mr-2" />
          <span>{formatTime(meeting.state?.startsAt)}</span>
          {meeting.state?.endedAt && (
            <>
              <span className="mx-1">-</span>
              <span>{formatTime(meeting.state.endedAt)}</span>
              <span className="ml-2">
                ({getMeetingDuration(meeting.state.startsAt, meeting.state.endedAt)})
              </span>
            </>
          )}
        </div>
      </div>
    );
  }

  if ("filename" in meeting) {
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
