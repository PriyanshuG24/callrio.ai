// src/app/dashboard/schedule/page.tsx
'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useMeetingState } from '@/hooks/useMeetingState';
import { useState } from 'react';
import DatePicker from 'react-datepicker';
import { toast } from 'sonner';
import {MeetingLinkDialog} from '@/components/meeting/meetingLinkDialog';

export default function SchedulePage() {
  const { 
    values,  
    setValues,
    user, 
    createMeeting
    
  } = useMeetingState();
  const [showDialog, setShowDialog] = useState(false);
  const [meetingLink, setMeetingLink] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const handleCreateMeeting = async() => {
    try {
      setIsLoading(true);
      const newMeeting = await createMeeting(false,values.dateTime as Date);
      if (!newMeeting?.id) {
        throw new Error("Meeting ID not returned");
      }
      const link = `${window.location.origin}/dashboard/meeting/${newMeeting.id}`;
      setMeetingLink(link);
      setShowDialog(true);
    } catch (error) {
      console.error('Error creating meeting:', error);
      toast.error('Failed to create meeting. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl py-8 px-4">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Schedule a Meeting</h1>
          <p className="text-muted-foreground mt-2">
            Set up a new meeting with date, time, and details.
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <Label htmlFor="description" className='mx-1'>Meeting Title</Label>
            <Input
              id="description"
              placeholder="Team standup, Client call, etc."
              value={values.description}
              onChange={(e) => 
                setValues({...values, description: e.target.value})
              }
              className="mt-2"
              required
            />
          </div>

          <div>
            <Label htmlFor="dateTime" className='mx-1'>Date & Time</Label>
            <div className="mt-2">
              <DatePicker
                selected={values.dateTime}
                onChange={(date) => 
                  setValues({...values, dateTime: date || new Date()})
                }
                showTimeSelect
                timeIntervals={15}
                minDate={new Date()}
                timeFormat="HH:mm"
                timeCaption="Time"
                dateFormat="MMMM d, yyyy HH:mm"
                className="w-full h-10 rounded-md border bg-background px-2 py-1 text-sm ring-offset-background"
                wrapperClassName='w-full'
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => window.history.back()}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleCreateMeeting}
              disabled={isLoading || !values.dateTime || !user}
              className="w-full sm:w-auto"
            >
              {isLoading ? 'Scheduling...' : 'Schedule Meeting'}
            </Button>
          </div>
        </div>
      </div>

      <MeetingLinkDialog 
        isOpen={showDialog} 
        onClose={() => setShowDialog(false)} 
        meetingLink={meetingLink} 
      />
    </div>
  );
}