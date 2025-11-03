'use client';

import { useState } from 'react';
import { useMeetingState } from '@/hooks/useMeetingState';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CalendarIcon } from 'lucide-react';

export default function CreateMeetingPage() {
  const { callDetails, user, createMeeting } = useMeetingState();
  const [meetingName, setMeetingName] = useState('');

  const handleCreateMeeting = () => {
    createMeeting(true, new Date(),meetingName);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Create New Meeting</h1>
          <p className="text-muted-foreground mt-2">
            Start an instant meeting with your team
          </p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="meeting-name">Meeting Name</Label>
            <Input
              id="meeting-name"
              placeholder="Team Standup, Client Call, etc."
              value={meetingName}
              onChange={(e) => setMeetingName(e.target.value)}
              className="max-w-md"
            />
          </div>

          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <CalendarIcon className="h-4 w-4" />
            <span>Starts now</span>
          </div>
        </div>

        <Button 
          onClick={handleCreateMeeting} 
          disabled={!user || !meetingName.trim()}
          className="w-full sm:w-auto"
        >
          {callDetails ? 'Meeting Created' : 'Start Meeting'}
        </Button>
      </div>
    </div>
  );
}