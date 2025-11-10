'use server'
import {validateLinkedInToken} from './validate'
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import {db} from '@/lib/db'
import {linkedinToken} from '@/lib/db/schema'
import {eq} from 'drizzle-orm'

interface ShareMeetingOnLinkedinProps {
    description:string,
    meetingLink:string
}

export const postToLinkedin = async () => {
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
            message:"ReLogin to LinkedIn Please . Go to your Profile."
        }
    }
    const data=await db.select().from(linkedinToken).where(eq(linkedinToken.userId,session.user.id))
    const tokenData=data[0]
    const linkedinUserId = tokenData.linkedinUserId;
    const authorUrn = `urn:li:person:${linkedinUserId}`;

    // 5) build payload for a simple text post using /rest/posts
    const postBody = {
        "author": authorUrn,
        "lifecycleState": "PUBLISHED",
        "specificContent": {
            "com.linkedin.ugc.ShareContent": {
                "shareCommentary": {
                    "text": "Hello World! This is my first Share on LinkedIn!"
                },
                "shareMediaCategory": "NONE"
            }
        },
        "visibility": {
            "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC"
        }
    }

    // // 6) post to LinkedIn
    try {
        const res = await fetch("https://api.linkedin.com/v2/ugcPosts", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${tokenData.accessToken}`,
            "LinkedIn-Version": "202510",
            "X-Restli-Protocol-Version": "2.0.0",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(postBody),
        });

        const respBody = await res.json().catch(() => null);
        if (!res.ok) {
        return { success: false, code: "POST_FAILED", status: res.status, body: respBody };
        }
        return { success: true,message: "LinkedIn post created", post: respBody };
    } catch (error) {
        console.error(error);
        return { success: false, code: "POST_FAILED", status: 500, body: null };
    }
}



export const shareMeetingOnLinkedin = async ({description,meetingLink}:ShareMeetingOnLinkedinProps)=> {
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
            message:"ReLogin to LinkedIn Please . Go to your Profile."
        }
    }
    const data=await db.select().from(linkedinToken).where(eq(linkedinToken.userId,session.user.id))
    const tokenData=data[0]
    const linkedinUserId = tokenData.linkedinUserId;
    const authorUrn = `urn:li:person:${linkedinUserId}`;

    // 5) build payload for a simple text post using /rest/posts
   const postBody = {
  author: authorUrn,
  lifecycleState: "PUBLISHED",
  specificContent: {
    "com.linkedin.ugc.ShareContent": {
      shareCommentary: {
        text: `📅 Meeting Update!\n\n${description}\n\n#Meetings #Networking #BusinessGrowth #ProfessionalDevelopment #LetsConnect`,
      },
      shareMediaCategory: "ARTICLE",
      media: [
        {
          status: "READY",
          description: {
            text: description.substring(0, 200),
          },
          originalUrl: meetingLink,
          title: {
            text: "📅 Meeting Invitation",
          },
        },
      ],
    },
  },
  visibility: {
    "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
  },
};


    // // 6) post to LinkedIn
    try {
        const res = await fetch("https://api.linkedin.com/v2/ugcPosts", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${tokenData.accessToken}`,
            "LinkedIn-Version": "202510",
            "X-Restli-Protocol-Version": "2.0.0",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(postBody),
        });

        const respBody = await res.json().catch(() => null);
        if (!res.ok) {
            console.error(respBody);
        return { success: false, message: "POST_FAILED", status: res.status, body: respBody };
        }
        return { success: true,message: "LinkedIn post created", post: respBody };
    } catch (error) {
        console.error(error);
        return { success: false, message: "POST_FAILED", status: 500, body: null };
    }
}


export const shareThankYouNoteOnLinkedin = async (description:string)=> {
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
            message:"ReLogin to LinkedIn Please . Go to your Profile."
        }
    }
    const data=await db.select().from(linkedinToken).where(eq(linkedinToken.userId,session.user.id))
    const tokenData=data[0]
    const linkedinUserId = tokenData.linkedinUserId;
    const authorUrn = `urn:li:person:${linkedinUserId}`;

    // 5) build payload for a simple text post using /rest/posts
   const postBody = {
        "author": authorUrn,
        "lifecycleState": "PUBLISHED",
        "specificContent": {
            "com.linkedin.ugc.ShareContent": {
                "shareCommentary": {
                    "text":description
                },
                "shareMediaCategory": "NONE"
            }
        },
        "visibility": {
            "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC"
        }
    }


    // // 6) post to LinkedIn
    try {
        const res = await fetch("https://api.linkedin.com/v2/ugcPosts", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${tokenData.accessToken}`,
            "LinkedIn-Version": "202510",
            "X-Restli-Protocol-Version": "2.0.0",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(postBody),
        });

        const respBody = await res.json().catch(() => null);
        if (!res.ok) {
            console.error(respBody);
        return { success: false, message: "POST_FAILED", status: res.status, body: respBody };
        }
        return { success: true,message: "LinkedIn post created", post: respBody };
    } catch (error) {
        console.error(error);
        return { success: false, message: "POST_FAILED", status: 500, body: null };
    }
}

export const shareMeetingOutcomesOnLinkedin = async (description:string,recordingLink:string)=> {
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
            message:"ReLogin to LinkedIn Please . Go to your Profile."
        }
    }
    const data=await db.select().from(linkedinToken).where(eq(linkedinToken.userId,session.user.id))
    const tokenData=data[0]
    const linkedinUserId = tokenData.linkedinUserId;
    const authorUrn = `urn:li:person:${linkedinUserId}`;

    // 5) build payload for a simple text post using /rest/posts
    const postBody = {
        author: authorUrn,
        lifecycleState: "PUBLISHED",
        specificContent: {
            "com.linkedin.ugc.ShareContent": {
            shareCommentary: {
                text: description,
            },
            shareMediaCategory: "ARTICLE",
            media: [
                {
                status: "READY",
                description: {
                    text: description.substring(0, 200),
                },
                originalUrl: recordingLink,
                title: {
                    text: "📅 Recording of Meeting",
                },
                },
            ],
            },
        },
        visibility: {
            "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
        },
    };


    // // 6) post to LinkedIn
    try {
        const res = await fetch("https://api.linkedin.com/v2/ugcPosts", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${tokenData.accessToken}`,
            "LinkedIn-Version": "202510",
            "X-Restli-Protocol-Version": "2.0.0",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(postBody),
        });

        const respBody = await res.json().catch(() => null);
        if (!res.ok) {
            console.error(respBody);
        return { success: false, message: "POST_FAILED", status: res.status, body: respBody };
        }
        return { success: true,message: "LinkedIn post created", post: respBody };
    } catch (error) {
        console.error(error);
        return { success: false, message: "POST_FAILED", status: 500, body: null };
    }
}


