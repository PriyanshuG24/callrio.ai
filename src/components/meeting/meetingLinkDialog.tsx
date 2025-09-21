// src/components/meeting/MeetingLinkDialog.tsx
'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Check, Copy } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface MeetingLinkDialogProps {
  isOpen: boolean;
  onClose: () => void;
  meetingLink: string;
}

export function MeetingLinkDialog({ isOpen, onClose, meetingLink }: MeetingLinkDialogProps) {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(meetingLink);
    setIsCopied(true);
    toast.success('Meeting link copied to clipboard');
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Meeting Scheduled Successfully!</DialogTitle>
          <DialogDescription>
            Share this link with your participants to join the meeting.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="meetingLink" className="text-right">
              Meeting Link
            </Label>
            <div className="col-span-3 flex gap-2">
              <Input
                id="meetingLink"
                value={meetingLink}
                readOnly
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={copyToClipboard}
              >
                {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button onClick={onClose}>Done</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}