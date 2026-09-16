"use client";

import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAuthRole } from "./useAuthRole";

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export function useSocket() {
  const { user, role } = useAuthRole();
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!socketRef.current) {
      const socket = io(SOCKET_URL, {
        transports: ["websocket", "polling"],
      });

      socket.on("connect", () => {
        setIsConnected(true);
        if (user?.email || role) {
          socket.emit("join", {
            userId: user?.email,
            role: role?.toLowerCase(),
          });
        }
      });

      socket.on("disconnect", () => {
        setIsConnected(false);
      });

      socketRef.current = socket;
    }

    // Join room when user/role changes
    if (socketRef.current && isConnected && (user?.email || role)) {
      socketRef.current.emit("join", {
        userId: user?.email,
        role: role?.toLowerCase(),
      });
    }

    return () => {
      // Keep connection during route navigation
    };
  }, [user, role, isConnected]);

  return {
    socket: socketRef.current,
    isConnected,
  };
}
