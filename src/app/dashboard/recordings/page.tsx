import { Video } from 'lucide-react';
import CallList from '@/components/meeting/callList';

export default function RecordingsPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 flex items-center justify-center gap-2">
        <Video className="h-6 w-6" />
        Recordings
      </h1>
      <CallList type="recordings" />
    </div>
  );
}