'use client';

import { Button } from '@/components/ui/button';
import { format, differenceInMinutes } from 'date-fns';
import { Calendar, Clock, Copy, Play, Video, CheckCircle, XCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Call, CallRecording } from '@stream-io/video-react-sdk';

interface MeetingCardProps {
  meeting: Call | CallRecording;
  type: 'upcoming' | 'ended' | 'recordings';
}

const MeetingCard = ({ meeting, type }: MeetingCardProps) => {
  const router = useRouter();

  const formatDate = (dateString?: string | Date | number) => {
    if (!dateString) return 'No date';
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (error) {
      console.error('Invalid date:', dateString);
      return 'Invalid date';
    }
  };

  const formatTime = (dateString?: string | Date | number) => {
    if (!dateString) return 'No time';
    try {
      return format(new Date(dateString), 'h:mm a');
    } catch (error) {
      console.error('Invalid time:', dateString);
      return 'Invalid time';
    }
  };

  const handleCopyLink = () => {
    if ('id' in meeting) {
      const meetingLink = `${window.location.origin}/dashboard/meeting/${meeting.id}`;
      navigator.clipboard.writeText(meetingLink);
      toast.success('Meeting link copied to clipboard');
    }
  };

  const handleStartMeeting = () => {
    if ('id' in meeting) {
      router.push(`/dashboard/meeting/${meeting.id}`);
    }
  };

  const getMeetingDuration = (start?: string | Date, end?: string | Date) => {
    if (!start || !end) return 'N/A';
    try {
      const startDate = new Date(start);
      const endDate = new Date(end);
      const minutes = differenceInMinutes(endDate, startDate);
      return `${minutes} min`;
    } catch {
      return 'N/A';
    }
  };

  const renderCardHeader = () => {
    const isCall = 'state' in meeting;
    const title = isCall 
      ? meeting.state?.custom?.description || 'No Title' 
      : meeting.filename || 'Recording';
      

    return (
      <div className="p-4">
        <div className="flex items-start justify-between">
          <h3 className="font-semibold text-lg line-clamp-2">{title}</h3>
          {type === 'upcoming' && (
            <span className="flex items-center text-xs text-yellow-500 bg-yellow-50 px-2 py-1 rounded-full">
              <Clock className="h-3 w-3 mr-1" />
              Upcoming
            </span>
          )}
          {type === 'ended' && (
            <span className="flex items-center text-xs text-green-500 bg-green-50 px-2 py-1 rounded-full">
              <CheckCircle className="h-3 w-3 mr-1" />
              Completed
            </span>
          )}
        </div>
      </div>
    );
  };

  const renderCallDetails = () => {
    if (!('state' in meeting)) return null;

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
  };

  const renderRecordingDetails = () => {
    if (!('filename' in meeting)) return null;

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
  };

  const renderFooter = () => {
    // Recording card
    if ('filename' in meeting) {
      return (
        <div className="flex items-center justify-center border-t py-2 px-4">
          <div className="flex gap-4">  
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(meeting.url, '_blank')}
              className="flex-1"  
            >
              <Play className="h-4 w-4 mr-2" />
              Play
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                navigator.clipboard.writeText(meeting.url);
                toast.success('Recording link copied to clipboard');
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

    // Ended meeting
    // Update the renderFooter function's ended meeting section
if (type === 'ended') {
      return (
        <div className="mt-auto p-4 border-t">
          <div className="flex items-center justify-center text-sm text-muted-foreground py-2">
            <XCircle className="h-4 w-4 mr-2 text-red-500" />
            <span>This meeting has ended</span>
          </div>
        </div>
      );
    }

    // Upcoming meeting
    return (
      <div className="flex items-center justify-center border-t py-2 px-4">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyLink}
          >
            <Copy className="h-4 w-4 mr-2" />
            Copy Link
          </Button>
          <Button 
            size="sm" 
            onClick={handleStartMeeting}
          >
            <Video className="h-4 w-4 mr-2" />
            Start
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden transition-all hover:shadow-md h-full flex flex-col">
      {renderCardHeader()}
      <div className="flex-1">
        {'filename' in meeting ? renderRecordingDetails() : renderCallDetails()}
      </div>
      {renderFooter()}
    </div>
  );
};

export default MeetingCard;