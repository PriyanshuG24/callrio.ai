"use client";
import { Loader2 } from "lucide-react";
import { Progress } from "../ui/progress";
import { useState, useEffect } from "react";

export const ProcessingOverlay = ({
  recordingReady,
  transcriptionReady,
  chatReady,
  isRecordingButtonClicked,
}: {
  recordingReady: boolean;
  transcriptionReady: boolean;
  chatReady?: boolean;
  isRecordingButtonClicked?: boolean;
}) => {
  const [progress, setProgress] = useState(0);
  let allDone = false;
  if (isRecordingButtonClicked) {
    allDone = (recordingReady && transcriptionReady && chatReady) as any;
  } else {
    allDone = (transcriptionReady && chatReady) as any;
  }

  useEffect(() => {
    let totalStepsCount = 0;
    if (isRecordingButtonClicked) {
      totalStepsCount = 3;
    } else {
      totalStepsCount = 2;
    }
    const steps = [
      recordingReady || false,
      transcriptionReady || false,
      chatReady || false,
    ];

    const completedSteps = steps.filter(Boolean).length;
    const totalSteps = totalStepsCount;

    const progressValue = Math.round((completedSteps / totalSteps) * 100);
    setProgress(progressValue);
  }, [recordingReady, transcriptionReady, chatReady]);

  return (
    <div className="fixed inset-0 z-[200] bg-black/90 flex flex-col items-center justify-center text-white backdrop-blur-sm">
      <div className="flex flex-col items-center justify-center gap-2">
        <p className="text-lg font-semibold">{progress}%</p>
        <div className="flex min-w-[80px] max-w-[300px]">
          <Progress value={progress} />
        </div>
      </div>

      <h2 className="text-lg font-semibold">
        {allDone
          ? "All meeting data processed successfully!"
          : "Processing meeting data..."}
      </h2>
      <div className="mt-6 space-y-2 text-sm text-gray-300">
        {isRecordingButtonClicked && (
          <p>
            {recordingReady
              ? "✅ Recording uploaded"
              : "⏳ Uploading recording..."}
          </p>
        )}
        <p>
          {transcriptionReady
            ? "✅ Transcription saved"
            : "⏳ Generating transcription..."}
        </p>
        <p>{chatReady ? "✅ Chat saved" : "⏳ Saving chat history..."}</p>
      </div>

      {!allDone && (
        <p className="mt-8 text-xs text-gray-400">
          Please don’t close this window until everything is ready.
        </p>
      )}
    </div>
  );
};
