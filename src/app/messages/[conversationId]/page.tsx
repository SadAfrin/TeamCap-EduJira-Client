"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import toast from "react-hot-toast";
import { useAuthRole } from "@/hooks/useAuthRole";
import { useMessages } from "@/hooks/useMessages";

export default function ConversationPage() {
  const router = useRouter();
  const params = useParams();
  const conversationId = params.conversationId as string;
  const { isAuthenticated, isLoading: authLoading, user } = useAuthRole();
  const {
    messages,
    loading,
    fetchMessages,
    sendMessage,
    markMessageRead,
  } = useMessages(user?.id);

  const [messageText, setMessageText] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  if (!authLoading && !isAuthenticated) {
    router.push("/login");
    return null;
  }

  useEffect(() => {
    if (conversationId) {
      fetchMessages(conversationId);
    }
  }, [conversationId, fetchMessages]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSendMessage() {
    if (!messageText.trim()) return;

    setSending(true);
    const result = await sendMessage(messageText);
    setSending(false);

    if (result) {
      setMessageText("");
      toast.success("Message sent");
    } else {
      toast.error("Failed to send message");
    }
  }

  if (authLoading) {
    return <div className="flex min-h-screen items-center justify-center text-slate-400">Loading...</div>;
  }

  return (
    <div className="grid min-h-screen grid-cols-1 gap-4 bg-slate-50 sm:grid-cols-4">
      {/* Sidebar */}
      <div className="hidden border-r border-slate-200 bg-white sm:col-span-1 sm:block">
        <div className="p-4">
          <Link
            href="/messages"
            className="flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-500"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Messages
          </Link>
        </div>
      </div>

      {/* Chat Area */}
      <div className="sm:col-span-3 flex flex-col bg-white">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 p-4">
          <div>
            <h2 className="font-bold text-slate-900">
              {/* TODO: Get other participant's name */}
              Conversation
            </h2>
            <p className="text-xs text-slate-600">
              {/* TODO: Show online status */}
              Active now
            </p>
          </div>
          <Link
            href="/messages"
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 sm:hidden"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Link>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex items-center justify-center text-slate-400">Loading...</div>
          ) : messages.length === 0 ? (
            <div className="flex items-center justify-center text-center text-slate-400">
              No messages yet. Start the conversation!
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg._id}
                  className={`flex ${msg.senderId === user?.id ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-sm rounded-lg px-4 py-2 ${
                      msg.senderId === user?.id
                        ? "bg-indigo-600 text-white"
                        : "border border-slate-200 bg-slate-50 text-slate-900"
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                    <p
                      className={`mt-1 text-xs ${
                        msg.senderId === user?.id
                          ? "text-indigo-100"
                          : "text-slate-500"
                      }`}
                    >
                      {new Date(msg.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input */}
        <div className="border-t border-slate-200 p-4">
          <div className="flex gap-3">
            <input
              type="text"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Type a message..."
              className="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-sm placeholder:text-slate-400 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
            />
            <button
              onClick={handleSendMessage}
              disabled={sending || !messageText.trim()}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-indigo-500 disabled:opacity-50"
            >
              {sending ? "..." : "Send"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
