"use client";

import { useState } from "react";
import {
  FiLinkedin,
  FiUsers,
  FiCheckCircle,
  FiVideo,
  FiMessageSquare,
} from "react-icons/fi";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { useTheme } from "next-themes";
import {
  thankyouGeneratedMessage,
  keyPointsGeneratedMessage,
} from "@/lib/utils";
import {
  shareMeetingOutcomesOnLinkedin,
  shareThankYouNoteOnLinkedin,
} from "@/actions/linkedinPostAction/post";
import { cn } from "@/lib/utils";
export const PostToLinkedin = ({
  meetingLink,
  transcriptions,
}: {
  meetingLink: string;
  transcriptions?: any[];
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [postType, setPostType] = useState("thanks");
  const [content, setContent] = useState(
    `🙏 A big thank you to everyone who joined our meeting today! It was a great discussion and I appreciate everyone's valuable input.\n\n#Hastage1 #Hastage2 #Hastage3 ...\n\n For more specific post message give input in input box`
  );
  const [command, setCommand] = useState("");
  const { theme } = useTheme();
  const postTemplates = {
    thanks: {
      title: " Your Post Looks Like This",
      placeholder:
        "Thank everyone who joined the meeting and share your appreciation...",
      defaultText: `🙏 A big thank you to everyone who joined our meeting today! It was a great discussion and I appreciate everyone's valuable input.\n\n#Hastage1 #Hastage2 #Hastage3 ...\n\n For more specific post message give input in input box`,
    },
    outcomes: {
      title: " Your Post Looks Like This",
      placeholder:
        "Share the key outcomes and action items from the meeting...",
      defaultText: `📊 Meeting Outcomes:\n\n• Key discussion points\n• Decisions made\n• Action items\n• Next steps \n\n Your Recording link showing here if present \n\n#Hastage1 #Hastage2 #Hastage3 ... \n\n For more specific post message give input in input box`,
    },
    recording: {
      title: " Your Post Looks Like This",
      placeholder: "Share the meeting recording and highlight key moments...",
      defaultText: `🎥 Meeting Recording Available!\n\nFor those who couldn't join or want to revisit the discussion, here's the recording of our meeting.\n\n🔗 Watch here:${meetingLink}\n\n#MeetingRecording #KnowledgeSharing #StayUpdated`,
    },
  };

  const handlePostToLinkedin = async () => {
    if (!content.trim()) {
      toast.error("Please add some content before posting");
      return;
    }
    if (postType === "thanks") {
      const { success, message } = await shareThankYouNoteOnLinkedin(content);
      if (success) {
        toast.success("Posted to LinkedIn successfully!");
        setIsOpen(false);
      } else {
        toast.error(message || "Failed to post to LinkedIn");
      }
    }
    if (postType === "outcomes") {
      const { success, message } = await shareMeetingOutcomesOnLinkedin(
        content,
        meetingLink
      );
      if (success) {
        toast.success("Posted to LinkedIn successfully!");
        setIsOpen(false);
      } else {
        toast.error(message || "Failed to post to LinkedIn");
      }
    }
    if (postType === "recording") {
      const { success, message } = await shareThankYouNoteOnLinkedin(content);
      if (success) {
        toast.success("Posted to LinkedIn successfully!");
        setIsOpen(false);
      } else {
        toast.error(message || "Failed to post to LinkedIn");
      }
    }
  };

  const handleTemplateSelect = (type: string) => {
    setPostType(type);
    setContent(postTemplates[type as keyof typeof postTemplates].defaultText);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <FiLinkedin className="h-4 w-4" />
          <span>Post to LinkedIn</span>
        </Button>
      </DialogTrigger>
      <DialogContent
        className={cn(
          theme === "light"
            ? "bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50"
            : "bg-[#1c1f2e]/80 backdrop-blur-md"
        )}
      >
        <DialogHeader>
          <DialogTitle>Share on LinkedIn</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Post Type</Label>
            <RadioGroup
              value={postType}
              onValueChange={handleTemplateSelect}
              className="grid grid-cols-3 gap-4"
            >
              <div className="flex items-center space-x-2 ">
                <RadioGroupItem
                  value="thanks"
                  id="thanks"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="thanks"
                  className={`flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer w-full ${theme === "light" ? "bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50" : "bg-[#1c1f2e]/80 backdrop-blur-md"}`}
                >
                  <FiUsers className="mb-2 h-6 w-6" />
                  <span className="text-sm">Thank You</span>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="outcomes"
                  id="outcomes"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="outcomes"
                  className={`flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer w-full ${theme === "light" ? "bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50" : "bg-[#1c1f2e]/80 backdrop-blur-md"}`}
                >
                  <FiCheckCircle className="mb-2 h-6 w-6" />
                  <span className="text-sm">Key Outcomes</span>
                </Label>
              </div>
              {meetingLink.length > 0 && (
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="recording"
                    id="recording"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="recording"
                    className={` flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer w-full ${theme === "light" ? "bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50" : "bg-[#1c1f2e]/80 backdrop-blur-md"}`}
                  >
                    <FiVideo className="mb-2 h-6 w-6" />
                    <span className="text-sm">Recording</span>
                  </Label>
                </div>
              )}
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="post-content">
              {postTemplates[postType as keyof typeof postTemplates].title}
            </Label>
            <Textarea
              id="post-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={
                postTemplates[postType as keyof typeof postTemplates]
                  .placeholder
              }
              rows={5}
              className="min-h-[75px] max-h-[300px] sm:min-w-[400px] sm:max-w-[480px] max-w-[300px] min-w-[200px] overflow-y-auto"
            />

            {(postType === "thanks" || postType === "outcomes") && (
              <>
                <Label htmlFor="post-content">InputBox</Label>
                <Input
                  id="post-content"
                  value={command}
                  onChange={(e) => setCommand(e.target.value)}
                  placeholder={
                    postTemplates[postType as keyof typeof postTemplates]
                      .placeholder
                  }
                />
              </>
            )}
            <div className="flex gap-2 mt-2">
              {postType === "thanks" && (
                <Button
                  variant="secondary"
                  onClick={async () => {
                    setIsGenerating(true);
                    const generated = await thankyouGeneratedMessage(command);
                    setContent(generated);
                    toast.success("Post generated ✅");
                    setCommand("");
                    setIsGenerating(false);
                  }}
                >
                  {isGenerating ? "Generating..." : "✨ Generate Message"}
                </Button>
              )}

              {postType === "outcomes" && (
                <Button
                  variant="secondary"
                  onClick={async () => {
                    setIsGenerating(true);
                    const generated = await keyPointsGeneratedMessage(
                      command,
                      transcriptions,
                      meetingLink
                    );
                    setContent(generated);
                    toast.success("Key points generated ✅");
                    setCommand("");
                    setIsGenerating(false);
                  }}
                >
                  {isGenerating ? "Generating..." : "✨ Generate Key Points"}
                </Button>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handlePostToLinkedin}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <FiMessageSquare className="mr-2 h-4 w-4" />
              Post to LinkedIn
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
