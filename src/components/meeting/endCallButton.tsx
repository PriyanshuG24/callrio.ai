'use client';

import { useRouter } from 'next/navigation';
import { useCall, useCallStateHooks } from '@stream-io/video-react-sdk';
import { Button } from '../ui/button';
import { toast } from 'sonner';

export const EndCallButton = () => {
  const call = useCall();
  const router = useRouter();

  const { useLocalParticipant } = useCallStateHooks();
  const localParticipant = useLocalParticipant();

  const isMeetingOwner =
    localParticipant &&
    call?.state?.createdBy &&
    localParticipant.userId === call.state.createdBy.id;

  if (!isMeetingOwner) return null;

  const endCallForEveryone = async () => {
    try {
      if (!call) return;

      await Promise.allSettled([call.camera?.disable(), call.microphone?.disable()]);

      await call.endCall();

      toast.success('Call ended for all participants');
      router.push('/dashboard');
      router.refresh();
    } catch (error) {
      console.error('Failed to end the call', error);
      toast.error('Failed to end the meeting. Please try again.');
      router.push('/dashboard');
    }
  };

  return (
    <Button onClick={endCallForEveryone} className="bg-red-500 hover:bg-red-600 cursor-pointer rounded-full">
      End call for all
    </Button>
  );
};
