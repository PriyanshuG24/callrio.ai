'use client';

import { useRouter } from 'next/navigation';
import { useCall } from '@stream-io/video-react-sdk';
import { Button } from '../ui/button';
import { toast } from 'sonner';

export const EndCallButton = () => {
  const call = useCall();
  const router = useRouter();

  
  const endCallForEveryone = async () => {
    try {
      if (!call) return;

      await Promise.allSettled([call.camera?.disable(), call.microphone?.disable()]);
      await call.endCall();
      toast.success('Call ended for all participants');
    } catch (error) {
      console.error('Failed to end the call', error);
      toast.error('Failed to end the meeting. Please try again.');
      router.replace('/dashboard');
    }
  };

  return (
    <Button onClick={endCallForEveryone} className="bg-red-500 hover:bg-red-600 cursor-pointer rounded-full">
      End call for all
    </Button>
  );
};
