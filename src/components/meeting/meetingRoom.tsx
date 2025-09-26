'use client';

import {
  useCall,
  CallControls,
  CallParticipantsList,
  CallStatsButton,
  PaginatedGridLayout,
  SpeakerLayout,
  useCallStateHooks,
  CallingState,
} from '@stream-io/video-react-sdk';
import { useState, useCallback, useEffect } from 'react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '../ui/dropdown-menu';
import { LayoutList, Users, Loader2, ChartBarIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { useSearchParams, useRouter } from 'next/navigation';
import { EndCallButton } from './endCallButton';
import { toast } from 'sonner';
import { useSession } from '@/lib/auth-client';
import { useMeetingChat } from '@/hooks/useMeetingChat'; 
import {MeetingChat} from '@/components/meeting/meetingChat';


type CallLayoutType = 'grid' | 'speaker-left' | 'speaker-right';

const MeetingRoom = () => {
  const searchParams = useSearchParams();
  const isPersonal = !!searchParams.get('personal');
  const [layout, setLayout] = useState<CallLayoutType>('speaker-left');
  const [showParticipants, setShowParticipants] = useState(false);
  const [showParticipantsChat, setShowParticipantsChat] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const { useCallCallingState, useParticipants, useLocalParticipant } = useCallStateHooks();
  const callingState = useCallCallingState();
  const participants = useParticipants();
  const localParticipant = useLocalParticipant();

  const router = useRouter();
  const call = useCall();
  const { data: user } = useSession();

  // Chat hook for this meeting
  const otherUserIds = participants
    .filter((p) => p.userId !== user?.user.id)
    .map((p) => p.userId || '');
  const channel = useMeetingChat(call?.id || '', otherUserIds);

  const CallLayout = useCallback(() => {
    switch (layout) {
      case 'grid':
        return <PaginatedGridLayout />;
      case 'speaker-left':
        return <SpeakerLayout participantsBarPosition="left" />;
      case 'speaker-right':
        return <SpeakerLayout participantsBarPosition="right" />;
      default:
        return <PaginatedGridLayout />;
    }
  }, [layout]);

  useEffect(() => {
    console.debug('CALL PARTICIPANTS UPDATED', {
      cid: (call as any)?.cid,
      length: participants.length,
      ids: participants.map((p) => p.userId || p.sessionId),
    });
  }, [participants, call]);

  // Cleanup local media on unmount
  useEffect(() => {
    return () => {
      (async () => {
        try {
          if (!call) return;
          await Promise.allSettled([call.camera?.disable(), call.microphone?.disable()]);

          const vs = localParticipant?.videoStream;
          if (vs && typeof vs.getTracks === 'function') {
            vs.getTracks().forEach((t: MediaStreamTrack) => t.stop());
          }
          const as = localParticipant?.audioStream;
          if (as && typeof as.getTracks === 'function') {
            as.getTracks().forEach((t: MediaStreamTrack) => t.stop());
          }
        } catch (err) {
          console.error('Error cleaning up media on unmount:', err);
        }
      })();
    };
  }, []);

  useEffect(() => {
    if (!call) return;

    const onEnded = async () => {
      try {
        await Promise.allSettled([call.camera?.disable(), call.microphone?.disable()]);
      } catch {}
      if (!isRedirecting) {
        setIsRedirecting(true);
        toast.info('The meeting has ended');
        setTimeout(() => {
          router.push('/dashboard');
          router.refresh();
        }, 1500);
      }
    };

    call.on?.('call.ended' as any, onEnded);

    if (call.state?.endedAt) {
      onEnded();
    }

    return () => {
      call.off?.('call.ended' as any, onEnded);
    };
  }, [call, isRedirecting, router]);

  if (isRedirecting) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="mt-4">Meeting ended, redirecting...</p>
      </div>
    );
  }

  if (callingState !== CallingState.JOINED) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="mt-4">Joining the meeting...</p>
      </div>
    );
  }

  return (
    <section className="relative h-screen w-full overflow-hidden pt-16 text-white">
      <div className="relative size-full flex items-center justify-center">
        <div className="relative size-full max-w-[1000px] lg:max-w-[850px] md:max-w-[800px] sm:max-w-[750px] xs:max-w-[700px] items-center justify-center">
          <CallLayout />
        </div>

        {/* Participants list */}
        <div
          className={cn(
            'fixed right-2 bottom-6 hidden w-[400px] h-[calc(100vh-64px)]',
            'bg-[#1c1f2e]/80 backdrop-blur-md rounded-xl px-4 py-2 overflow-hidden shadow-2xl',
            'border border-white/10 shadow-lg',
            'transition-transform duration-300 transform',
            'translate-x-full',
            {
              'translate-x-0 block': showParticipants,
              'mr-4': showParticipants,
            }
          )}
        >
          <CallParticipantsList onClose={() => setShowParticipants(false)} />
        </div>

        {/* Chat panel */}
        {showParticipantsChat && channel && (
          <div className="fixed right-2 bottom-6 w-[400px] h-[calc(100vh-64px)] bg-[#1c1f2e]/80 backdrop-blur-md rounded-xl overflow-hidden ">
            <MeetingChat channel={channel} />
          </div>
        )}
      </div>

      {/* Controls */}
      <div
        className={cn(
          'fixed bottom-4 left-1/2 -translate-x-1/2',
          'flex items-center justify-center flex-wrap gap-2 md:gap-3 lg:gap-4',
          'max-w-full',
          'bg-[#1c1f2e]/80 backdrop-blur-md rounded-xl px-4 py-2',
          'border border-white/10 shadow-lg',
          'overflow-x-auto no-scrollbar'
        )}
      >
        <div className="flex-shrink-0">
          <CallControls
            onLeave={async () => {
              try {
                if (call) {
                  await call.camera.disable();
                  await call.microphone.disable();
                }
                router.push('/dashboard');
              } catch (error) {
                console.error('Error leaving call:', error);
                router.push('/dashboard');
              }
            }}
          />
        </div>

        <div className="flex-shrink-0">
          <DropdownMenu>
            <DropdownMenuTrigger className="cursor-pointer rounded-full bg-[#19232d] p-2 hover:bg-[#4c535b]">
              <LayoutList size={20} className="text-white" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white dark:bg-[#1e1e2d] border-gray-200 dark:border-gray-700" sideOffset={8}>
              {['grid', 'speaker-left', 'speaker-right'].map((item, index) => (
                <DropdownMenuItem
                  key={index}
                  onClick={() => setLayout(item.toLowerCase() as CallLayoutType)}
                  className={cn(
                    'flex items-center gap-2 cursor-pointer',
                    'px-4 py-2 text-sm rounded-md',
                    'text-gray-900 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700',
                    'focus:bg-gray-100 dark:focus:bg-gray-700 outline-none',
                    'transition-colors duration-200'
                  )}
                >
                  {item
                    .split('-')
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ')}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex-shrink-0">
          <CallStatsButton />
        </div>

        <div className="flex-shrink-0">
          <Button
            onClick={() => (setShowParticipants((prev) => !prev), setShowParticipantsChat(false))}
            variant="default"
            size="icon"
            className={cn(
              'rounded-full bg-[#19232d] hover:bg-[#4c535b]',
              'h-10 w-10 p-0',
              'transition-colors duration-200',
              'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary',
              showParticipants && 'bg-[#4c535b]'
            )}
          >
            <Users size={20} className="text-white" />
          </Button>
        </div>
        <div className="flex-shrink-0">
          <Button
            onClick={() => (setShowParticipantsChat((prev) => !prev), setShowParticipants(false))}
            variant="default"
            size="icon"
            className={cn(
              'rounded-full bg-[#19232d] hover:bg-[#4c535b]',
              'h-10 w-10 p-0',
              'transition-colors duration-200',
              'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary',
              showParticipantsChat && 'bg-[#4c535b]'
            )}
          >
            <ChartBarIcon size={20} className="text-white" />
          </Button>
        </div>

        {!isPersonal && (
          <div className="flex-shrink-0">
            <EndCallButton />
          </div>
        )}
      </div>

      <style jsx global>{`
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};

export default MeetingRoom;
