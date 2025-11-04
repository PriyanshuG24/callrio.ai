"use client";
import React from "react";
import {
  DeviceSettings,
  useCall,
  VideoPreview,
} from "@stream-io/video-react-sdk";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { startMeeting } from "@/actions/dbAction/meeting";
interface MeetingSetupProps {
  setIsSetupComplete: (value: boolean) => void;
}
const MeetingSetup = ({ setIsSetupComplete }: MeetingSetupProps) => {
  const [isMicCamtoggledOn, setIsMicCamtoggledOn] = useState(false);
  const call = useCall();
  if (!call) {
    throw new Error("useCall must ne in used within streamcall component");
  }
  useEffect(() => {
    if (isMicCamtoggledOn) {
      call?.camera.disable();
      call?.microphone.disable();
    } else {
      call?.camera.enable();
      call?.microphone.enable();
    }
  }, [isMicCamtoggledOn, call?.camera, call?.microphone]);
  const onJoinCall = async () => {
    call.join();
    setIsSetupComplete(true);
    await startMeeting(call?.id);
  };
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center">
      <h1 className="text-2xl font-bold">Meeting Setup</h1>
      <VideoPreview />
      <div className="flex h-16 items-center justify-center gap-3">
        <label className="flex justify-center gap-2">
          <input
            type="checkbox"
            checked={isMicCamtoggledOn}
            onChange={(e) => setIsMicCamtoggledOn(e.target.checked)}
            className="h-4 w-4"
          />
          <span>Toggle Mic and Cam</span>
        </label>
        <DeviceSettings />
      </div>
      <Button className="rounded-full bg-green-500" onClick={onJoinCall}>
        Join Meeting
      </Button>
    </div>
  );
};

export default MeetingSetup;
