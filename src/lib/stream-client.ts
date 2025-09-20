// src/lib/stream-client.ts
import { StreamVideoClient } from '@stream-io/video-react-sdk';
import { tokenProvider } from '@/actions/streamAction/stream.action';

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;

if (!apiKey) {
  throw new Error('Missing NEXT_PUBLIC_STREAM_API_KEY environment variable');
}

let clientInstance: StreamVideoClient | null = null;

export const getStreamClient = (userId: string, userName: string, userImage?: string) => {
  if (clientInstance) {
    return clientInstance;
  }

  clientInstance = new StreamVideoClient({
    apiKey,
    user: {
      id: userId,
      name: userName,
      image: userImage,
    },
    tokenProvider,
  });

  return clientInstance;
};

export const disconnectStreamClient = () => {
  if (clientInstance) {
    clientInstance.disconnectUser();
    clientInstance = null;
  }
};