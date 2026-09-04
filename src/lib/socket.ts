import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

/**
 * Initialize Socket.io connection
 * Should be called once on app boot (in layout.tsx or _app.tsx)
 */
export function initializeSocket(userId: string): Socket {
  if (socket && socket.connected) {
    return socket;
  }

  const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  socket = io(baseURL, {
    query: { userId },
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
  });

  socket.on("connect", () => {
    console.log("Socket connected:", socket?.id);
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected");
  });

  socket.on("connect_error", (error) => {
    console.error("Socket connection error:", error);
  });

  return socket;
}

/**
 * Get existing socket instance
 */
export function getSocket(): Socket | null {
  return socket;
}

/**
 * Disconnect socket
 */
export function disconnectSocket(): void {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

/**
 * Join conversation room
 */
export function joinConversation(conversationId: string): void {
  if (socket) {
    socket.emit("join_conversation", conversationId);
  }
}

/**
 * Send message via socket
 */
export function sendMessageViaSocket(data: {
  conversationId: string;
  messageId: string;
  senderId: string;
  recipientId: string;
  content: string;
  createdAt: string;
}): void {
  if (socket) {
    socket.emit("send_message", data);
  }
}

/**
 * Emit typing indicator
 */
export function emitTyping(conversationId: string, senderId: string): void {
  if (socket) {
    socket.emit("typing", { conversationId, senderId });
  }
}

/**
 * Emit stop typing indicator
 */
export function emitStopTyping(conversationId: string, senderId: string): void {
  if (socket) {
    socket.emit("stop_typing", { conversationId, senderId });
  }
}

/**
 * Mark message as read via socket
 */
export function markAsReadViaSocket(data: {
  messageId: string;
  conversationId: string;
  senderId: string;
}): void {
  if (socket) {
    socket.emit("mark_as_read", data);
  }
}

/**
 * Listen for new messages
 */
export function onNewMessage(callback: (data: any) => void): void {
  if (socket) {
    socket.on("new_message", callback);
  }
}

/**
 * Listen for message delivered
 */
export function onMessageDelivered(callback: (data: any) => void): void {
  if (socket) {
    socket.on("message_delivered", callback);
  }
}

/**
 * Listen for message read
 */
export function onMessageRead(callback: (data: any) => void): void {
  if (socket) {
    socket.on("message_read", callback);
  }
}

/**
 * Listen for user typing
 */
export function onUserTyping(callback: (data: any) => void): void {
  if (socket) {
    socket.on("user_typing", callback);
  }
}

/**
 * Listen for user stopped typing
 */
export function onUserStoppedTyping(callback: (data: any) => void): void {
  if (socket) {
    socket.on("user_stopped_typing", callback);
  }
}

/**
 * Remove event listeners (cleanup)
 */
export function offEvent(event: string): void {
  if (socket) {
    socket.off(event);
  }
}
