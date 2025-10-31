'use client'
import { Button } from "@/components/ui/button";
import {FiLinkedin} from 'react-icons/fi'
import { useState,useEffect } from "react";
import {isLinkedInConnected,removeLinkedInToken} from '@/actions/linkedinPostAction/auth'
export const LinkedInPost = () => {
    //i also want to change the heading like linkedin connected in button and it should be in green color
    const [isConnected, setIsConnected] = useState(false);
    useEffect(() => {
        const checkLinkedInConnected = async () => {
            const {success} = await isLinkedInConnected()
            setIsConnected(success)
        }
        checkLinkedInConnected()
    }, [])
    const handleLogin = () => {
        const clientId = process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID!;
        const redirectUri = "http://localhost:3000/api/linkedin/callback";
        const scope = "openid profile email w_member_social"; // scopes your app uses
        const state = crypto.randomUUID(); // optional: protect against CSRF

        const linkedInAuthUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(
        redirectUri
        )}&scope=${encodeURIComponent(scope)}&state=${state}`;

        window.location.href = linkedInAuthUrl;
    };
    const handleDisconnect = async () => {
        const {success} = await removeLinkedInToken()
        if(success){
            setIsConnected(false)
        }
    }
    return (
        <div>
            <button onClick={isConnected ? handleDisconnect : handleLogin} className={`${isConnected ? "bg-red-500 text-white" : "bg-blue-500 text-white"} flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer text-sm border border-gray-500`} >
                <FiLinkedin className=" h-4 w-4" />
                {isConnected ? "Disconnect LinkedIn" : "Connect to LinkedIn"}
            </button>
        </div>
    )
}