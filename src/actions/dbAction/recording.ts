'use server'
import { meetingRecording } from "@/lib/db/schema";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
export const createMeetingRecording = async (meetingId: string, url: string, sessionId: string, start_time: Date, end_time: Date) => {
  try {
    await db.insert(meetingRecording).values({
      meetingId,
      url,
      sessionId,
      start_time,
      end_time,
    });
    return {
      success: true,
      message: "Recording created successfully",
    };
  } catch (error) {
    console.error("Error creating meeting recording:", error);
    return {
      success: false,
      message: "Failed to create meeting recording",
    };
  }
};

export const getMeetingRecordings=async(meetingId:string)=>{
  try {
    const data=db.select().from(meetingRecording).where(eq(meetingRecording.meetingId,meetingId))
    return data
  } catch (error) {
    console.error("Error getting meeting recordings:", error);
    return []
  }
}