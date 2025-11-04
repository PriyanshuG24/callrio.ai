import { Clock, CheckCircle } from "lucide-react";

interface MeetingCardHeaderProps {
  meeting: any;
  type: "upcoming" | "ended" | "recordings";
}

export const MeetingCardHeader = ({
  meeting,
  type,
}: MeetingCardHeaderProps) => {
  const title = meeting.title || "Recording";
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
          <span className="flex items-center text-xs text-green-800 bg-green-50 px-2 py-1 rounded-full">
            <CheckCircle className="h-3 w-3 mr-1" />
            Completed
          </span>
        )}
      </div>
    </div>
  );
};
