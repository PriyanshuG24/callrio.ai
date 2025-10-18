'use client';
import { useState } from 'react';
import { Call } from '@stream-io/video-react-sdk';
import { useSession } from '@/lib/auth-client';
import { useStreamVideoClient } from '@stream-io/video-react-sdk';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {createMeetingCall, createScheduleMeetingCall} from '@/actions/dbAction/meeting';

interface MeetingState {
  dateTime: Date | null;
  description: string;
  link: string;
}

export const useMeetingState = () => {
  const router = useRouter();
  const [values, setValues] = useState<MeetingState>({
    dateTime: new Date() || null,
    description: '',
    link: '',
  });

  const [callDetails, setCallDetails] = useState<Call>();
  const { data: user } = useSession();
  const client = useStreamVideoClient();
  const [isLoading, setIsLoading] = useState(false);

  const createMeeting = async (isInstant = true,setDate: Date) => {
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
          settings_override: {
            transcription: {
              mode: 'auto-on',
              closed_caption_mode: 'auto-on',
              language: 'en',
            },
          },
          starts_at: setDate.toISOString(),
          custom: {
            description:
              values.description || (isInstant ? 'Instant Meeting' : 'Scheduled Meeting'),
          },
        },
      });
      setCallDetails(call);
      if (isInstant && !values.description) {
        const {success, message} = await createMeetingCall({
          meetingId: id,
          title: call.state.custom?.description,
          ownerId: user.user.id,
        })
        console.log(success, message,id)
        toast.success(`Meeting ${isInstant ? 'created' : 'scheduled'} successfully!`);
        router.replace(`/dashboard/meeting/${id}`);
      } else if (!isInstant) {
        const {success, message} = await createScheduleMeetingCall({
          meetingId: id,
          title: call.state.custom?.description,
          ownerId: user.user.id,
          setDate: setDate,
        })
        console.log(success, message,id)
        toast.success(`Meeting ${isInstant ? 'created' : 'scheduled'} successfully!`);
        router.replace('/dashboard/schedule');
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
    client,
    isLoading,
    createMeeting,
  };
};
