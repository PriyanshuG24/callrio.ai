"use server";
import { StreamChat } from "stream-chat";

const serverClient = StreamChat.getInstance(
  process.env.NEXT_PUBLIC_STREAM_API_KEY!,
  process.env.STREAM_SECRET_KEY!
);
export async function createMeetingChannel(roomId: string, hostId: string) {
  try {
    await serverClient.upsertUsers([{ id: hostId }]);
    const channel = serverClient.channel("messaging", roomId, {
      name: `Meeting Channel`,
      created_by_id: hostId,
      description: `Dont spam!!`,
      members: [hostId],
      image: `https://imgs.search.brave.com/3D-AQfimLQASzjltXYeprzUQPBM1YMIDOdJCE_go_QM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/aWNvbnM4LmNvbS8_/c2l6ZT0xMjAwJmlk/PVRZSHBNM3dacXd4/MSZmb3JtYXQ9anBn`,
    } as any);

    await channel.create();
    return { success: true };
  } catch (error) {
    console.error("Channel creation failed:", error);
    return { success: false, error };
  }
}

export async function joinMeetingChannel(roomId: string, userId: string) {
  try {
    await serverClient.upsertUsers([{ id: userId }]);
    const channel = serverClient.channel("messaging", roomId);
    await channel.addMembers([userId]);
    return { success: true };
  } catch (error) {
    console.error("Failed to join channel:", error);
    return { success: false, error };
  }
}