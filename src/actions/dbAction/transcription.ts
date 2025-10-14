'use server'
import { meetingTranscription } from "@/lib/db/schema";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
export const createMeetingTranscription = async (meetingId: string, url: string, sessionId: string, start_time: Date, end_time: Date) => {
  try {
    await db.insert(meetingTranscription).values({
      meetingId,
      url,
      sessionId,
      start_time,
      end_time,
    });
    return {
      success: true,
      message: "Transcription created successfully",
    };
  } catch (error) {
    console.error("Error creating meeting transcription:", error);
    return {
      success: false,
      message: "Failed to create meeting transcription",
    };
  }
};

export const getTranscriptions = async (meetingId: string) => {
  try {
    const data=db.select().from(meetingTranscription).where(eq(meetingTranscription.meetingId,meetingId))
    return data;
  } catch (error) {
    console.error("Error fetching meeting transcriptions:", error);
    return [];
  }
};