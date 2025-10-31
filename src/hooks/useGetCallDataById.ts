import { useState, useRef } from "react";
import { getMeetingParticipants } from "../actions/dbAction/participant";
import { getTranscriptions } from "../actions/dbAction/transcription";
import { getMeetingById } from "../actions/dbAction/meeting";
import { generateSummary, downloadSummaryPDF, formateTranscription } from "../lib/utils";
import { getMeetingRecordings } from "../actions/dbAction/recording";

import { useMeetingStore } from "@/store/meetingStore";
import { saveSessionData, getSessionData } from "@/utils/sessionCache";

export const useGetCallDataById = (meetingId: string) => {
  const { getMeeting, storeMeeting } = useMeetingStore();
  const cached = getMeeting(meetingId) || getSessionData(meetingId);

  const [callData, setCallData] = useState<any>(cached?.meeting || null);
  const [transcriptions, setTranscriptions] = useState<Object[]>(
    cached?.transcriptions || []
  );
  const [meetingRecording, setMeetingRecording] = useState<string>(
    cached?.recording || ""
  );

  const [isCallLoading, setIsCallLoading] = useState(false);
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);
  const [summary, setSummary] = useState<any>(null);

  const participantMap = useRef(new Map<string, string>());

  const fetchTranscriptionFile = async (url: string) => {
    const response = await fetch(url);
    const text = await response.text();
    return text.split("\n").filter(Boolean).map((line) => JSON.parse(line));
  };

  const fetchCallDataById = async (force = false) => {
    if (!force && cached) return;

    setIsCallLoading(true);
    try {
      const call = await getMeetingById(meetingId);
      const recordings = await getMeetingRecordings(meetingId);
      const transData = await getTranscriptions(meetingId);
      const participants = await getMeetingParticipants(meetingId);

      setCallData(call?.[0] || null);

      if (recordings?.length) {
        setMeetingRecording(recordings[0].url);
      }

      if (transData?.length) {
        const allLines = await Promise.all(
          transData.map(async (t) => {
            try {
              return await fetchTranscriptionFile(t.url);
            } catch {
              return [];
            }
          })
        );

        const flat = allLines.flat();

        participants.forEach((p) =>
          participantMap.current.set(p.participantId, p.participantName)
        );

        const enriched = flat.map((t) => ({
          ...t,
          name: participantMap.current.get(t.speaker_id) || "Unknown",
        }));

        const formatted = formateTranscription(enriched);
        setTranscriptions(formatted);

        const finalData = {
          meeting: call?.[0] || null,
          recording: recordings?.[0]?.url || "",
          transcriptions: formatted,
        };

        storeMeeting(meetingId, finalData);
        saveSessionData(meetingId, finalData);
      }
    } finally {
      setIsCallLoading(false);
    }
  };

  const fetchSummaryById = async () => {
    setIsSummaryLoading(true);
    const SummaryData = await generateSummary(transcriptions);
    setSummary(SummaryData);
    setIsSummaryLoading(false);
  };

  const downloadSummaryById = () => downloadSummaryPDF(summary, callData);

  return {
    callData,
    isCallLoading,
    isSummaryLoading,
    summary,
    fetchCallDataById,
    transcriptions,
    fetchSummaryById,
    downloadSummaryById,
    meetingRecording,
  };
};
