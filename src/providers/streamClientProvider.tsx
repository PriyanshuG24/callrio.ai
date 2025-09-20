// src/providers/streamClientProvider.tsx
'use client'

import { StreamVideo, StreamVideoClient } from "@stream-io/video-react-sdk";
import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { generateToken } from "@/actions/streamAction/generate-token";
import Loader from "@/components/ui/loader";

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;

if (!apiKey) {
  throw new Error('Missing NEXT_PUBLIC_STREAM_API_KEY environment variable');
}

// Store the client instance outside the component
let clientInstance: StreamVideoClient | null = null;

export const StreamVideoProvider = ({ children }: { children: React.ReactNode }) => {
  const [videoClient, setVideoClient] = useState<StreamVideoClient | null>(null);
  const { data: session, isPending } = useSession();

  // Initialize Stream client only when we have a valid session
  useEffect(() => {
    if (isPending || !session?.user) {
      return;
    }

    // If we already have a client instance, use it
    if (clientInstance) {
      setVideoClient(clientInstance);
      return;
    }

    const user = session.user;
    
    // Create a new client instance if one doesn't exist
    const client = new StreamVideoClient({
      apiKey,
      user: {
        id: user.id || '',
        name: user.name || '',
        image: user.image || undefined,
      },
      tokenProvider:generateToken,
    });
    
    // Store the instance
    clientInstance = client;
    setVideoClient(client);

    // Cleanup function
    return () => {
      // We don't disconnect the user here anymore since we want to reuse the instance
    };
  }, [isPending, session]);

  if (isPending || !videoClient) {
    return <Loader />;
  }

  return (
    <StreamVideo client={videoClient}>
      {children}
    </StreamVideo>
  );
};