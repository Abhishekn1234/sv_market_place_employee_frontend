import { io, Socket } from "socket.io-client";
import { baseURL } from "@/api/apiConfig";

export let socket: Socket;

export const initializeSocket = (token?: string) => {
  if (!socket) {
    socket = io(`${baseURL}/workers`, {
      transports: ["websocket"],
      autoConnect: false,
       reconnection: false, 
      auth: { token },
    });
  }
  return socket;
};
