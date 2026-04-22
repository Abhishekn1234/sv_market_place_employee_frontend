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

export function useInitSockets() {
  const { accessToken } = useAuthStore();

  useEffect(() => {
    if (!accessToken) return;

    const requestSocket = initializeSocket("/workers/requests");
    const assignedSocket = initializeSocket("/workers/assigned-updates");

    requestSocket.connect();
    assignedSocket.connect();

    // optional global reference (safe access)
    window.__REQUEST_SOCKET__ = requestSocket;
    window.__ASSIGNED_SOCKET__ = assignedSocket;

    return () => {
      requestSocket.disconnect();
      assignedSocket.disconnect();
    };
  }, [accessToken]);
}