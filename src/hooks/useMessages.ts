import { useEffect, useState, useCallback } from "react";
import {
  initializeSocket,
  onNewMessage,
  onMessageRead,
  onUserTyping,
  onUserStoppedTyping,
  markAsReadViaSocket,
  offEvent,
} from "@/lib/socket";
import { featureFetch } from "@/lib/featureApi";

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

  useEffect(() => {
    if (!userId) return;

    initializeSocket(userId);
    setSocketReady(true);

    return () => {
      offEvent("new_message");
      offEvent("message_read");
      offEvent("user_typing");
      offEvent("user_stopped_typing");
    };
  }, [userId]);

  useEffect(() => {
    if (!socketReady) return;

    onNewMessage((data) => {
      setMessages((prev) => {
        const id = data._id || data.messageId;
        if (prev.some((m) => m._id === id)) return prev;
        return [
          ...prev,
          {
            _id: id,
            conversationId: data.conversationId,
            senderId: data.senderId,
            recipientId: data.recipientId,
            content: data.content,
            isRead: data.isRead ?? false,
            createdAt: data.createdAt,
          },
        ];
      });
    });

    onMessageRead((data) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === data.messageId ? { ...msg, isRead: true } : msg
        )
      );
    });

    onUserTyping((data) => {
      setTypingUsers((prev) => new Set(prev).add(data.senderId));
    });

    onUserStoppedTyping((data) => {
      setTypingUsers((prev) => {
        const next = new Set(prev);
        next.delete(data.senderId);
        return next;
      });
    });
  }, [socketReady]);

  const fetchConversations = useCallback(async () => {
    try {
      const res = await featureFetch("/api/messages/conversations");
      if (res.ok) {
        const data = await res.json();
        setConversations(data.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch conversations:", error);
    }
  }, []);

  const fetchMessages = useCallback(async (conversationId: string, page = 1) => {
    try {
      setLoading(true);
      setSelectedConversation(conversationId);
      const res = await featureFetch(
        `/api/messages/conversations/${conversationId}/messages?page=${page}`
      );
      if (res.ok) {
        const data = await res.json();
        setMessages(data.data || []);
        const { joinConversation } = await import("@/lib/socket");
        joinConversation(conversationId);
      }
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const startConversation = useCallback(
    async (recipientId: string, studentId?: string) => {
      try {
        const res = await featureFetch("/api/messages/conversation/start", {
          method: "POST",
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

  const sendMessage = useCallback(
    async (content: string, conversationId?: string) => {
      const targetId = conversationId || selectedConversation;
      if (!targetId || !content.trim()) return null;

      try {
        const res = await featureFetch("/api/messages", {
          method: "POST",
          body: JSON.stringify({
            conversationId: targetId,
            content: content.trim(),
          }),
        });

        if (res.ok) {
          const data = await res.json();
          setMessages((prev) => {
            if (prev.some((m) => m._id === data.data._id)) return prev;
            return [...prev, data.data];
          });
          return data.data;
        }
      } catch (error) {
        console.error("Failed to send message:", error);
      }
      return null;
    },
    [selectedConversation]
  );

  const markMessageRead = useCallback(
    (messageId: string) => {
      markAsReadViaSocket({
        messageId,
        conversationId: selectedConversation || "",
        senderId: userId || "",
      });
    },
    [selectedConversation, userId]
  );

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
