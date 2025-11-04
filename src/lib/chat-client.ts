// src/lib/chat-client.ts
import { StreamChat } from 'stream-chat';
import { generateClientToken } from '@/actions/streamAction/generate-client-token';

let chatClientInstance: StreamChat | null = null;

export const getChatClient = async ({
  id,
  name,
  image,
}: {
  id: string;
  name: string;
  image?: string;
}) => {
  if (chatClientInstance) return chatClientInstance;

  const token =await generateClientToken(id);

  const client = StreamChat.getInstance(process.env.NEXT_PUBLIC_STREAM_API_KEY!,);
  if(!client || !token){
    throw new Error('Failed to initialize Stream Chat client');
  }

  await client.connectUser({ id, name, image }, token);

  chatClientInstance = client;
  return client;
};