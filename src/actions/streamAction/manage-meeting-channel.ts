// src/actions/streamAction/manage-meeting-channel.ts
'use server';

import { StreamChat } from 'stream-chat';

const serverClient = StreamChat.getInstance(
  process.env.NEXT_PUBLIC_STREAM_API_KEY!,
  process.env.STREAM_SECRET_KEY!
);

export const createOrUpdateMeetingChannel = async (
  callId: string, 
  userIds: string[],
  currentUserId: string
) => {
  try {
    if (userIds.length < 2) {
      console.log('At least 2 users required for a channel');
    }

   
    const allMembers = Array.from(new Set([currentUserId, ...userIds]));

    // Try to get existing channel
    const existingChannels = await serverClient.queryChannels({
      type: 'messaging',
      id: callId
    });

    let channel;
    
    if (existingChannels.length > 0) {
      channel = existingChannels[0];
      
      // Get current members
      const currentMembers = Object.keys(channel.data?.members || {});
      
      // Find members to add
      const membersToAdd = allMembers.filter(memberId => !currentMembers.includes(memberId));
      
      if (membersToAdd.length > 0) {
        await channel.addMembers(membersToAdd);
        console.log(`Added ${membersToAdd.length} new members to channel ${callId}`);
      }
    } else {
      // Create new channel
      channel = serverClient.channel('messaging', callId, {
        members: allMembers,
        created_by_id: currentUserId
      });
      
      await channel.create();
      console.log(`Created new channel ${callId} with ${allMembers.length} members`);
    }

    return { success: true, channelId: callId };
  } catch (error) {
    console.error('Error managing meeting channel:', error);
    throw error;
  }
};
