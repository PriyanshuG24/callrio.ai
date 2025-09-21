// src/hooks/useMeetingState.ts
'use client';
import { useState } from 'react';
import { Call } from '@stream-io/video-react-sdk';
import { useSession } from '@/lib/auth-client';
import { useStreamVideoClient } from '@stream-io/video-react-sdk';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface MeetingState {
  dateTime: Date | null;  
  description: string;
  link: string; 
}

export const useMeetingState = () => {
  const router = useRouter();
  const [values, setValues] = useState<MeetingState>({
    dateTime: new Date() || null,
    description: "",
    link: "",
  });
  
  const [callDetails, setCallDetails] = useState<Call>();
  const { data: user, isPending } = useSession();
  const client = useStreamVideoClient();
  const [isLoading, setIsLoading] = useState(false);

  const createMeeting = async (isInstant = true) => {
    if (!user || !client) {
      toast.error('Please sign in to create a meeting');
      return;
    }

    setIsLoading(true);
    try {
      const id = crypto.randomUUID();
      const call = client.call('default', id);
      
      await call.getOrCreate({
        data: {
          starts_at: values.dateTime?.toISOString() || new Date().toISOString(),
          custom: {
            description: values.description || (isInstant ? 'Instant Meeting' : 'Scheduled Meeting'),
          },
        },
      });

      setCallDetails(call);
      toast.success(`Meeting ${isInstant ? 'created' : 'scheduled'} successfully!`);

      if (isInstant && !values.description) {
        router.push(`/dashboard/meeting/${id}`);
      } else if (!isInstant) {
        router.push('/dashboard/schedule');
      }
      
      return call;
    } catch (error) {
      console.error('Error creating meeting:', error);
      toast.error('Failed to create meeting. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    values,
    setValues,
    callDetails,
    setCallDetails,
    user,
    isPending,
    client,
    createMeeting
  };
};