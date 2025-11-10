// src/app/dashboard/page.tsx
"use client";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Video,
  Users,
  Clock,
  FileText,
  Plus,
  Combine,
  FileVideoCameraIcon,
  CalendarClock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSession } from "@/lib/auth-client";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { RefreshButton } from "@/components/theme/refresh-button";
import { useCallStore } from "@/store/callStore";
import {
  getMeetingDuration,
  formatTime,
  formatDate,
  getTotalMeetingDuration,
} from "@/lib/utils";
import { CollapsibleSidebar } from "@/components/layout/collapse-sidebar";
import { useEffect, useState } from "react";
import { getAllMeeting, startMeeting } from "@/actions/dbAction/meeting";
import { getMeetingRecordings } from "@/actions/dbAction/recording";
import { useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useTheme } from "next-themes";
import { Play } from "lucide-react";
import { toast } from "sonner";
import { redirect } from "next/navigation";
import { getMeetingById } from "@/actions/dbAction/meeting";

export default function DashboardPage() {
  const router = useRouter();
  const {
    upcomingCalls,
    callRecordings,
    setLoading,
    refreshCalls,
    refreshCallRecordings,
    endedCalls,
  } = useCallStore();
  const [totalMeetingTime, setTotalMeetingTime] = useState("0");
  const upcomingMeetings = upcomingCalls.slice(0, 2).map((call) => ({
    id: call.meetingId,
    title: call.title,
    time: formatTime(call.startAt) || "Unknown Time",
    date: formatDate(call.startAt) || "Unknown Date",
  }));
  const recentRecordings = callRecordings
    .slice(0, 4)
    .map((recording, index) => ({
      id: index++,
      title: recording.meetingTitle,
      url: recording.url,
      date: formatTime(recording.start_time) || "Unknown Date",
      duration:
        getMeetingDuration(recording.start_time, recording.end_time) ||
        "Unknown Duration",
    }));

  const quickActions = [
    {
      icon: <Video className="w-5 h-5" />,
      label: "Instant Meeting",
      action: () => router.push("/dashboard/create-meeting"),
    },
    {
      icon: <Combine className="w-5 h-5" />,
      label: "Join Meeting",
      action: () => router.push("/dashboard/join"),
    },
    {
      icon: <Calendar className="w-5 h-5" />,
      label: "Schedule Meeting",
      action: () => router.push("/dashboard/schedule"),
    },
  ];
  const client = useStreamVideoClient();
  const { data: session } = useSession();
  const userId = session?.user.id;
  const { theme } = useTheme();
  useEffect(() => {
    const totalMeetingTime = getTotalMeetingDuration(endedCalls);
    setTotalMeetingTime(totalMeetingTime);
  }, [endedCalls]);
  useEffect(() => {
    const isFetchedOrNot = localStorage.getItem("call-store-storage");
    if (isFetchedOrNot) {
      return;
    }
    const fetchCallsData = async () => {
      if (!client || !userId) return;
      try {
        setLoading(true);
        const data = await getAllMeeting(userId);
        const recordings = await Promise.all(
          data.map((meeting) => getMeetingRecordings(meeting.meetingId))
        );
        refreshCalls(data);
        refreshCallRecordings(recordings.flat());
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCallsData();
  }, []);

  const handleStartMeeting = async ({ meetingId }: { meetingId: string }) => {
    if (meetingId) {
      const meetingData = await getMeetingById(meetingId);
      if (!meetingData) {
        toast.error("Meeting not found");
        redirect("/dashboard");
      }
      const now = new Date();
      if (
        meetingData?.[0]?.startAt &&
        new Date(meetingData?.[0]?.startAt) > now
      ) {
        toast.error(
          `Meeting is not started yet, it will start at ${meetingData?.[0]?.startAt}`
        );
        return;
      }
      const { success, message } = await startMeeting(meetingId);
      if (!success) {
        toast.error(message);
        return;
      }
      router.replace(`/dashboard/meeting/${meetingId}`);
    }
  };
  return (
    <>
      <div
        className={`mx-auto px-4 py-8 min-h-screen ${theme === "light" ? "bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50" : "bg-[#1c1f2e]/80 backdrop-blur-md"}`}
      >
        {/* Header */}

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">
              Welcome back, {session?.user?.name?.split(" ")[0] || "User"}
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Here's what's happening with your meetings
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-4 w-full md:w-auto">
            <CollapsibleSidebar />
            <ThemeToggle />
            <RefreshButton />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {quickActions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              className="glass-card h-24 flex flex-col items-center justify-center gap-2 p-4 cursor-pointer border border-black"
              onClick={action.action}
            >
              {action.icon}
              <span>{action.label}</span>
            </Button>
          ))}
        </div>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList
            className={`flex items-center justify-center space-x-1 rounded-lg p-1  ${
              theme === "light"
                ? "bg-gray-100"
                : "bg-[#1c1f2e]/80 backdrop-blur-md"
            }`}
          >
            <TabsTrigger
              value="overview"
              className={`
      px-4 py-2 rounded-md transition-all
      ${
        theme === "light"
          ? "data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm"
          : "data-[state=active]:bg-primary data-[state=active]:text-white"
      }
      hover:bg-opacity-80
    `}
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="meetings"
              className={`
      px-4 py-2 rounded-md transition-all
      ${
        theme === "light"
          ? "data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm"
          : "data-[state=active]:bg-primary data-[state=active]:text-white"
      }
      hover:bg-opacity-80
    `}
            >
              Meetings
            </TabsTrigger>
            <TabsTrigger
              value="recordings"
              className={`
      px-4 py-2 rounded-md transition-all
      ${
        theme === "light"
          ? "data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm"
          : "data-[state=active]:bg-primary data-[state=active]:text-white"
      }
      hover:bg-opacity-80
    `}
            >
              Recordings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {/* Top Stats Cards */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between ">
              <Card className="w-full md:w-[48%] lg:w-[23.5%] md:h-[50%] lg:h-[30%] glass-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Ended Meetings
                  </CardTitle>
                  <Video className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{endedCalls.length}</div>
                </CardContent>
              </Card>

              <Card className="w-full md:w-[48%] lg:w-[23.5%] glass-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Scheduled Meetings
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {upcomingCalls.length}
                  </div>
                </CardContent>
              </Card>

              <Card className="w-full md:w-[48%] lg:w-[23.5%] glass-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Recorded Meetings
                  </CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {callRecordings.length}
                  </div>
                </CardContent>
              </Card>

              <Card className="w-full md:w-[48%] lg:w-[23.5%] glass-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Meeting Hours
                  </CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalMeetingTime}</div>
                </CardContent>
              </Card>
            </div>

            <div className="flex items-center justify-between gap-7 flex-col md:flex-row">
              <Card className="w-full glass-card">
                <CardHeader>
                  <div>
                    <CardTitle className="text-lg">
                      Recent Upcoming Meetings
                    </CardTitle>
                    <CardDescription>
                      Your scheduled meetings for the next few days
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {upcomingMeetings.slice(0, 1).map((meeting) => (
                      <div
                        key={meeting.id}
                        className="flex items-center p-3 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
                        onClick={() =>
                          handleStartMeeting({ meetingId: meeting.id })
                        }
                      >
                        <div className="flex-shrink-0 h-10 w-10 bg-primary/10 rounded flex items-center justify-center mr-3">
                          <Video className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {meeting.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {meeting.date}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="flex-shrink-0 hover:bg-accent/50 transition-colors cursor-pointer"
                        >
                          Start
                        </Button>
                      </div>
                    ))}
                    <div className="space-y-2 ">
                      <Button
                        variant="outline"
                        size="icon"
                        className="w-full mt-2 glass-card cursor-pointer"
                        onClick={() => router.push("/dashboard/upcoming")}
                      >
                        <CalendarClock className="h-4 w-4 mr-2" />
                        View All Upcoming
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="w-full glass-card">
                <CardHeader>
                  <div>
                    <CardTitle className="text-lg">Recent Recordings</CardTitle>
                    <CardDescription>
                      Your most recent meeting recordings
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentRecordings.slice(0, 1).map((recording) => (
                      <div
                        key={recording.id}
                        className="flex items-center p-3 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
                        onClick={() => window.open(recording.url, "_blank")}
                      >
                        <div className="flex-shrink-0 h-10 w-10 bg-primary/10 rounded flex items-center justify-center mr-3">
                          <Video className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {recording.title}
                          </p>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <span>{recording.date}</span>
                            <span className="mx-2">•</span>
                            <span>{recording.duration}</span>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="flex-shrink-0"
                        >
                          <Play className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      className="w-full mt-2 glass-card cursor-pointer"
                      onClick={() => router.push("/dashboard/recordings")}
                    >
                      <Video className="h-4 w-4 mr-2" />
                      View All Recordings
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="meetings" className="space-y-4">
            {/* Meetings content */}
            <Card className="glass-card w-full">
              <CardHeader>
                <CardTitle>Your Meetings</CardTitle>
                <CardDescription>
                  View and manage all your scheduled meetings
                </CardDescription>
              </CardHeader>
              {upcomingMeetings.length > 0 ? (
                <CardContent>
                  <div className="space-y-4">
                    {upcomingMeetings.slice(0, 4).map((meeting) => (
                      <div
                        key={meeting.id}
                        className="flex items-center p-4 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
                        onClick={() =>
                          handleStartMeeting({ meetingId: meeting.id })
                        }
                      >
                        <div className="flex-shrink-0 h-12 w-12 bg-primary/10 rounded flex items-center justify-center mr-4">
                          <Video className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {meeting.title}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {meeting.time} • {meeting.date}
                          </p>
                        </div>
                        <Button variant="ghost" size="sm" className="ml-2">
                          Start
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="ghost"
                      className="w-full mt-2 glass-card cursor-pointer"
                      onClick={() => router.replace("dashboard/schedule")}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Schedule New Meeting
                    </Button>
                  </div>
                </CardContent>
              ) : (
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <Video className="h-12 w-12 mx-auto mb-2" />
                    <p>No upcoming meetings scheduled</p>
                  </div>
                </CardContent>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="recordings" className="space-y-4 ">
            <Card className="glass-card w-full">
              <CardHeader>
                <CardTitle>Your Recordings</CardTitle>
                <CardDescription>
                  Access and manage your meeting recordings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 ">
                  {recentRecordings.length <= 0 ? (
                    <p className="text-sm">Recordings Available</p>
                  ) : (
                    <>
                      {recentRecordings.map((recording) => (
                        <div
                          key={recording.title}
                          className="flex items-center p-4 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
                          onClick={() => window.open(recording.url, "_blank")}
                        >
                          <div className="flex-shrink-0 h-10 w-10 bg-primary/10 rounded flex items-center justify-center mr-3">
                            <Video className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0 overflow-hidden flex items-center justify-between">
                            <div className="flex items-center text-xs text-muted-foreground">
                              <span>{recording.date}</span>
                              <span className="mx-2">•</span>
                              <span>{recording.duration}</span>
                            </div>
                            <p className="text-sm font-medium truncate">
                              {recording.title}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="flex-shrink-0"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polygon points="5 3 19 12 5 21 5 3" />
                            </svg>
                          </Button>
                        </div>
                      ))}
                      <Button
                        variant="ghost"
                        className="w-full mt-2 text-sm glass-card cursor-pointer"
                        onClick={() => router.push("/dashboard/recordings")}
                      >
                        <FileVideoCameraIcon className="h-4 w-4 mr-2" />
                        View All Recordings
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
