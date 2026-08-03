// useInitSockets.ts
import { useEffect } from "react";
import { initializeSocket } from "../components/socket";
import { useAuthStore } from "@/core/store/auth";

declare global {
  interface Window {
    __REQUEST_SOCKET__?: any;
    __ASSIGNED_SOCKET__?: any;
  }
}

// 🔥 REQUEST SOCKET ONLY (for modal)
export function useRequestSocket() {
  const { accessToken } = useAuthStore();

  useEffect(() => {
    if (!accessToken) return;

    const requestSocket = initializeSocket("/workers/requests");
    requestSocket.connect();

    window.__REQUEST_SOCKET__ = requestSocket;

    return () => {
      requestSocket.disconnect();
    };
  }, [accessToken]);
}

// 🔥 ASSIGNED SOCKET ONLY (for assigned works)
export function useAssignedSocketInit() {
  const { accessToken } = useAuthStore();

  useEffect(() => {
    if (!accessToken) return;

    const assignedSocket = initializeSocket("/workers/assigned-updates");
    assignedSocket.connect();

    window.__ASSIGNED_SOCKET__ = assignedSocket;

    return () => {
      assignedSocket.disconnect();
    };
  }, [accessToken]);
}

// 🔥 INIT BOTH (backward compatibility)
export function useInitSockets() {
  useRequestSocket();
  useAssignedSocketInit();
}
