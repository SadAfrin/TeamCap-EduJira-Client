import { useEffect, useState, useCallback } from "react";
import {
  initializeSocket,
  getSocket,
  joinConversation,
  onNewMessage,
  onMessageRead,
  onUserTyping,
  onUserStoppedTyping,
  markAsReadViaSocket,
  offEvent,
} from "@/lib/socket";

interface Message {
  _id: string;
  conversationId: string;
  senderId: string;
  recipientId: string;
  content: string;
  isRead: boolean;
  createdAt: string;
}

interface Conversation {
  _id: string;
  participants: string[];
  lastMessage?: string;
  lastMessageAt?: string;
  unreadCount: number;
}

export function useMessages(userId: string | undefined) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [socketReady, setSocketReady] = useState(false);

  // Initialize socket
  useEffect(() => {
    if (!userId) return;

    const socket = initializeSocket(userId);
    setSocketReady(true);

    return () => {
      offEvent("new_message");
      offEvent("message_read");
      offEvent("user_typing");
      offEvent("user_stopped_typing");
    };
  }, [userId]);

  // Set up socket event listeners
  useEffect(() => {
    if (!socketReady) return;

    // Listen for new messages
    onNewMessage((data) => {
      setMessages((prev) => [...prev, data]);
    });

    // Listen for message read receipts
    onMessageRead((data) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === data.messageId ? { ...msg, isRead: true } : msg
        )
      );
    });

    // Listen for typing indicators
    onUserTyping((data) => {
      setTypingUsers((prev) => new Set(prev).add(data.senderId));
    });

    // Listen for stop typing
    onUserStoppedTyping((data) => {
      setTypingUsers((prev) => {
        const newSet = new Set(prev);
        newSet.delete(data.senderId);
        return newSet;
      });
    });
  }, [socketReady]);

  // Fetch conversations
  const fetchConversations = useCallback(async () => {
    try {
      const res = await fetch("/api/messages/conversations");
      if (res.ok) {
        const data = await res.json();
        setConversations(data.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch conversations:", error);
    }
  }, []);

  // Fetch messages for a conversation
  const fetchMessages = useCallback(
    async (conversationId: string, page = 1) => {
      try {
        setLoading(true);
        const res = await fetch(
          `/api/messages/conversations/${conversationId}/messages?page=${page}`
        );
        if (res.ok) {
          const data = await res.json();
          setMessages(data.data || []);
          joinConversation(conversationId);
        }
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Start or get conversation
  const startConversation = useCallback(
    async (recipientId: string, studentId?: string) => {
      try {
        const res = await fetch("/api/messages/conversation/start", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ recipientId, studentId }),
        });

        if (res.ok) {
          const data = await res.json();
          setSelectedConversation(data.conversationId);
          await fetchMessages(data.conversationId);
          await fetchConversations();
          return data.conversationId;
        }
      } catch (error) {
        console.error("Failed to start conversation:", error);
      }
      return null;
    },
    [fetchMessages, fetchConversations]
  );

  // Send message
  const sendMessage = useCallback(
    async (content: string) => {
      if (!selectedConversation || !content.trim()) return;

      try {
        const res = await fetch("/api/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            conversationId: selectedConversation,
            content: content.trim(),
          }),
        });

        if (res.ok) {
          const data = await res.json();
          setMessages((prev) => [...prev, data.data]);
          return data.data;
        }
      } catch (error) {
        console.error("Failed to send message:", error);
      }
      return null;
    },
    [selectedConversation]
  );

  // Mark message as read
  const markMessageRead = useCallback((messageId: string) => {
    markAsReadViaSocket({ messageId, conversationId: selectedConversation || "", senderId: userId || "" });
  }, [selectedConversation, userId]);

  return {
    conversations,
    selectedConversation,
    setSelectedConversation,
    messages,
    typingUsers,
    loading,
    socketReady,
    fetchConversations,
    fetchMessages,
    startConversation,
    sendMessage,
    markMessageRead,
  };
}
