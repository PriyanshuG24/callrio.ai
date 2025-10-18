import { useState,useRef } from "react";
import { getMeetingParticipants } from "../actions/dbAction/participant";
import { getTranscriptions } from "../actions/dbAction/transcription";
import { getMeetingById } from "../actions/dbAction/meeting";
import { generateSummary ,downloadSummaryPDF,formateTranscription} from "../lib/utils";

export const useGetCallDataById = (meetingId:string) => {
  const [callData, setCallData] = useState<any>(null);
  const [transcriptions, setTranscriptions] = useState<Object[]>([]);
  const [isCallLoading, setIsCallLoading] = useState(false);
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);
  const [summary,setSummary]=useState<any>(null);
  const participantMap = useRef(new Map<string,string>());
    const fetchTranscriptionFile = async (url: string) => {
      const response = await fetch(url);
      const text = await response.text(); 
      const lines = text.split("\n").filter(Boolean);
      const transcriptionData = lines.map((line) => JSON.parse(line));
      return transcriptionData;
    };
  
  const fetchCallDataById = async () => {
    
    setIsCallLoading(true);

    try {
      const call = await getMeetingById(meetingId);
      setCallData(call?.[0]);
        try {
          const data = await getTranscriptions(meetingId);
          if (data?.length) {
            const allLines = await Promise.all(
              data.map(async (t) => {
                try {
                  return await fetchTranscriptionFile(t.url);
                } catch (err) {
                  console.error('Error fetching transcription file:', t.url, err);
                  return [];
                }
              })
            );
            
            const flatTranscriptions = allLines.flat();
            
            try {
              const participants = await getMeetingParticipants(meetingId);
              participants.forEach((p) => {
                participantMap.current.set(p.participantId, p.participantName);
              });
            } catch (err) {
              console.error('Error fetching participants:', err);
            }
            
            const enrichedTranscriptions = flatTranscriptions.map((t) => ({
              ...t,
              name: participantMap.current.get(t.speaker_id) || 'Unknown',
            }));
            
            const updatedTranscriptions = formateTranscription(enrichedTranscriptions,data?.[0]?.start_time,data?.[0]?.end_time);
            setTranscriptions(updatedTranscriptions);
          }
        } catch (transcriptionError) {
          console.error('Error processing transcriptions:', transcriptionError);
        }
    } catch (err) {
      console.error("Error fetching call or transcriptions:", err);
    } finally {
      setIsCallLoading(false);
    }
  };

  const fetchSummaryById = async () => {
    setIsSummaryLoading(true);
    try {
      const SummaryData = await generateSummary(transcriptions);
      setSummary(SummaryData);
    } catch (err) {
      console.error("Error fetching summary:", err);
    } finally {
      setIsSummaryLoading(false);
    }
  };
  const downloadSummaryById = async () => {
    try {
      downloadSummaryPDF(summary,callData);
    } catch (err) {
      console.error("Error downloading summary:", err);
    }
  };
  return {callData,isCallLoading,isSummaryLoading,summary, fetchCallDataById, transcriptions,fetchSummaryById,downloadSummaryById };
};
