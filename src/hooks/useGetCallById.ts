import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useState,useRef } from "react";
import { getMeetingParticipants } from "../actions/dbAction/participant";
import { getTranscriptions } from "../actions/dbAction/transcription";

export const useGetCallById = (isTranscriptionRequired:boolean) => {
  const [call, setCall] = useState<Call>();
  const [transcriptions, setTranscriptions] = useState<Object[]>([]);
  const [isCallLoading, setIsCallLoading] = useState(false);
  const participantMap = useRef(new Map<string,string>());
  const client = useStreamVideoClient();
    const fetchTranscriptionFile = async (url: string) => {
      const response = await fetch(url);
      const text = await response.text(); 
      const lines = text.split("\n").filter(Boolean);
      const transcriptionData = lines.map((line) => JSON.parse(line));
      return transcriptionData;
    };
  
  const fetchCallById = async (id: string) => {
    if (!client) return;
    setIsCallLoading(true);

    try {
      const { calls } = await client.queryCalls({
        filter_conditions: { id: { $eq: id } },
      });

      if (calls.length > 0) {
        const fetchedCall = calls[0];
        setCall(fetchedCall);
        if(isTranscriptionRequired){
          const data = await getTranscriptions(id);
          console.log("Transcriptions",data);
          if (data?.length) {
            const allLines = await Promise.all(
              data.map(async (t) => fetchTranscriptionFile(t.url))
            );
            const flatTranscriptions = allLines.flat();
            const participants=await getMeetingParticipants(id);
            participants.forEach((p) => {
              participantMap.current.set(p.participantId, p.participantName);
            });
            const enrichedTranscriptions = flatTranscriptions.map((t) => ({
              ...t,
              name: participantMap.current.get(t.speaker_id) || "Unknown",
            }));
            setTranscriptions(enrichedTranscriptions);
          }
        }
      }
    } catch (err) {
      console.error("Error fetching call or transcriptions:", err);
    } finally {
      setIsCallLoading(false);
    }
  };

  return { call, isCallLoading, fetchCallById, transcriptions };
};
