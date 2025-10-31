'use server'
import {db} from '@/lib/db'
import {linkedinToken} from '@/lib/db/schema'
import {eq} from 'drizzle-orm'
export const validateLinkedInToken = async (userId: string) => {
    const token = await db.select().from(linkedinToken).where(eq(linkedinToken.userId,userId))
    if(token.length === 0){
        return {
            success:false,
        }
    }
    const tokenData = token[0]
    const expiresAt = new Date(tokenData.expiresIn)
    if(expiresAt < new Date()){
        return {
            success:false,
        }
    }
    return {
        success:true,
    }
}