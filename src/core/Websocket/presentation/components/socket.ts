import { io, Socket } from "socket.io-client";
import { baseURL } from "@/api/apiConfig";

const sockets: Record<string, Socket> = {};

/**
 * Initialize or return existing socket for a namespace
 */
export const initializeSocket = (
  namespace: "/workers/requests" | "/workers/assigned-updates",
  token?: string
) => {
  if (!sockets[namespace]) {
    sockets[namespace] = io(`${baseURL}${namespace}`, {
      transports: ["websocket"],
      autoConnect: false,
      reconnection: true,
      auth: { token },
    });
  }

  return sockets[namespace];
};

/**
 * Get already created socket
 */
export const getSocket = (
  namespace: "/workers/requests" | "/workers/assigned-updates"
) => {
  return sockets[namespace];
};