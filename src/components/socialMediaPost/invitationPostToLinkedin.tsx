'use client'
import { useState } from 'react';
import { FiLinkedin, FiLink } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { shareMeetingOnLinkedin } from "@/actions/linkedinPostAction/post";
interface InvitationPostToLinkedinProps {
    meetingId: string;
}
export const InvitationPostToLinkedin = ({meetingId}:InvitationPostToLinkedinProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [description, setDescription] = useState('');
    const meetingLink = `${window.location.origin}/dashboard/meeting/${meetingId}`;

    const handlePostToLinkedin = async () => {
        const {success,message}=await shareMeetingOnLinkedin({description,meetingLink});
        setIsOpen(false);
        if(success){
            toast.success(message);
        }else{
            toast.error(message);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button 
                    variant="outline" 
                    className="flex w-full items-center gap-2"
                >
                    <FiLinkedin className="h-4 w-4" />
                    <span>Share Meeting to LinkedIn</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Share on LinkedIn</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="description">Your Post</Label>
                        <Textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Share your thoughts about this meeting..."
                            className="min-h-[120px]"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Meeting Link</Label>
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <FiLink className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                <Input
                                    value={meetingLink}
                                    disabled
                                    className="pl-9"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex justify-end space-x-2">
                    <Button 
                        variant="outline" 
                        onClick={() => setIsOpen(false)}
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={handlePostToLinkedin}
                        className="bg-blue-600 hover:bg-blue-700"
                    >
                        Share to LinkedIn
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}