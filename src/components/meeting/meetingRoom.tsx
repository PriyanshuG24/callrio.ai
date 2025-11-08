"use client";

import {
  useCall,
  PaginatedGridLayout,
  SpeakerLayout,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { useTheme } from "next-themes";
import { useCallStore } from "@/store/callStore";
import { useMeetingLifecycle } from "./hooks/useMeetingLifecycle";
import { useAutoHideControls } from "./hooks/useAutoHideControls";
import { MeetingControls } from "./meetingControls";
import { MeetingChatPanel } from "./meetingChatPanel";
import { MeetingParticipantsList } from "./meetingParticipantsList";
import { ProcessingOverlay } from "./meetingProcessingOverlay";
type CallLayoutType = "grid" | "speaker-left" | "speaker-right";

export const MeetingRoom = () => {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { data: session } = useSession();
  const call = useCall();
  const { useLocalParticipant } = useCallStateHooks();
  const localParticipant = useLocalParticipant();
  const { addEndedCall, addCallRecording } = useCallStore();

  const [layout, setLayout] = useState<CallLayoutType>("grid");
  const [showParticipants, setShowParticipants] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [message, setMessage] = useState("Leaving meeting...");
  const [isEndingMeeting, setIsEndingMeeting] = useState(false);
  useEffect(() => {
    const prevTheme = theme;
    setTheme("dark");
    return () => setTheme(prevTheme || "light");
  }, []);

  const {
    recordingReady,
    transcriptionReady,
    isMeetingOwner,
    liveChatChannel,
    isMeetingEnded,
    isUpdateMeetingParticipantSessionHistory,
    isRecordingButtonClicked,
  } = useMeetingLifecycle(
    call,
    localParticipant,
    addEndedCall,
    addCallRecording,
    session
  );

  const { showControls, handleInteraction } = useAutoHideControls(3000);

  useEffect(() => {
    if (!isEndingMeeting) return;

    let allDone = false;
    if (isRecordingButtonClicked) {
      allDone =
        recordingReady &&
        transcriptionReady &&
        isUpdateMeetingParticipantSessionHistory;
    } else {
      allDone = transcriptionReady && isUpdateMeetingParticipantSessionHistory;
    }

    if (allDone) {
      const timer = setTimeout(() => router.replace("/dashboard"), 1500);
      return () => clearTimeout(timer);
    }
  }, [
    isEndingMeeting,
    recordingReady,
    transcriptionReady,
    router,
    isUpdateMeetingParticipantSessionHistory,
    isRecordingButtonClicked,
  ]);

  useEffect(() => {
    if (isMeetingEnded && !isMeetingOwner) {
      setIsRedirecting(true);
      setMessage("Meeting ended by host. Redirecting to dashboard...");
      const timer = setTimeout(() => router.replace("/dashboard"), 1500);
      return () => clearTimeout(timer);
    }
  }, [isMeetingEnded]);

  const CallLayout = useCallback(() => {
    switch (layout) {
      case "grid":
        return <PaginatedGridLayout />;
      case "speaker-left":
        return <SpeakerLayout participantsBarPosition="left" />;
      case "speaker-right":
        return <SpeakerLayout participantsBarPosition="right" />;
      default:
        return <PaginatedGridLayout />;
    }
  }, [layout]);

  if (isRedirecting) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-white">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="mt-4">{message}</p>
      </div>
    );
  }

  if (!call) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-white">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="mt-4">Joining the meeting...</p>
      </div>
    );
  }

  return (
    <section className="relative h-screen w-full overflow-hidden text-white bg-black">
      <div className="relative size-full flex items-center justify-center">
        <CallLayout />

        {showChat && liveChatChannel && (
          <MeetingChatPanel
            channel={liveChatChannel}
            onClose={() => setShowChat(false)}
          />
        )}
        {showParticipants && (
          <MeetingParticipantsList
            showParticipants={showParticipants}
            onClose={() => setShowParticipants(false)}
          />
        )}
      </div>

      <MeetingControls
        layout={layout}
        setLayout={setLayout}
        showControls={showControls}
        onInteraction={handleInteraction}
        onToggleParticipants={() => {
          setShowParticipants((prev) => {
            const newState = !prev;
            if (newState) setShowChat(false);
            return newState;
          });
        }}
        onToggleChat={() => {
          setShowChat((prev) => {
            const newState = !prev;
            if (newState) setShowParticipants(false);
            return newState;
          });
        }}
        isOwner={isMeetingOwner}
        router={router}
        setIsEndingMeeting={setIsEndingMeeting}
      />
      {isEndingMeeting && (
        <ProcessingOverlay
          isRecordingButtonClicked={isRecordingButtonClicked}
          recordingReady={recordingReady}
          transcriptionReady={transcriptionReady}
          chatReady={true}
        />
      )}
    </section>
  );
};
