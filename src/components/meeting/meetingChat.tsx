'use client';
import {
  Channel,
  Window,
  MessageList,
  MessageInput,
  ChannelHeader,
} from 'stream-chat-react';
import type { Channel as StreamChannel } from 'stream-chat';

export const MeetingChat = ({ channel }: { channel: StreamChannel | null }) => {
  if (!channel) return null;

  return (
    <Channel channel={channel}>
      <Window>
        <ChannelHeader />
        <MessageList />
        <MessageInput />
      </Window>
    </Channel>
  );
};
