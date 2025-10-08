'use client';
import { useEffect, useState } from 'react';
import { getChatClient } from '@/lib/chat-client';
import { useSession } from '@/lib/auth-client';
import { createOrUpdateMeetingChannel } from '@/actions/streamAction/manage-meeting-channel';
import type { Channel } from 'stream-chat';

export const useMeetingChat = (callId: string, otherUserIds: string[] = []) => {
  const [channel, setChannel] = useState<Channel | null>(null);
  const { data: session } = useSession();

  useEffect(() => {
    if (!session?.user) return;

    const initChannel = async () => {
      try {
        const { id, name, image } = session.user;
        await createOrUpdateMeetingChannel(callId, otherUserIds, id);
        const chatClient = await getChatClient({ id, name, image: image || undefined });
        const ch = chatClient.channel('messaging', callId);
        await ch.watch();
        setChannel(ch);
        
      } catch (err) {
        console.error('Failed to create/fetch meeting chat channel:', err);
      }
    };

    initChannel();
  }, [session, callId, otherUserIds.join(',')]);

  return channel;
};