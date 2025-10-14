'use server'
import { meetingParticipant,meetingParticipantSessionHistory } from "@/lib/db/schema";
import { db } from "@/lib/db";
import { and, eq, isNull } from "drizzle-orm";

export const createMeetingParticipant = async (meetingId: string, participantId: string,participantName:string,role:string) => {
  try {
    const isParticipantExist=await db.select().from(meetingParticipant).where(
      and(eq(meetingParticipant.participantId,participantId),eq(meetingParticipant.meetingId,meetingId)))
    if(isParticipantExist.length>0){
      return {
        success: false,
        message: "Participant already exists",
      }
    }
    await db.insert(meetingParticipant).values({
      meetingId,
      participantId,
      participantName,
      role
    })
    return {
      success: true,
      message: "Participant created successfully",
    }
  } catch (error) {
    console.error("Error creating meeting participant:", error);
    return {
      success: false,
      message: "Failed to create meeting participant",
    }
  }
};

export const createMeetingParticipantSessionHistory = async (meetingId: string, participantId: string,sessionId:string) => {
  try {
    const existing = await db
    .select()
    .from(meetingParticipantSessionHistory)
    .where(
        and(
        eq(meetingParticipantSessionHistory.participantId, participantId),
        eq(meetingParticipantSessionHistory.sessionId, sessionId),
        isNull(meetingParticipantSessionHistory.joinedAt)
        )
    );
    if(existing.length>0){
      return {
        success: false,
        message: "Participant session history already exists",
      }
    }
    await db.insert(meetingParticipantSessionHistory).values({
      meetingId,
      participantId,
      sessionId,
      joinedAt: new Date(),
    })
    return {
      success: true,
      message: "Participant session history created successfully",
    }
  } catch (error) {
    console.error("Error creating meeting participant session history:", error);
    return {
      success: false,
      message: "Failed to create meeting participant session history",
    }
  }
};

export const updateMeetingParticipantSessionHistory = async (meetingId: string, participantId: string,sessionId:string) => {
  try {
    await db.update(meetingParticipantSessionHistory).set({
      leftAt: new Date(),
    }).where(eq(meetingParticipantSessionHistory.participantId,participantId) && eq(meetingParticipantSessionHistory.sessionId,sessionId))
    return {
      success: true,
      message: "Participant session history updated successfully",
    }
  } catch (error) {
    console.error("Error updating meeting participant session history:", error);
    return {
      success: false,
      message: "Failed to update meeting participant session history",
    }
  }
};



export const getMeetingParticipants=async(meetingId:string)=>{
  try {
    const participants=await db.select().from(meetingParticipant).where(eq(meetingParticipant.meetingId,meetingId))
    return participants
  } catch (error) {
    console.error("Error getting meeting participants:", error);
    return []
  }
}
