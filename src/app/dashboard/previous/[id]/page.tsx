'use client'
import { useParams } from "next/navigation";
import { useGetCallById } from "@/hooks/useGetCallById";
import { useEffect, useState } from "react";
import { getMeetingChat } from "@/actions/streamAction/chat";
import { Avatar } from "stream-chat-react";

export default function PreviousMeetingPageDetails() {
  const { call, isCallLoading, fetchCallById, transcriptions ,setIsTranscriptionRequired} = useGetCallById();
  const [messages, setMessages] = useState<Object[]>([]);
  const params = useParams();
  const id = params.id as string;
  useEffect(() => {
    if (!id || call) return;
    setIsTranscriptionRequired(true);
    fetchCallById(id);
  }, [id, fetchCallById]);

  useEffect(() => {
    if (!id || !call) return;
    const loadData = async () => {
      const chat = await getMeetingChat(id);
      setMessages(chat);
    };
    loadData();
  }, [id, call]);
  if (isCallLoading || !call ) {
    return (
      <div className="flex h-screen items-center justify-center text-white">
        Loading...
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6 flex flex-col gap-6">
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          {call.state?.custom?.title ?? "Meeting Details"}
        </h1>
        <p className="text-gray-300 mb-4">
          {call.state?.custom?.description ?? "No description available."}
        </p>
        <div className="flex gap-4 text-sm text-gray-400">
          <p>
            <span className="font-semibold text-white">Starts: </span>
            {call.state?.startsAt?.toLocaleString?.() ?? "N/A"}
          </p>
          <p>
            <span className="font-semibold text-white">Ended: </span>
            {call.state?.endedAt?.toLocaleString?.() ?? "N/A"}
          </p>
        </div>
      </div>

      <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-lg p-6 flex-1 overflow-y-auto">
        <h2 className="text-xl font-semibold text-white mb-4">Chat History</h2>
        {messages.length > 0 ? (
          <ul className="space-y-4">
            {messages.map((msg: any, i: number) => (
              <li
                key={i}
                className="flex items-start gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition"
              >
                {/* <img
                  src={msg.user?.image}
                  alt={msg.user?.name}
                  className="w-10 h-10 rounded-full border border-white/20"
                /> */}
                <Avatar className="font-medium text-white rounded-full bg-white/10 px-2 py-1" name={msg.user?.name[0].toUpperCase()} />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-white">
                      {msg.user?.name}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(msg.created_at).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-gray-200">{msg.text}</p>

                  {msg.reaction_counts &&
                    Object.keys(msg.reaction_counts).length > 0 && (
                      <div className="flex gap-2 mt-1 text-sm text-gray-400">
                        {Object.entries(msg.reaction_counts).map(
                          ([reaction,count]) => (
                            <span
                              key={reaction}
                              className="px-2 py-0.5 bg-white/10 rounded-full text-xs"
                            >
                              {reaction} {String(count)}
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
          <p className="text-gray-400">No messages found.</p>
        )}
      </div>
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-lg p-6 flex-1 overflow-y-auto">
        <h2 className="text-xl font-semibold text-white mb-4">Transcription</h2>
        {transcriptions.length > 0 ? (
          <ul className="space-y-4">
            {transcriptions.map((transcription: any, i: number) => (
              <li
                key={i}
                className="flex items-start gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-white">
                      {transcription.speaker_id}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(transcription.start_ts).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-gray-200">{transcription.text}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400">No transcriptions found.</p>
        )}
      </div>
    </div>
  );
}
