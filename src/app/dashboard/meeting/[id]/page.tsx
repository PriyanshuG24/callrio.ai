// src/app/dashboard/meeting/[id]/page.tsx
'use client';

import { useParams } from 'next/navigation';
import { useSession } from '@/lib/auth-client';
import { StreamCall, StreamTheme } from '@stream-io/video-react-sdk';
import { useState, useEffect } from 'react';
import MeetingRoom from '@/components/meeting/meetingRoom';
import MeetingSetup from '@/components/meeting/meetingSetup';
import { useGetCallById } from '@/hooks/useGetCallById';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function MeetingPage() {
  const { id } = useParams<{ id: string }>();
  const { data: user, isPending: isSessionLoading } = useSession();
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const { call, isCallLoading } = useGetCallById(id);
  const [isCallAlreadyEnded, setIsCallAlreadyEnded] = useState(false);
  useEffect(()=>{
    if(call?.state?.endedAt){
      setIsCallAlreadyEnded(true);
    }
  },[call]) 
  if (isSessionLoading || isCallLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!call) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-3">
        <h2 className="text-2xl font-bold">Call Not Found</h2>
        <p>The meeting you're looking for doesn't exist or has ended.</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-3">
        <h2 className="text-2xl font-bold">Unauthorized</h2>
        <p>Please sign in to join the meeting.</p>
      </div>
    );
  }

  return (
    <main className="h-screen w-full">
      <StreamCall call={call}>
        <StreamTheme>
          {!isSetupComplete ? (
            <MeetingSetup  setIsSetupComplete={setIsSetupComplete} />) 
            : 
          <MeetingRoom />}
        </StreamTheme>
      </StreamCall>
    </main>
  );
}

