'use client'
import { signOut } from "@/lib/auth-client";
import { LogOut } from "lucide-react";
import { redirect } from "next/navigation";
export default function Logout() {
    const handleSignOut=async()=>{
        await signOut();
        redirect("/auth");
    }
    return (
        <button onClick={handleSignOut} className="cursor-pointer flex items-center gap-2">
            <LogOut/>
            Logout!
        </button>
    )
}