'use server'
import { meeting } from "@/lib/db/schema";
import { db } from "@/lib/db";
import { eq, and } from "drizzle-orm";

export const createMeetingCall = async ({meetingId,title, ownerId}: {meetingId: string;title: string; ownerId: string}) => {
  try {
    console.log("Meeting Id",meetingId);
    console.log("Meeting title",title);
    console.log("Meeting owner Id",ownerId);
    await db.insert(meeting).values({
      meetingId: meetingId,
      title: title || "Meeting",
      ownerId: ownerId,
      createdAt: new Date(),
      isStarted: false,
      isEnded: false,
    })
    return {
      success: true,
      message: "Meeting created successfully",
    }
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Failed to create meeting",
    }
  }
}

export const startMeeting = async (meetingId: string) => {
    try {
      await db
        .update(meeting)
        .set({
          isStarted: true,
          startAt: new Date(),
        })
        .where(and(eq(meeting.meetingId, meetingId),eq(meeting.isStarted, false)));
  
      return { success: true, message: "Meeting started!" };
    } catch (error) {
      console.error(error);
      return { success: false, message: "Failed to start meeting" };
    }
  };

export const endMeeting = async (meetingId: string) => {
  try {
    await db
      .update(meeting)
      .set({
        isEnded: true,
        endedAt: new Date(),
      })
      .where(eq(meeting.meetingId, meetingId) && eq(meeting.isEnded, false));

    return { success: true, message: "Meeting ended!" };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to end meeting" };
  }
};


export const getAllMeeting=async()=>{
  try {
    const data=db.select().from(meeting).where(eq(meeting.isEnded, true))
    return data
  } catch (error) {
    console.error("Error getting all meetings:", error);
    return []
  }
}






  
  
