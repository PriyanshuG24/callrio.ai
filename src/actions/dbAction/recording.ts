'use server'
import { meetingRecording } from "@/lib/db/schema";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
export const createMeetingRecording = async (meetingId: string,meetingTitle:string, url: string, sessionId: string, start_time: Date, end_time: Date) => {
  try {
    const data=await db.insert(meetingRecording).values({
      meetingId,
      meetingTitle,
      url,
      sessionId,
      start_time,
      end_time,
    }).returning();
    return {
      success: true,
      message: "Recording created successfully",
      data:data[0],
    };
  } catch (error) {
    console.error("Error creating meeting recording:", error);
    return {
      success: false,
      message: "Failed to create meeting recording",
      data:null
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

// export const updateMeetingRecordingName=async(recordingId:string,name:string)=>{
//   try {
//     const data=await db.update(meetingRecording).set({name}).where(eq(meetingRecording.id,recordingId)).returning();
//     return data
//   } catch (error) {
//     console.error("Error updating meeting recording name:", error);
//     return null
//   }
// }