import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { LayoutList, Users, ChartBarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { EndCallButton } from "./endCallButton";
import {
  RecordCallButton,
  ReactionsButton,
  ScreenShareButton,
  CancelCallButton,
  ToggleAudioPublishingButton,
  ToggleVideoPublishingButton,
} from "@stream-io/video-react-sdk";

export const MeetingControls = ({
  setLayout,
  showControls,
  onInteraction,
  onToggleParticipants,
  onToggleChat,
  isOwner,
  router,
  setIsEndingMeeting,
  showChat,
  showParticipants,
}: any) => (
  <div
    className={cn(
      "fixed bottom-4 left-1/2 -translate-x-1/2 z-50",
      "flex items-center justify-center flex-wrap gap-3 p-4 rounded-xl min-w-[370px] ",
      "border border-white/10 shadow-lg backdrop-blur-md transition-all duration-300",
      showControls
        ? "opacity-100 translate-y-0"
        : "opacity-0 translate-y-4 pointer-events-none",
      "bg-[#1c1f2e]/80"
    )}
    onMouseEnter={() => onInteraction(true)}
    onMouseLeave={() => onInteraction(false)}
  >
    <ToggleAudioPublishingButton />
    <ToggleVideoPublishingButton />
    <ReactionsButton />
    <ScreenShareButton />
    {isOwner && <RecordCallButton />}
    <CancelCallButton onLeave={() => router.replace("/dashboard")} />
    <DropdownMenu>
      <DropdownMenuTrigger className="rounded-full bg-[#19232d] p-2 hover:bg-[#4c535b]">
        <LayoutList size={20} className="text-white" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-white dark:bg-[#1e1e2d] border-gray-200 dark:border-gray-700">
        {["grid", "speaker-left", "speaker-right"].map((item) => (
          <DropdownMenuItem
            key={item}
            onClick={() => setLayout(item)}
            className="text-gray-900 dark:text-gray-200"
          >
            {item.replace("-", " ").toUpperCase()}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>

    <Button
      onClick={onToggleParticipants}
      variant="default"
      size="icon"
      className={`rounded-full bg-[#19232d] hover:bg-[#4c535b] h-10 w-10 ${showParticipants ? "bg-[#4c535b]" : ""}`}
    >
      <Users size={20} className="text-white" />
    </Button>

    <Button
      onClick={onToggleChat}
      variant="default"
      size="icon"
      className={`rounded-full bg-[#19232d] hover:bg-[#4c535b] h-10 w-10 ${showChat ? "bg-[#4c535b]" : ""}`}
    >
      <ChartBarIcon size={20} className="text-white" />
    </Button>

    {isOwner && <EndCallButton setIsEndingMeeting={setIsEndingMeeting} />}
  </div>
);
