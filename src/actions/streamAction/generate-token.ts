// src/actions/generate-token.ts
'use server'
import { StreamClient } from "@stream-io/node-sdk";
import { auth} from "@/lib/auth";
import { headers } from "next/headers";         

export const generateToken = async () => {
    const session=await auth.api.getSession({
        headers:await headers()
    })
    const user=session?.user;
  
    if (!user) {
        throw new Error("Unauthorized: User is not authenticated");
    }

    const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
    const apiSecret = process.env.STREAM_SECRET_KEY;

    if (!apiKey || !apiSecret) {
        throw new Error("Stream API key or secret is missing");
    }

  const serverClient = new StreamClient(apiKey, apiSecret);
  const vailidity = 60 * 60;
  const token = serverClient.generateUserToken({ user_id: user.id, validity_in_seconds: vailidity });
  
  return token;
}