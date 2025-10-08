import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useState } from "react";

export const useGetCallById = () => {
  const [call, setCall] = useState<Call>();
  const [transcriptions, setTranscriptions] = useState<Object[]>([]);
  const [isCallLoading, setIsCallLoading] = useState(false);
  const [isTranscriptionRequired, setIsTranscriptionRequired] = useState(false);
  const [partcipants,setPartcipants] = useState<Object[]>([]);
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
        if(fetchedCall?.state?.members){
          const { members } = await fetchedCall.queryMembers();
          setPartcipants(members);
          
        }
        if(isTranscriptionRequired){
          const data = await fetchedCall.queryTranscriptions();
        
          if (data?.transcriptions?.length) {
            const allLines = await Promise.all(
              data.transcriptions.map(async (t) => fetchTranscriptionFile(t.url))
            );
            const flatTranscriptions = allLines.flat();
            setTranscriptions(flatTranscriptions);
          }
          setIsTranscriptionRequired(false);
        }
      }
    } catch (err) {
      console.error("Error fetching call or transcriptions:", err);
    } finally {
      setIsCallLoading(false);
    }
  };

  return { call, isCallLoading, fetchCallById, transcriptions, setIsTranscriptionRequired };
};
