import { CalendarClock } from 'lucide-react';
import CallList from '@/components/meeting/callList';

export default function UpcomingPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 flex items-center justify-center gap-2">
        <CalendarClock className="h-6 w-6" />
        Upcoming Meetings
      </h1>
      <CallList type="upcoming" />
    </div>
  );
}