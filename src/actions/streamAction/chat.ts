"use server";

import { StreamChat } from "stream-chat";

const serverClient = StreamChat.getInstance(
  process.env.NEXT_PUBLIC_STREAM_API_KEY!,
  process.env.STREAM_SECRET_KEY! // server-side secret
);

export async function getMeetingChat(meetingId: string) {
  try {
    const channel = serverClient.channel("messaging", meetingId,{
      created_by_id: meetingId
    });
    await channel.watch();

    return channel.state.messages; // array of messages
  } catch (err) {
    console.error("Error fetching meeting chat:", err);
    return [];
  }
}
