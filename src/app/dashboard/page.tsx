// src/app/dashboard/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Video, Users, Clock, FileText, Plus, Combine} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSession } from '@/lib/auth-client';
import { ThemeToggle } from '@/components/theme/theme-toggle';

export default function DashboardPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data
  const upcomingMeetings = [
    { id: 1, title: 'Team Standup', time: '10:00 AM', date: 'Today', participants: 5 },
    { id: 2, title: 'Client Call', time: '2:30 PM', date: 'Tomorrow', participants: 3 },
  ];

  const recentRecordings = [
    { id: 1, title: 'Product Demo', date: '2 hours ago', duration: '45:23' },
    { id: 2, title: 'Team Retrospective', date: '1 day ago', duration: '1:22:10' },
  ];

  const quickActions = [
    { icon: <Video className="w-5 h-5" />, label: 'Instant Meeting', action: () => router.push('/dashboard/create-meeting') },
    { icon: <Combine className="w-5 h-5" />, label: 'Join Meeting', action: () => router.push('/dashboard/join') },
    { icon: <Calendar className="w-5 h-5" />, label: 'Schedule Meeting', action: () => router.push('/dashboard/schedule') },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {session?.user?.name?.split(' ')[0] || 'User'}</h1>
          <p className="text-gray-500 dark:text-gray-400">Here's what's happening with your meetings</p>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <ThemeToggle/>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {quickActions.map((action, index) => (
          <Button
            key={index}
            variant="outline"
            className="h-24 flex flex-col items-center justify-center gap-2 p-4 hover:bg-accent/50 transition-colors"
            onClick={action.action}
          >
            {action.icon}
            <span>{action.label}</span>
          </Button>
        ))}
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="meetings">Meetings</TabsTrigger>
          <TabsTrigger value="recordings">Recordings</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Meetings</CardTitle>
                <Video className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24</div>
                <p className="text-xs text-muted-foreground">+12% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Team Members</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
                <p className="text-xs text-muted-foreground">+2 from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Recordings</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">156</div>
                <p className="text-xs text-muted-foreground">+23 from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Meeting Hours</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">42.5h</div>
                <p className="text-xs text-muted-foreground">+5.2h from last month</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-full lg:col-span-4">
              <CardHeader>
                <CardTitle>Upcoming Meetings</CardTitle>
                <CardDescription>Your scheduled meetings for the next few days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingMeetings.map((meeting) => (
                    <div key={meeting.id} className="flex items-center p-4 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer">
                      <div className="flex-shrink-0 h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                        <Video className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{meeting.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {meeting.time} • {meeting.date} • {meeting.participants} participants
                        </p>
                      </div>
                      <Button variant="ghost" size="sm" className="ml-2">
                        Join
                      </Button>
                    </div>
                  ))}
                  <Button variant="ghost" className="w-full mt-2" onClick={() => router.push('/meeting/schedule')}>
                    <Plus className="h-4 w-4 mr-2" />
                    Schedule New Meeting
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-full lg:col-span-3">
                <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                    <div>
                    <CardTitle className="text-lg">Recent Recordings</CardTitle>
                    <CardDescription>Your most recent meeting recordings</CardDescription>
                    </div>
                </div>
                </CardHeader>
                <CardContent className="p-4">
                <div className="space-y-3">
                    {recentRecordings.map((recording) => (
                    <div 
                        key={recording.id} 
                        className="flex items-center p-4 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
                    >
                        <div className="flex-shrink-0 h-10 w-10 bg-primary/10 rounded flex items-center justify-center mr-3">
                        <Video className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0 overflow-hidden">
                        <p className="text-sm font-medium truncate">{recording.title}</p>
                        <div className="flex items-center text-xs text-muted-foreground">
                            <span>{recording.date}</span>
                            <span className="mx-2">•</span>
                            <span>{recording.duration}</span>
                        </div>
                        </div>
                        <Button variant="ghost" size="icon" className="flex-shrink-0">
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
                    className="w-full mt-2 text-sm"
                    onClick={() => router.push('/recordings')}
                    >
                    View All Recordings
                    </Button>
                </div>
                </CardContent>
            </Card>
        </div>
        </TabsContent>

        <TabsContent value="meetings" className="space-y-4">
          {/* Meetings content */}
          <Card>
            <CardHeader>
              <CardTitle>Your Meetings</CardTitle>
              <CardDescription>View and manage all your scheduled meetings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-end mb-4">
                <Button onClick={() => router.push('/meeting/schedule')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Schedule Meeting
                </Button>
              </div>
              {/* Add meetings table/list here */}
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-2" />
                <p>No upcoming meetings scheduled</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recordings" className="space-y-4 ">
          
          <Card>
            <CardHeader>
              <CardTitle>Your Recordings</CardTitle>
              <CardDescription>Access and manage your meeting recordings</CardDescription>
            </CardHeader>
            <CardContent>
             
              <div className="text-center py-8 text-muted-foreground">
                <Video className="h-12 w-12 mx-auto mb-2" />
                <p>No recordings available</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="space-y-4">
          {/* Team content */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Team Members</CardTitle>
                  <CardDescription>Manage your team members and permissions</CardDescription>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Member
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Add team members list here */}
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-2" />
                <p>No team members added yet</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}