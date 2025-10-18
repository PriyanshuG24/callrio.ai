// src/app/dashboard/create-meeting/page.tsx
'use client';

import { useMeetingState } from '@/hooks/useMeetingState';
import { Button } from '@/components/ui/button';

export default function CreateMeetingPage() {
  const { 
    callDetails, 
    user, 
    createMeeting 
  } = useMeetingState();
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Create An Instant Meeting</h1>
      <Button onClick={() => createMeeting(true,new Date())} disabled={!user}>
        {callDetails ? 'Meeting Created' : 'Create Meeting'}
      </Button>
    </div>
  );
}