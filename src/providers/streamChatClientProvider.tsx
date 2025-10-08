'use client';

import { Chat } from 'stream-chat-react';
import { useEffect, useState } from 'react';
import { useSession } from '@/lib/auth-client';
import { getChatClient } from '@/lib/chat-client';
import Loader from '@/components/ui/loader';
export const StreamChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [chatClient, setChatClient] = useState<any>(null);
  const { data: session, isPending } = useSession();
  useEffect(() => {
    if (isPending || !session?.user) return;

    const init = async () => {
      try {
        const client = await getChatClient({
          id: session.user.id,
          name: session.user.name,
          image: session.user.image || undefined,
        });
        setChatClient(client);
      } catch (err) {
        console.error('Failed to initialize Stream Chat:', err);
      }
    };

    init();
  }, [isPending, session]);

  if (isPending || !chatClient) return <Loader />;

  return (
    <Chat client={chatClient}>
      {children}
    </Chat>
  );
};