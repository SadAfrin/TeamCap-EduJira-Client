"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAuthRole } from "@/hooks/useAuthRole";
import { useMessages } from "@/hooks/useMessages";

export default function MessagesPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading, user } = useAuthRole();
  const { conversations, fetchConversations, startConversation } = useMessages(user?.id);
  const [loading, setLoading] = useState(true);
  const [showNewConversation, setShowNewConversation] = useState(false);
  const [recipientId, setRecipientId] = useState("");

  if (!authLoading && !isAuthenticated) {
    router.push("/login");
    return null;
  }

  useEffect(() => {
    if (user?.id) {
      fetchConversations().finally(() => setLoading(false));
    }
  }, [user?.id, fetchConversations]);

  async function handleStartConversation() {
    if (!recipientId) {
      toast.error("Please select a recipient");
      return;
    }

    const conversationId = await startConversation(recipientId);
    if (conversationId) {
      setRecipientId("");
      setShowNewConversation(false);
      router.push(`/messages/${conversationId}`);
    }
  }

  if (authLoading) {
    return <div className="flex min-h-screen items-center justify-center text-slate-400">Loading...</div>;
  }

  return (
    <div className="grid min-h-screen grid-cols-1 gap-4 bg-slate-50 sm:grid-cols-4">
      {/* Sidebar - Conversations List */}
      <div className="border-r border-slate-200 bg-white sm:col-span-1">
        <div className="sticky top-0 flex h-16 items-center justify-between border-b border-slate-200 px-4">
          <h2 className="font-bold text-slate-900">Messages</h2>
          <button
            onClick={() => setShowNewConversation(!showNewConversation)}
            className="rounded-lg p-2 text-indigo-600 hover:bg-indigo-50"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
          </button>
        </div>

        {/* New Conversation Form */}
        {showNewConversation && (
          <div className="border-b border-slate-200 p-4">
            <input
              type="text"
              placeholder="Recipient ID or email..."
              value={recipientId}
              onChange={(e) => setRecipientId(e.target.value)}
              className="mb-2 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
            <div className="flex gap-2">
              <button
                onClick={handleStartConversation}
                className="flex-1 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
              >
                Start
              </button>
              <button
                onClick={() => setShowNewConversation(false)}
                className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Conversations List */}
        <div className="divide-y divide-slate-200 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-sm text-slate-400">Loading...</div>
          ) : conversations.length === 0 ? (
            <div className="p-4 text-center text-sm text-slate-400">
              No conversations yet
            </div>
          ) : (
            conversations.map((conv) => (
              <Link
                key={conv._id}
                href={`/messages/${conv._id}`}
                className="block border-b border-slate-100 p-4 hover:bg-slate-50"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 truncate">
                    <p className="text-sm font-medium text-slate-900">
                      {/* TODO: Get other participant's name */}
                      User
                    </p>
                    <p className="truncate text-xs text-slate-600">
                      {/* TODO: Show last message preview */}
                      No messages yet
                    </p>
                  </div>
                  {conv.unreadCount > 0 && (
                    <span className="ml-2 inline-flex items-center rounded-full bg-indigo-600 px-2.5 py-0.5 text-xs font-medium text-white">
                      {conv.unreadCount}
                    </span>
                  )}
                </div>
              </Link>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="sm:col-span-3 flex items-center justify-center bg-white">
        <div className="text-center">
          <p className="text-slate-600">Select a conversation to start messaging</p>
        </div>
      </div>
    </div>
  );
}
