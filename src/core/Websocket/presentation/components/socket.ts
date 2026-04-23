import { io, Socket } from "socket.io-client";
import { baseURL } from "@/api/apiConfig";
import { useAuthStore } from "@/core/store/auth";

const sockets: Record<string, Socket> = {};

export const getSocket = (namespace: string) => sockets[namespace];

export const initializeSocket = (namespace: string) => {
  if (sockets[namespace]) return sockets[namespace];

  const token = useAuthStore.getState().accessToken;

  const socket = io(`${baseURL}${namespace}`, {
    auth: { token },
    transports: ["websocket"],
  });

  sockets[namespace] = socket;

  return socket;
};