'use client';
import { useEffect, useState } from 'react';
import { getChatClient } from '@/lib/chat-client';
import { useSession } from '@/lib/auth-client';
import type { Channel } from 'stream-chat';

interface User {
  id: string;
  name: string;
  image?: string | null;
}

export const useMeetingChat = (callId: string, otherUserIds: string[] = []) => {
  const [channel, setChannel] = useState<Channel | null>(null);
  const { data: session } = useSession();

  useEffect(() => {
    if (!session?.user) return;

    const initChannel = async () => {
        try {
          const { id, name, image } = session.user;
      
          const chatClient = await getChatClient({ id, name, image: image || undefined });
      
          // Ensure members array has at least 2 members
          const members = [id, ...otherUserIds];
          if (members.length < 2) {
            console.warn('Cannot create a chat channel with less than 2 members');
            return;
          }
      
          const ch = chatClient.channel('messaging', callId, { members });
      
          await ch.watch();
          setChannel(ch);
        } catch (err) {
          console.error('Failed to create/fetch meeting chat channel:', err);
        }
      };
      

    initChannel();
  }, [session, callId, otherUserIds]);

  return channel;
};
