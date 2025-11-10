"use client";

import { useCall } from "@stream-io/video-react-sdk";
import { Button } from "../ui/button";
import { toast } from "sonner";

export const EndCallButton = ({ setIsEndingMeeting }: any) => {
  const call = useCall();

  const endCallForEveryone = async () => {
    try {
      if (!call) return;

      await Promise.allSettled([
        call.camera?.disable(),
        call.microphone?.disable(),
      ]);

      setIsEndingMeeting(true);

      await call.endCall();
      toast.success("Meeting ended — processing data...");
    } catch (error) {
      console.error("Failed to end the call", error);
      toast.error("Failed to end the meeting. Please try again.");
      setIsEndingMeeting(false);
    }
  };

  return (
    <Button
      onClick={endCallForEveryone}
      className="bg-red-500 hover:bg-red-600 cursor-pointer rounded-full"
    >
      End call for all
    </Button>
  );
};
