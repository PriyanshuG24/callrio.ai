import { NextRequest, NextResponse } from "next/server";
import { addLinkedInToken } from "@/actions/linkedinPostAction/auth";

// const ALGO = "aes-256-cbc";
// const KEY = Buffer.from(process.env.ENCRYPTION_KEY!, "hex");

// function encryptToken(token: string): string {
//   const iv = crypto.randomBytes(16);
//   const cipher = crypto.createCipheriv(ALGO, KEY, iv);
//   const encrypted = Buffer.concat([cipher.update(token, "utf8"), cipher.final()]);
//   return iv.toString("hex") + ":" + encrypted.toString("hex");
// }

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const state = req.nextUrl.searchParams.get("state");

  if (!code) {
    return NextResponse.json({ error: "Missing code" }, { status: 400 });
  }

  // Step 1: Exchange code for access token
  const tokenRes = await fetch("https://www.linkedin.com/oauth/v2/accessToken", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      client_id: process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID!,
      client_secret: process.env.LINKEDIN_CLIENT_SECRET!,
      redirect_uri: "http://localhost:3000/api/linkedin/callback",
    }),
  });

  const tokenData = await tokenRes.json();

  if (!tokenRes.ok) {
    return NextResponse.json({ error: "Failed to get access token", details: tokenData }, { status: 400 });
  }

  const accessToken = tokenData.access_token;

  // Step 2: Fetch LinkedIn user info
  const userRes = await fetch("https://api.linkedin.com/v2/userinfo", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const userInfo = await userRes.json();
  // Step 4: Store in Supabase
  await addLinkedInToken({
    linkedinUserId: userInfo.sub,
    accessToken: accessToken,
    expiresIn: (Date.now()+tokenData.expires_in*1000).toString(),
  });


  // Step 5: Redirect user back to dashboard
  return NextResponse.redirect("http://localhost:3000/dashboard");
}
