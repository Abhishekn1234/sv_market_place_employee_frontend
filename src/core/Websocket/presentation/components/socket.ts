import { io, Socket } from "socket.io-client";
import { baseURL } from "@/api/apiConfig";
import { useAuthStore } from "@/core/store/auth";

const sockets: Record<string, Socket> = {};

export const initializeSocket = (
  namespace: "/workers/requests" | "/workers/assigned-updates"
) => {
  const token = useAuthStore.getState().accessToken;

  if (!sockets[namespace]) {
    sockets[namespace] = io(`${baseURL}${namespace}`, {
      transports: ["websocket"],
      autoConnect: false,
      reconnection: true,
      auth: { token },
    });
  } else {
    // 🔥 update token if changed
    sockets[namespace].auth = { token };
  }

  return sockets[namespace];
};

export const getSocket = (
  namespace: "/workers/requests" | "/workers/assigned-updates"
) => sockets[namespace];