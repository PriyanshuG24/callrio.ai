"use client";

import {
  useCall,
  CallControls,
  CallParticipantsList,
  CallStatsButton,
  PaginatedGridLayout,
  SpeakerLayout,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import { useState, useCallback, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../ui/dropdown-menu";
import { LayoutList, Users, Loader2, ChartBarIcon } from "lucide-react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { EndCallButton } from "./endCallButton";
import { toast } from "sonner";
import { useSession } from "@/lib/auth-client";
import { useMeetingChat } from "@/hooks/useMeetingChat";
import { MeetingChat } from "@/components/meeting/meetingChat";
import { formatDate } from "@/lib/utils";
import { endMeeting } from "@/actions/dbAction/meeting";
import {
  createMeetingParticipant,
  createMeetingParticipantSessionHistory,
  updateMeetingParticipantSessionHistory,
} from "@/actions/dbAction/participant";
import { createMeetingRecording } from "@/actions/dbAction/recording";
import { createMeetingTranscription } from "@/actions/dbAction/transcription";
import { useCallStore } from "@/store/callStore";
import { useTheme } from "next-themes";

type CallLayoutType = "grid" | "speaker-left" | "speaker-right";

const MeetingRoom = () => {
  const [layout, setLayout] = useState<CallLayoutType>("speaker-left");
  const [showParticipants, setShowParticipants] = useState(false);
  const [showParticipantsChat, setShowParticipantsChat] = useState(false);
  const { useParticipants, useLocalParticipant } = useCallStateHooks();
  const [isSessionStarted, setIsSessionStarted] = useState(true);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const participants = useParticipants();
  const localParticipant = useLocalParticipant();
  const router = useRouter();
  const call = useCall();
  const { theme, setTheme } = useTheme();
  const { data: user } = useSession();
  const [recordingReady, setRecordingReady] = useState(false);
  const [isRecordingAvailable, setIsRecordingAvailable] = useState(false);
  const [transcriptionReady, setTranscriptionReady] = useState(false);
  const [message, setMessage] = useState("");
  const { addEndedCall, addCallRecording } = useCallStore();
  const [showControls, setShowControls] = useState(true);
  const controlsTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isInteracting = useRef(false);
  const CONTROLS_TIMEOUT = 3000;
  const [oldTheme, setOldTheme] = useState<string>(theme || "light");

  const isMeetingOwner =
    localParticipant &&
    call?.state?.createdBy &&
    localParticipant.userId === call.state.createdBy.id;
  const otherUserIds = participants
    .filter((p) => p.userId !== user?.user.id)
    .map((p) => p.userId || "");
  const channel = useMeetingChat(call?.id || "", otherUserIds);

  const activeParticipantMap = useRef(new Map<string, string>());
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
  useEffect(() => {
    setOldTheme(theme || "light");
    setTheme("dark");
    return () => {
      setTheme(oldTheme);
    };
  }, [theme]);
  useEffect(() => {
    if (!call) return;
    const cleanupMedia = async () => {
      try {
        for (const [key, value] of activeParticipantMap.current) {
          console.log("key", key, "value", value);
          await updateMeetingParticipantSessionHistory(call?.id, key, value);
        }
        activeParticipantMap.current.clear();
        await Promise.allSettled([
          call.camera?.disable(),
          call.microphone?.disable(),
        ]);
        localParticipant?.videoStream
          ?.getTracks?.()
          .forEach((t: MediaStreamTrack) => t.stop());
        localParticipant?.audioStream
          ?.getTracks?.()
          .forEach((t: MediaStreamTrack) => t.stop());
      } catch (err) {
        console.error("Error cleaning up media:", err);
      }
    };
    const onEnded = async () => {
      await cleanupMedia();
      const { data, success, message } = await endMeeting(call?.id);
      setIsRedirecting(true);
      setMessage(message);
      if (success && data?.id) {
        addEndedCall({
          id: data?.id,
          meetingId: data?.meetingId,
          title: data?.title,
          ownerId: data?.ownerId,
          isStarted: data?.isStarted,
          isEnded: data?.isEnded,
          startAt: data?.startAt,
          endedAt: data?.endedAt,
          createdAt: data?.createdAt,
        });
      }
    };
    const onJoined = async (event: any) => {
      if (event.participant.userId !== localParticipant?.userId) {
        if (activeParticipantMap.current.has(event.participant.user?.id)) {
          console.log("Participant already tracked, skipping duplicate insert");
          return;
        }
        const participanttt = await event.participant;
        console.log("joined", participanttt);
        toast.success(
          `${event.participant.user?.name || "Someone"} joined the meeting`
        );
        console.log(
          `Participant ${event.participant.user?.name || "Someone"} joined at:`,
          formatDate(Date.now())
        );
        await createMeetingParticipant(
          call?.id,
          event.participant.user?.id,
          event.participant.user?.name || "Unknown",
          event.participant.user?.role
        );
        await createMeetingParticipantSessionHistory(
          call?.id,
          event.participant.user?.id,
          event.participant.user_session_id
        );
        activeParticipantMap.current.set(
          event.participant.user?.id,
          event.participant.user_session_id
        );
      }
    };
    const onLeft = async (event: any) => {
      if (event.participant.userId !== localParticipant?.userId) {
        if (!activeParticipantMap.current.has(event.participant.user?.id)) {
          console.log("Participant already tracked, skipping duplicate insert");
          return;
        }
        const participanttt = await event.participant;
        console.log("left", participanttt);
        toast.warning(
          `${event.participant.user?.name || "Someone"} left the meeting`
        );
        console.log(
          `Participant ${event.participant.user?.name || "Someone"} left at:`,
          formatDate(Date.now())
        );
        await updateMeetingParticipantSessionHistory(
          call?.id,
          event.participant.user?.id,
          event.participant.user_session_id
        );
        activeParticipantMap.current.delete(event.participant.user?.id);
      }
    };
    const onStarted = () => setIsSessionStarted(true);
    const onRecordingReady = async (event: any) => {
      setMessage("Recording Uploading...");
      console.log("Recording ready", event);
      const { call_recording } = event;
      if (call_recording) {
        const { data, success } = await createMeetingRecording(
          call?.id,
          call_recording.url,
          call_recording.session_id,
          new Date(call_recording.start_time),
          new Date(call_recording.end_time)
        );
        if (success && data?.id) {
          addCallRecording({
            id: data?.id,
            meetingId: data?.meetingId,
            url: data?.url,
            sessionId: data?.sessionId,
            start_time: data?.start_time,
            end_time: data?.end_time,
          });
        }
      }
      setRecordingReady(true);
    };
    const onTranscriptionReady = async (event: any) => {
      setMessage("Transcription Uploading...");
      console.log("Transcription ready", event);
      const { call_transcription } = event;
      if (call_transcription) {
        await createMeetingTranscription(
          call?.id,
          call_transcription.url,
          call_transcription.session_id,
          new Date(call_transcription.start_time),
          new Date(call_transcription.end_time)
        );
      }
      setTranscriptionReady(true);
    };
    const onRecordingEnded = async (event: any) => {
      setIsRecordingAvailable(true);
      console.log("Recording ended", event);
    };
    call.on?.("call.ended" as any, onEnded);
    call.on?.("call.session_participant_joined" as any, onJoined);
    call.on?.("call.session_participant_left" as any, onLeft);
    call.on?.("call.session_started" as any, onStarted);
    call.on?.("call.recording_ready" as any, onRecordingReady);
    call.on?.("call.transcription_ready" as any, onTranscriptionReady);
    call.on?.("call.recording_stopped" as any, onRecordingEnded);
    if (call.state?.endedAt) {
      onEnded();
    }

    return () => {
      call.off?.("call.ended" as any, onEnded);
      call.off?.("call.session_participant_joined" as any, onJoined);
      call.off?.("call.session_participant_left" as any, onLeft);
      call.off?.("call.session_started" as any, onStarted);
      call.off?.("call.recording_ready" as any, onRecordingReady);
      call.off?.("call.transcription_ready" as any, onTranscriptionReady);
      call.off?.("call.recording_stopped" as any, onRecordingEnded);
    };
  }, [call, localParticipant, isRedirecting, router]);
  useEffect(() => {
    if (isRecordingAvailable && call?.state?.endedAt && transcriptionReady) {
      console.log("Recording available and transcription ready");
      if (recordingReady && transcriptionReady) {
        setIsRedirecting(true);
        const timer = setTimeout(() => {
          router.replace("/dashboard");
        }, 1000);
        return () => clearTimeout(timer);
      }
    } else if (
      !isRecordingAvailable &&
      call?.state?.endedAt &&
      transcriptionReady
    ) {
      console.log("Recording not available and transcription ready");
      setIsRedirecting(true);
      const timer = setTimeout(() => {
        router.replace("/dashboard");
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [
    recordingReady,
    transcriptionReady,
    router,
    isRecordingAvailable,
    call?.state?.endedAt,
  ]);
  const hideControls = useCallback(() => {
    if (!isInteracting.current) {
      setShowControls(false);
    }
  }, []);

  const resetControlsTimer = useCallback(() => {
    setShowControls(true);

    if (controlsTimeout.current) {
      clearTimeout(controlsTimeout.current);
      controlsTimeout.current = null;
    }

    if (!isInteracting.current) {
      controlsTimeout.current = setTimeout(() => {
        hideControls();
      }, CONTROLS_TIMEOUT);
    }
  }, [hideControls]);

  useEffect(() => {
    const handleUserActivity = () => {
      resetControlsTimer();
    };

    window.addEventListener("mousemove", handleUserActivity);
    window.addEventListener("touchstart", handleUserActivity);
    window.addEventListener("keydown", handleUserActivity);

    resetControlsTimer();

    return () => {
      window.removeEventListener("mousemove", handleUserActivity);
      window.removeEventListener("touchstart", handleUserActivity);
      window.removeEventListener("keydown", handleUserActivity);
      if (controlsTimeout.current !== null) {
        window.clearTimeout(controlsTimeout.current);
      }
    };
  }, [resetControlsTimer]);
  const handleControlInteraction = (isInteractingState: boolean) => {
    isInteracting.current = isInteractingState;
    if (isInteractingState) {
      setShowControls(true);
      if (controlsTimeout.current !== null) {
        window.clearTimeout(controlsTimeout.current);
        controlsTimeout.current = null;
      }
    } else {
      resetControlsTimer();
    }
  };

  useEffect(() => {
    if (showParticipants || showParticipantsChat) {
      setShowControls(true);
      if (controlsTimeout.current !== null) {
        window.clearTimeout(controlsTimeout.current);
        controlsTimeout.current = null;
      }
    } else {
      resetControlsTimer();
    }
  }, [showParticipants, showParticipantsChat, resetControlsTimer]);
  if (isRedirecting) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="mt-4">{message}</p>
      </div>
    );
  }

  if (!isSessionStarted) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="mt-4">Joining the meeting...</p>
      </div>
    );
  }

  return (
    <>
      {call && (
        <section
          className={`relative h-screen w-full overflow-hidden pt-16 text-white`}
        >
          <div className="relative size-full flex items-center justify-center">
            <div className="relative size-full max-w-[1000px] lg:max-w-[850px] md:max-w-[800px] sm:max-w-[750px] xs:max-w-[700px] items-center justify-center">
              <CallLayout />
            </div>

            <div
              className={cn(
                "fixed right-2 bottom-6 hidden w-[300px] h-[calc(100vh-64px)]",
                "bg-[#1c1f2e]/80 backdrop-blur-md rounded-xl px-4 py-2 overflow-hidden shadow-2xl",
                "border border-white/10 shadow-lg",
                "transition-transform duration-300 transform",
                "translate-x-full",
                {
                  "translate-x-0 block": showParticipants,
                  "mr-4": showParticipants,
                }
              )}
            >
              <CallParticipantsList
                onClose={() => setShowParticipants(false)}
              />
            </div>

            {showParticipantsChat && channel && (
              <div className="fixed right-2 bottom-6 w-[400px] h-[calc(100vh-64px)] bg-[#1c1f2e]/80 backdrop-blur-md rounded-xl overflow-hidden ">
                <MeetingChat channel={channel} />
              </div>
            )}
          </div>

          <div
            className={cn(
              "fixed bottom-4 left-1/2 -translate-x-1/2",
              "flex items-center justify-center flex-wrap gap-2 md:gap-3 lg:gap-4",
              "w-auto max-w-[95%] sm:max-w-[90%] md:max-w-[80%]",
              "p-4 sm:p-5 md:p-6",
              "rounded-xl",
              "border border-white/10 shadow-lg backdrop-blur-md",
              "overflow-visible z-50",
              "transition-all duration-300 ease-in-out",
              showControls
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4 pointer-events-none",
              theme === "light" ? "bg-white/80" : "bg-[#1c1f2e]/80"
            )}
            onMouseEnter={() => handleControlInteraction(true)}
            onMouseLeave={() => handleControlInteraction(false)}
          >
            {/* Your existing controls */}
            <div className="flex-shrink-0">
              <CallControls onLeave={() => router.replace("/dashboard")} />
            </div>
            <div className="flex-shrink-0">
              <DropdownMenu>
                <DropdownMenuTrigger className="cursor-pointer rounded-full bg-[#19232d] p-2 hover:bg-[#4c535b]">
                  <LayoutList size={20} className="text-white" />
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="bg-white dark:bg-[#1e1e2d] border-gray-200 dark:border-gray-700"
                  sideOffset={8}
                >
                  {["grid", "speaker-left", "speaker-right"].map(
                    (item, index) => (
                      <DropdownMenuItem
                        key={index}
                        onClick={() =>
                          setLayout(item.toLowerCase() as CallLayoutType)
                        }
                        className={cn(
                          "flex items-center gap-2 cursor-pointer",
                          "px-4 py-2 text-sm rounded-md",
                          "text-gray-900 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700",
                          "focus:bg-gray-100 dark:focus:bg-gray-700 outline-none",
                          "transition-colors duration-200"
                        )}
                      >
                        {item
                          .split("-")
                          .map(
                            (word) =>
                              word.charAt(0).toUpperCase() + word.slice(1)
                          )
                          .join(" ")}
                      </DropdownMenuItem>
                    )
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="flex-shrink-0">
              <Button
                onClick={() => (
                  setShowParticipants((prev) => !prev),
                  setShowParticipantsChat(false)
                )}
                variant="default"
                size="icon"
                className={cn(
                  "rounded-full bg-[#19232d] hover:bg-[#4c535b]",
                  "h-10 w-10 p-0",
                  "transition-colors duration-200",
                  "focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary",
                  showParticipants && "bg-[#4c535b]"
                )}
              >
                <Users size={20} className="text-white" />
              </Button>
            </div>
            <div className="flex-shrink-0">
              <Button
                onClick={() => (
                  setShowParticipantsChat((prev) => !prev),
                  setShowParticipants(false)
                )}
                variant="default"
                size="icon"
                className={cn(
                  "rounded-full bg-[#19232d] hover:bg-[#4c535b]",
                  "h-10 w-10 p-0",
                  "transition-colors duration-200",
                  "focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary",
                  showParticipantsChat && "bg-[#4c535b]"
                )}
              >
                <ChartBarIcon size={20} className="text-white" />
              </Button>
            </div>

            {isMeetingOwner && (
              <div className="flex-shrink-0">
                <EndCallButton />
              </div>
            )}
          </div>

          <style jsx global>{`
            .no-scrollbar {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
            .no-scrollbar::-webkit-scrollbar {
              display: none;
            }
            /* Add these new styles */
            .controls-enter {
              opacity: 0;
              transform: translateY(20px);
            }
            .controls-enter-active {
              opacity: 1;
              transform: translateY(0);
              transition:
                opacity 300ms,
                transform 300ms;
            }
            .controls-exit {
              opacity: 1;
              transform: translateY(0);
            }
            .controls-exit-active {
              opacity: 0;
              transform: translateY(20px);
              transition:
                opacity 300ms,
                transform 300ms;
            }
          `}</style>
        </section>
      )}
    </>
  );
};

export default MeetingRoom;
