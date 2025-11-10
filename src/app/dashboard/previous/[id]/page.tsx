"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getMeetingChat } from "@/actions/streamAction/chat";
import { Avatar } from "stream-chat-react";
import ReactMarkdown from "react-markdown";
import { format } from "date-fns";
import {
  FiClock,
  FiCalendar,
  FiMessageSquare,
  FiFileText,
  FiActivity,
  FiDownload,
  FiStar,
} from "react-icons/fi";
import { getMeetingDuration } from "@/lib/utils";
import { useGetCallDataById } from "@/hooks/useGetCallDataById";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PostToLinkedin } from "@/components/socialMediaPost/postToLinkedin";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
export default function PreviousMeetingPageDetails() {
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState<Object[]>([]);
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { theme } = useTheme();
  const {
    callData,
    isCallLoading,
    fetchCallDataById,
    transcriptions,
    fetchSummaryById,
    isSummaryLoading,
    summary,
    downloadSummaryById,
    meetingRecording,
  } = useGetCallDataById(id);

  useEffect(() => {
    if (!id) return;

    if (!callData) fetchCallDataById();
  }, [id]);

  useEffect(() => {
    if (!id || !callData) return;
    const loadData = async () => {
      const chat = await getMeetingChat(id);
      setMessages(chat);
    };
    loadData();
  }, [id, callData]);

  if (isCallLoading || !callData) {
    return (
      <div className="flex h-screen items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  const formatDate = (date: Date | undefined) =>
    date ? format(new Date(date), "MMM d, yyyy h:mm a") : "N/A";

  const generateSummary = async () => {
    const [duration, unit] = getMeetingDuration(
      callData.startAt,
      callData.endedAt
    ).split(" ");
    const durationInNumber = Number(duration);
    if (unit === "sec") {
      toast.warning(
        "Meeting duration is less than 1 min.Therefore, summary cannot be generated."
      );
      return;
    } else if (unit === "min" && durationInNumber < 10) {
      toast.warning(
        `Meeting duration is less than ${durationInNumber} min.Therefore, summary cannot be generated.`
      );
      return;
    }
    try {
      await fetchSummaryById();
    } catch (err) {
      console.error("Error fetching summary:", err);
    }
  };
  const toggleChat = () => {
    setShowChat(!showChat);
  };
  return (
    <div
      className={`min-h-screen ${theme === "light" ? "bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50" : ""} p-4 md:p-8`}
    >
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Back Button */}
        <div className="flex justify-end">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>
        {/* Header Section */}
        <div className="glass-card p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                {callData.title ?? "Meeting Details"}
              </h1>
            </div>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-2 text-sm bg-white/5 px-4 py-2 rounded-lg">
                <FiCalendar className="text-blue-400" />
                <span>{formatDate(callData.startAt)}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm bg-white/5 px-4 py-2 rounded-lg">
                <FiClock className="text-purple-400" />
                <span>
                  {getMeetingDuration(callData.startAt, callData.endedAt)}{" "}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Summary and Analytics Section */}
        <div className="flex flex-col ">
          {/* AI Summary Card */}
          <div className="glass-card p-6">
            <div className="flex flex-row items-center mb-4 gap-2 justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <FiActivity className="text-blue-400 text-xl" />
                </div>
                <h2 className="text-xl font-semibold">AI Summary</h2>
              </div>
              <div className="flex items-center gap-2 ">
                <div
                  className="p-2 bg-blue-500/20 rounded-lg cursor-pointer flex items-center gap-2 text-blue-400 text-sm"
                  title="Generate Summary"
                  onClick={() => generateSummary()}
                >
                  <FiStar className="text-blue-400 text-xl" />
                  {isSummaryLoading ? (
                    <span className="text-blue-600 text-sm">Generating...</span>
                  ) : (
                    <span className="text-blue-400 text-sm">Generate</span>
                  )}
                </div>
                {summary && (
                  <div
                    className="p-2 bg-blue-500/20 rounded-lg cursor-pointer"
                    title="Download Summary"
                    onClick={() => downloadSummaryById()}
                  >
                    <FiDownload className="text-blue-400 text-xl" />
                  </div>
                )}
              </div>
            </div>
            <div className="bg-white/5 p-4 rounded-lg border border-white/10">
              {summary ? (
                <ReactMarkdown>{summary.aiSummary}</ReactMarkdown>
              ) : (
                <p className="text-gray-400 text-sm">
                  No AI summary available. The summary will be generated by
                  click on the generate summary button.
                </p>
              )}
            </div>

            {/* Key Points */}
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                Key Points
              </h3>
              <ul className="space-y-2">
                {summary?.keyPoints?.length > 0 ? (
                  summary?.keyPoints.map((point: string, i: number) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-sm text-blue-400">•</span>
                      <span className="text-sm">{point}</span>
                    </li>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">
                    No key points available. The key points will be generated by
                    click on the generate summary button.
                  </p>
                )}
              </ul>
            </div>
          </div>
          <div className="flex gap-2 justify-end mt-6">
            <Button variant="outline" className="" onClick={toggleChat}>
              {showChat ? "Show Transcriptions" : "Show Chat"}
            </Button>
            <PostToLinkedin
              meetingLink={meetingRecording}
              transcriptions={transcriptions}
            />
          </div>
        </div>
        {/* Chat History */}
        {showChat && (
          <div className="glass-card p-6 lg:col-span-2 max-h-[600px] overflow-y-auto">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <FiMessageSquare className="text-purple-400 text-xl" />
              </div>
              <h2 className="text-xl font-semibold">Chat History</h2>
              <span className="text-xs bg-white/10 text-white px-2 py-1 rounded-full">
                {messages.length} messages
              </span>
            </div>
            {messages.length > 0 ? (
              <ul className="space-y-4">
                {messages.map((msg: any, i: number) => (
                  <li
                    key={i}
                    className="group flex items-start gap-3 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-200"
                  >
                    <div className="flex-shrink-0">
                      <img
                        className="h-10 w-10 rounded-full"
                        src={msg.user?.image}
                        alt={msg.user?.name}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <span className="font-medium truncate">
                          {msg.user?.name || "Anonymous"}
                        </span>
                        <span className="text-xs whitespace-nowrap">
                          {new Date(msg.created_at).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="mt-1 break-words">{msg.text}</p>

                      {msg.reaction_counts &&
                        Object.keys(msg.reaction_counts).length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {Object.entries(msg.reaction_counts).map(
                              ([reaction, count]) => (
                                <span
                                  key={reaction}
                                  className="px-2 py-0.5 bg-white/10 rounded-full text-xs text-gray-200 flex items-center gap-1 hover:bg-white/20 transition-colors"
                                >
                                  <span>{reaction}</span>
                                  <span className="text-xs opacity-80">
                                    {String(count)}
                                  </span>
                                </span>
                              )
                            )}
                          </div>
                        )}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-8">
                <div className="mx-auto w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                  <FiMessageSquare className="text-gray-400 text-2xl" />
                </div>
                <h3 className="text-gray-400 font-medium">
                  No chat history available
                </h3>
                <p className="text-gray-500 text-sm mt-1">
                  The chat history available. The chat history will appear here
                  when available
                </p>
              </div>
            )}
          </div>
        )}
        {/* Transcription Section */}
        {!showChat && (
          <div className="glass-card p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <FiFileText className="text-green-400 text-xl" />
              </div>
              <h2 className="text-xl font-semibold">Meeting Transcription</h2>
              <span className="text-xs bg-white/10 text-white px-2 py-1 rounded-full">
                {transcriptions.length} entries
              </span>
            </div>
            {transcriptions.length > 0 ? (
              <div className="space-y-4">
                {transcriptions.map((transcription: any, i: number) => (
                  <div
                    key={i}
                    className="group flex items-start gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-200"
                  >
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-medium">
                        {transcription.speakerName?.[0]?.toUpperCase() || "U"}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <span className="font-medium text-white">
                          {transcription.speakerName || "Unknown Speaker"}
                        </span>
                        <span className="text-xs text-gray-400 whitespace-nowrap">
                          {transcription.duration}
                        </span>
                      </div>
                      <p className="text-gray-200 mt-1">{transcription.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 ">
                <div className="mx-auto w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                  <FiFileText className="text-gray-400 text-2xl" />
                </div>
                <h3 className="text-gray-400 font-medium">
                  No transcription available
                </h3>
                <p className="text-gray-500 text-sm mt-1">
                  The meeting transcription will appear here when available
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
