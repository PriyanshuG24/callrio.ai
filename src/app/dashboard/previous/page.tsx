'use client'
import CallList from '@/components/meeting/callList';
import { Clock } from 'lucide-react';

export default function PreviousPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 flex items-center justify-center gap-2">
        <Clock className="h-6 w-6" />
        Ended Meetings
      </h1>
      <CallList type="ended" />
    </div>
  );
}