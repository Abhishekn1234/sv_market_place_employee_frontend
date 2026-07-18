import { io, Socket } from "socket.io-client";
import { baseURL } from "@/api/apiConfig";
import { useAuthStore } from "@/core/store/auth";

const sockets: Record<string, Socket> = {};

export const getSocket = (namespace: string): Socket | undefined => {
  return sockets[namespace];
};

export const initializeSocket = (namespace: string): Socket => {
  if (sockets[namespace]) {
    return sockets[namespace];
  }

  const socket = io(`${baseURL}${namespace}`, {
    auth: {
      token: useAuthStore.getState().accessToken,
    },

    transports: ["websocket"],

    // Auto reconnect
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,

    timeout: 20000,
    autoConnect: true,
  });

  socket.on("connect", () => {
    // console.log(
    //   `[Socket][${namespace}] Connected`,
    //   socket.id
    // );
  });

  socket.on("disconnect", (_reason) => {
    // console.log(
    //   `[Socket][${namespace}] Disconnected`,
    //   reason
    // );
  });

  socket.on("connect_error", (_err) => {
    // console.log(
    //   `[Socket][${namespace}] Connect Error`,
    //   err.message
    // );
  });

  socket.io.on("reconnect_attempt", (_attempt) => {
    socket.auth = {
      token: useAuthStore.getState().accessToken,
    };

    // console.log(
    //   `[Socket][${namespace}] Reconnect Attempt`,
    //   attempt
    // );
  });

  socket.io.on("reconnect", (_attempt) => {
    // console.log(
    //   `[Socket][${namespace}] Reconnected`,
    //   attempt
    // );
  });

  socket.io.on("reconnect_error", (err) => {
    console.log(
      `[Socket][${namespace}] Reconnect Error`,
      err.message
    );
  });

  socket.io.on("reconnect_failed", () => {
    console.log(
      `[Socket][${namespace}] Reconnect Failed`
    );
  });

  sockets[namespace] = socket;

  return socket;
};

export const reconnectSocket = (namespace: string) => {
  const socket = sockets[namespace];

  if (!socket) return;

  socket.auth = {
    token: useAuthStore.getState().accessToken,
  };

  if (!socket.connected) {
    socket.connect();
  }
};

export const disconnectSocket = (namespace: string) => {
  const socket = sockets[namespace];

  if (!socket) return;

  socket.removeAllListeners();
  socket.disconnect();

  delete sockets[namespace];
};