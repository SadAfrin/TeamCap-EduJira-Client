"use client";

import { useEffect, useState } from "react";
import { apiGet, apiPost } from "@/lib/api";
import { useAuthRole } from "@/hooks/useAuthRole";
import { useSocket } from "@/hooks/useSocket";
import toast from "react-hot-toast";

export default function ParentMessagesPage() {
  const { user } = useAuthRole();
  const { socket } = useSocket();
  const [threads, setThreads] = useState<any[]>([]);
  const [selectedThread, setSelectedThread] = useState<any>(null);
  const [messageText, setMessageText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const parentEmail = user?.email || "tariqul.parent@edujira.edu";

  const fetchThreads = async () => {
    try {
      setLoading(true);
      const res = await apiGet(`/api/messages/threads`);
      if (res.success) {
        setThreads(res.data || []);
        if (res.data?.length > 0 && !selectedThread) {
          setSelectedThread(res.data[0]);
        }
      }
    } catch (err) {
      console.error("Failed to fetch threads:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchThreads();
  }, []);

  // Listen to live incoming socket messages
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (payload: any) => {
      setThreads((prev) =>
        prev.map((th) =>
          th._id === payload.threadId
            ? { ...th, messages: [...th.messages, payload.message], lastMessage: payload.message.text }
            : th
        )
      );

      if (selectedThread && selectedThread._id === payload.threadId) {
        setSelectedThread((prev: any) => ({
          ...prev,
          messages: [...prev.messages, payload.message],
        }));
      }
    };

    socket.on("message:new", handleNewMessage);
    return () => {
      socket.off("message:new", handleNewMessage);
    };
  }, [socket, selectedThread]);

  const handleStartThread = async (teacherName: string, teacherId: string) => {
    try {
      const res = await apiPost("/api/messages/threads", {
        parentId: parentEmail,
        parentName: user?.name || "Tariqul Islam",
        teacherId,
        teacherName,
        studentId: "STD-801",
        studentName: "Rahim Uddin",
        className: "Class 8",
        subjectName: "General Academics",
      });

      if (res.success && res.data) {
        setSelectedThread(res.data);
        fetchThreads();
      }
    } catch (err) {
      console.error("Failed to create thread:", err);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedThread || !messageText.trim()) return;

    setSending(true);
    try {
      const res = await apiPost(`/api/messages/threads/${selectedThread._id}/send`, {
        senderRole: "parent",
        senderName: user?.name || "Tariqul Islam",
        senderEmail: parentEmail,
        text: messageText,
      });

      if (res.success && res.data) {
        setMessageText("");
        setSelectedThread(res.data);
        fetchThreads();
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to send message");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Teacher Communication</h1>
          <p className="text-xs text-slate-500 mt-1">Directly consult with your child's class and subject teachers</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleStartThread("Dr. Anisur Rahman", "anisur.rahman@edujira.edu")}
            className="rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-2 text-xs font-bold text-amber-800 hover:bg-amber-100"
          >
            + Message Class Teacher
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[650px] rounded-3xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        {/* Left Thread List */}
        <div className="border-r border-slate-200/80 bg-slate-50/50 flex flex-col">
          <div className="p-4 border-b border-slate-200/80">
            <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">Teacher Conversations</h3>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {loading ? (
              <p className="text-xs text-slate-400 p-6 text-center">Loading chats...</p>
            ) : threads.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400">
                No active conversations. Click "+ Message Class Teacher" above to start a conversation.
              </div>
            ) : (
              threads.map((th) => (
                <div
                  key={th._id}
                  onClick={() => setSelectedThread(th)}
                  className={`p-4 cursor-pointer transition-colors ${
                    selectedThread?._id === th._id ? "bg-white shadow-sm border-l-4 border-amber-600" : "hover:bg-slate-100/70"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs">{th.teacherName}</span>
                    <span className="rounded bg-amber-50 px-1.5 py-0.5 text-[9px] font-bold text-amber-700">
                      Child: {th.studentName}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 truncate mt-1">{th.lastMessage || "Start conversation..."}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Active Chat */}
        <div className="md:col-span-2 flex flex-col bg-white">
          {selectedThread ? (
            <>
              {/* Chat Top Banner */}
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{selectedThread.teacherName}</h3>
                  <p className="text-[11px] text-slate-500">
                    Faculty Member • Subject: {selectedThread.subjectName || "Science"} (Child: <strong className="text-indigo-600">{selectedThread.studentName}</strong>)
                  </p>
                </div>
                <span className="rounded-full bg-blue-50 px-3 py-1 text-[10px] font-bold text-blue-700 border border-blue-200">
                  Faculty Verified
                </span>
              </div>

              {/* Message Stream */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {selectedThread.messages && selectedThread.messages.length > 0 ? (
                  selectedThread.messages.map((msg: any, idx: number) => {
                    const isMe = msg.senderRole === "parent";
                    return (
                      <div key={idx} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                        <div
                          className={`max-w-md rounded-2xl p-3.5 text-xs ${
                            isMe
                              ? "bg-amber-600 text-white rounded-br-none shadow-xs"
                              : "bg-slate-100 text-slate-800 rounded-bl-none"
                          }`}
                        >
                          <p className="text-[10px] font-bold opacity-80 mb-0.5">{msg.senderName}</p>
                          <p className="leading-relaxed">{msg.text}</p>
                        </div>
                        <span className="text-[9px] text-slate-400 mt-1 px-1">
                          {msg.sentAt ? new Date(msg.sentAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "Now"}
                        </span>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-center text-xs text-slate-400 py-12">
                    Send a message below to start communicating with {selectedThread.teacherName}.
                  </p>
                )}
              </div>

              {/* Chat Input */}
              <div className="p-3.5 border-t border-slate-100 bg-slate-50/50">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <input
                    type="text"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Type your message to the teacher..."
                    className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-xs outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600"
                  />
                  <button
                    type="submit"
                    disabled={!messageText.trim() || sending}
                    className="rounded-2xl bg-amber-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-amber-500 shadow-md shadow-amber-600/20 disabled:opacity-40"
                  >
                    Send ➔
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-400 text-xs">
              Select or start a conversation thread from the left to message your child's teachers.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
