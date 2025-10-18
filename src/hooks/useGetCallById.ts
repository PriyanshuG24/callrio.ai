import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useState } from "react";

export const useGetCallById = () => {
  const [call, setCall] = useState<Call>();
  const [isCallLoading, setIsCallLoading] = useState(false);
  const client = useStreamVideoClient();

  const fetchCallById = async (id: string) => {
    if (!client) {
      console.error('Stream client not initialized');
      return;
    }
    setIsCallLoading(true);
    try {
      const { calls } = await client.queryCalls({
        filter_conditions: { 
          id: { $eq: id }
        }
      });
      const fetchedCall = calls[0];
      setCall(fetchedCall);
    } catch (err) {
      console.error("Error fetching call:", err);
    } finally {
      setIsCallLoading(false);
    }
  };
  return { call, isCallLoading, fetchCallById };
};
