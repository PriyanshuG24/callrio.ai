import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  createMeetingParticipant,
  createMeetingParticipantSessionHistory,
  updateMeetingParticipantSessionHistory,
} from "@/actions/dbAction/participant";
import { endMeeting } from "@/actions/dbAction/meeting";
import { createMeetingRecording } from "@/actions/dbAction/recording";
import { createMeetingTranscription } from "@/actions/dbAction/transcription";
import {
  createMeetingChannel,
  joinMeetingChannel,
} from "@/actions/streamAction/manage-meeting-channel";
import { useChatContext } from "stream-chat-react";
import { Channel } from "stream-chat";

export function useMeetingLifecycle(
  call: any,
  localParticipant: any,
  addEndedCall: any,
  addCallRecording: any,
  session: any
) {
  const activeParticipantMap = useRef(new Map<string, string>());
  const [recordingReady, setRecordingReady] = useState(false);
  const [transcriptionReady, setTranscriptionReady] = useState(false);
  const [isMeetingOwner, setIsMeetingOwner] = useState(false);
  const [isMeetingEnded, setIsMeetingEnded] = useState(false);
  const [liveChatChannel, setLiveChatChannel] = useState<Channel | null>(null);
  const [isUpdateMeetingParticipantSessionHistory, setIsUpdateMeetingParticipantSessionHistory] = useState(false);
  const [isRecordingButtonClicked, setIsRecordingButtonClicked] = useState(false);
  const { client } = useChatContext();

  useEffect(() => {
    if (!call || !session || !localParticipant) return;
    const isOwner = session.user.id === call.state.createdBy?.id;
    setIsMeetingOwner(isOwner);

    (async () => {
      try {
        if (isOwner)
          await createMeetingChannel(call.id, session.user.id);
        else
          await joinMeetingChannel(call.id, session.user.id);

        const ch = client.channel("messaging", call.id);
        await ch.watch();
        setLiveChatChannel(ch);
      } catch (err) {
        console.error("Channel setup error", err);
      }
    })();
  }, [call, localParticipant, session]);

  useEffect(() => {
    if (!call) return;

    const cleanupMedia = async () => {
      try {
        for (const [key,value] of activeParticipantMap.current){
          await updateMeetingParticipantSessionHistory(call?.id, key, value);
          setIsUpdateMeetingParticipantSessionHistory(true);
        }
        activeParticipantMap.current.clear();
        await Promise.allSettled([call.camera?.disable(), call.microphone?.disable()]);
        localParticipant?.videoStream?.getTracks?.().forEach((t: MediaStreamTrack) => t.stop());
        localParticipant?.audioStream?.getTracks?.().forEach((t: MediaStreamTrack) => t.stop());
      } catch (err) {
        console.error("Media cleanup error", err);
      }
    };

    const onEnded = async () => {
      await cleanupMedia();
      const { data, success } = await endMeeting(call?.id);
      if (success && data?.id) addEndedCall(data);
      setIsMeetingEnded(true);
    };

    const onJoined = async (event: any) => {
      if (event.participant.userId === localParticipant?.userId) return;
      if (activeParticipantMap.current.has(event.participant?.user?.id)) return;
      toast.success(`${event.participant?.user?.name || "Someone"} joined`);
      await createMeetingParticipant(call.id, event.participant?.user?.id, event.participant?.user?.name || "Unknown", event.participant?.user?.role);
      await createMeetingParticipantSessionHistory(call.id, event.participant?.user?.id, event.participant?.user_session_id);
      activeParticipantMap.current.set(event.participant?.user?.id, event.participant?.user_session_id);
    };

    const onLeft = async (event: any) => {
      if (event.participant.userId === localParticipant?.userId) return;
      if (!activeParticipantMap.current.has(event.participant?.user?.id)) return;
      toast.warning(`${event.participant?.user?.name || "Someone"} left`);
      await updateMeetingParticipantSessionHistory(call.id, event.participant?.user?.id, event.participant?.user_session_id);
      activeParticipantMap.current.delete(event.participant?.user?.id);
    };

    const onRecordingReady = async ({ call_recording }: any) => {
      if (!call_recording) return;
      const { data, success } = await createMeetingRecording(
        call.id,
        call_recording.url,
        call_recording.session_id,
        new Date(call_recording.start_time),
        new Date(call_recording.end_time)
      );
      if (success && data?.id) addCallRecording(data);
      setRecordingReady(true);
      setIsRecordingButtonClicked(true);
    };

    const onTranscriptionReady = async ({ call_transcription }: any) => {
      if (!call_transcription) return;
      await createMeetingTranscription(
        call.id,
        call_transcription.url,
        call_transcription.session_id,
        new Date(call_transcription.start_time),
        new Date(call_transcription.end_time)
      );
      setTranscriptionReady(true);
    };

    call.on("call.ended" as any, onEnded);
    call.on("call.session_participant_joined" as any, onJoined);
    call.on("call.session_participant_left" as any, onLeft);
    call.on("call.recording_ready" as any, onRecordingReady);
    call.on("call.transcription_ready" as any, onTranscriptionReady);
    if(call.state?.endedAt){
      onEnded();
    }
    return () => {
      call.off("call.ended" as any, onEnded);
      call.off("call.session_participant_joined" as any, onJoined);
      call.off("call.session_participant_left" as any, onLeft);
      call.off("call.recording_ready" as any, onRecordingReady);
      call.off("call.transcription_ready" as any, onTranscriptionReady);
    };
  }, [call,localParticipant,session]);

  return { recordingReady, transcriptionReady, isMeetingOwner, liveChatChannel, isMeetingEnded ,isUpdateMeetingParticipantSessionHistory,isRecordingButtonClicked};
}
