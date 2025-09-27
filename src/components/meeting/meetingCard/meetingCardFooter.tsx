import { Button } from "@/components/ui/button";
import { Copy, Play, Video, XCircle } from "lucide-react";
import { toast } from "sonner";
import { Call, CallRecording } from "@stream-io/video-react-sdk";

interface MeetingCardFooterProps {
  meeting: Call | CallRecording;
  type: "upcoming" | "ended" | "recordings";
  onStartMeeting: () => void;
  onCopyLink: () => void;
}

export const MeetingCardFooter = ({ meeting, type, onStartMeeting, onCopyLink }: MeetingCardFooterProps) => {
  if ("filename" in meeting) {
    return (
      <div className="flex items-center justify-center border-t py-2 px-4">
        <div className="flex gap-4">
          <Button variant="outline" size="sm" onClick={() => window.open(meeting.url, "_blank")} className="flex-1">
            <Play className="h-4 w-4 mr-2" />
            Play
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              navigator.clipboard.writeText(meeting.url);
              toast.success("Recording link copied to clipboard");
            }}
            className="flex-1"
          >
            <Copy className="h-4 w-4 mr-2" />
            Copy Link
          </Button>
        </div>
      </div>
    );
  }

  if (type === "ended") {
    return (
      <div className="mt-auto p-4 border-t">
        <div className="flex items-center justify-center text-sm text-muted-foreground py-2">
          <XCircle className="h-4 w-4 mr-2 text-red-500" />
          <span>This meeting has ended</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center border-t py-2 px-4">
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={onCopyLink}>
          <Copy className="h-4 w-4 mr-2" />
          Copy Link
        </Button>
        <Button size="sm" onClick={onStartMeeting}>
          <Video className="h-4 w-4 mr-2" />
          Start
        </Button>
      </div>
    </div>
  );
};
