'use server'
import { db } from "@/lib/db";
import {linkedinToken } from "@/lib/db/schema";
import {auth} from '@/lib/auth'
import {headers} from 'next/headers';
import { eq } from "drizzle-orm";
import {validateLinkedInToken} from './validate'
export const addLinkedInToken = async ({linkedinUserId,accessToken,expiresIn}: {linkedinUserId: string, accessToken: string, expiresIn: string}) => {
    try {
        const session=await auth.api.getSession({
            headers:await headers()
        })
        if(!session?.user){
            return {
                success:false,
                message:"User not authenticated"
            }
        }
        await db.insert(linkedinToken).values({
            userId: session.user.id,
            linkedinUserId: linkedinUserId,
            accessToken: accessToken,
            expiresIn: expiresIn,
            createdAt: new Date(),
        })
        return {
            success: true,
            message: "LinkedIn token added successfully",
        }
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: "Failed to add LinkedIn token",
        }
    }
}

export const isLinkedInConnected = async () => {
    const session=await auth.api.getSession({
        headers:await headers()
    })
    if(!session?.user){
        return {
            success:false,
            message:"User not authenticated"
        }
    }
    const {success}=await validateLinkedInToken(session.user.id)
    if(!success){
        return {
            success:false,
            message:"ReLogin to LinkedIn Please !!!"
        }
    }
    return {
        success:true,
        message:"LinkedIn connected"
    }
}

export const removeLinkedInToken = async () => {
    const session=await auth.api.getSession({
        headers:await headers()
    })
    if(!session?.user){
        return {
            success:false,
            message:"User not authenticated"
        }
    }
    await db.delete(linkedinToken).where(eq(linkedinToken.userId, session.user.id))
    return {
        success:true,
        message:"LinkedIn token removed successfully"
    }
}