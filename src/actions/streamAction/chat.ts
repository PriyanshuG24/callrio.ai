"use server";

import { StreamChat } from "stream-chat";

const serverClient = StreamChat.getInstance(
  process.env.NEXT_PUBLIC_STREAM_API_KEY!,
  process.env.STREAM_SECRET_KEY!
);

export async function getMeetingChat(meetingId: string) {
  try {
    const channel = serverClient.channel("messaging", meetingId,{
      created_by_id: meetingId
    });
    const state = await channel.query({ messages: { limit: 50 } });
    return state.messages;
  } catch (err) {
    console.error("Error fetching meeting chat:", err);
    return [];
  }
}
