'use client';

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, LogOut, Mail } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import Link from "next/link";
import { LogoutButton } from "@/components/auth/logout";
import { LayoutDashboardIcon } from "lucide-react";
import { LinkedInPost } from "@/components/socialMediaPost/connectToLinkedin";
import { useRouter } from "next/navigation";
import { removeLinkedInToken } from "@/actions/linkedinPostAction/auth";
import { signOut } from "@/lib/auth-client";

export default function ProfilePage() {

  const { data: session, isPending } = useSession();
    const router = useRouter();
    if (isPending) {
      return null;
    }
    const handleLogout = async () => {
      localStorage.removeItem('call-store-storage');
      sessionStorage.removeItem('meeting-session-cache');
      await removeLinkedInToken();
      const {data}=await signOut();
      if(data?.success){
        router.push(`${process.env.NEXT_PUBLIC_BASE_URL}/login`);
      }
    };

    const initials = session?.user?.name
    ?.split(' ')
    .map(name => name[0])
    .join('')
    .toUpperCase() || 'U';

  return (
    <main className="h-full glass-card px-4 py-12 px-6 md:px-8 md:py-16 sm:py-8 sm:px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">Your Profile</h1>
          </div>
          <div className="flex items-center justify-between gap-2">
            <div>
              <Button variant="outline" className="cursor-pointer flex items-center gap-2 hover:bg-gray-500 dark:hover:bg-gray-800">
              <Link href="/dashboard" className="flex items-center gap-2">
                <LayoutDashboardIcon className="h-4 w-4" />
               Dashboard
              </Link>
            </Button>
            </div>
            <div>
          <LinkedInPost/>
          </div>
          </div>
        </div>

        <div className="grid gap-6 ">
          <Card className="overflow-hidden glass-card">
            <div className="h-24 relative animated-gradient">
              <div className="absolute -bottom-12 left-6">
                <Avatar className="h-24 w-24 border-4 border-white dark:border-gray-900">
                  <AvatarImage src={session?.user?.image || ''} alt={session?.user?.name || 'User'} />
                  <AvatarFallback className="text-2xl font-semibold text-white animated-gradient-avatar">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
            <div className="pt-16 px-6 pb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{session?.user?.name}</h2>
                  <div className="flex items-center text-muted-foreground mt-1">
                    <Mail className="h-4 w-4 mr-2" />
                    <span>{session?.user?.email}</span>
                  </div>
                  <div className="flex items-center text-muted-foreground mt-1">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>Member since {new Date(session?.user?.createdAt || new Date()).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</span>
                  </div>
                </div>
                <div >
                  <Button variant="outline" className="cursor-pointer flex items-center gap-2 hover:bg-gray-500 dark:hover:bg-gray-800 hover:text-red-500" onClick={handleLogout}>
                    <LogOut className="h-4 w-4" />
                   Logout
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}
