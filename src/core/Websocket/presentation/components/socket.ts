import { io, Socket } from "socket.io-client";
import { baseURL } from "@/api/apiConfig";

let socket: Socket | null = null;

export const initializeSocket = (token?: string) => {
  if (!socket) {
    socket = io(`${baseURL}/workers`, {
      transports: ["websocket"],
      autoConnect: false,
      reconnection: true,
      auth: { token },
    });
  }

  return socket;
};

export const getSocket = () => {
  return socket;
};