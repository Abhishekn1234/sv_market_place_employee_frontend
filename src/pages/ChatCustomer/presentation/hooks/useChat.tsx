"use client";

import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useLocation, useNavigate } from "react-router-dom";

import { useAuthStore } from "@/core/store/auth";
import { baseURL } from "@/api/apiConfig";


import { useSendChatMessage } from "./useSendChatMessage";

import type { Message } from "@/pages/ChatCustomer/domain/entities/chat";
import { mergeUniqueMessages } from "../utils/mergeUniqueMessages";
import { useGetChatMessages } from "./useChatMessages";

const SOCKET_URL = `${baseURL}/chat`;

const messageCache = new Map<string, Message[]>();

export function useChat(bookingId: string) {
  const { accessToken, user } = useAuthStore();

  const navigate = useNavigate();
  const location = useLocation();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const socketRef = useRef<Socket | null>(null);
  const isInChatPage = useRef(false);

  const [messages, setMessages] = useState<Message[]>(
    () => messageCache.get(bookingId) ?? []
  );

  const [connected, setConnected] = useState(false);
  const [input, setInput] = useState("");

  const myUserId = user?._id;

  // ==========================================
  // GET CHAT HISTORY
  // ==========================================
 const {
  data,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
} = useGetChatMessages(bookingId);

  // ==========================================
  // SEND MESSAGE API
  // ==========================================
  const { mutateAsync: sendMessageApi } =
    useSendChatMessage(bookingId);

  // ==========================================
  // TRACK CURRENT PAGE
  // ==========================================
  useEffect(() => {
    const match = location.pathname.match(/\/chat\/([^/]+)/);

    const currentBookingId = match?.[1];

    isInChatPage.current =
      String(currentBookingId) === String(bookingId);
  }, [location.pathname, bookingId]);

  // ==========================================
  // LOAD HISTORY
  // ==========================================
 useEffect(() => {
    if (!data?.pages) return;

    const history: Message[] = data.pages.flatMap((page: any) =>
      (page?.data ?? []).map((msg: any) => ({
        id: msg.id ?? msg._id,
        text: msg.message,
        senderId: msg.senderId,
        senderName: msg.senderName,
        createdAt: msg.createdAt,
        self: msg.senderId === myUserId,
        status: "delivered",
      }))
    );

    setMessages((prev) => {
      const next = mergeUniqueMessages(prev, history);
      messageCache.set(bookingId, next);
      return next;
    });
  }, [data, bookingId, myUserId]);
useEffect(() => {
  audioRef.current = new Audio("/notification.wav");

  return () => {
    audioRef.current = null;
  };
}, []);
  // ==========================================
  // SOCKET CONNECTION
  // ==========================================
  useEffect(() => {
    if (!bookingId || !accessToken) return;

    if ("Notification" in window) {
      if (Notification.permission === "default") {
        Notification.requestPermission().catch(() => {});
      }
    }

    const socket = io(SOCKET_URL, {
      auth: {
        token: accessToken,
      },
      transports: ["websocket"],
      forceNew: true,
    });

    socketRef.current = socket;

    // ==========================================
    // CONNECT
    // ==========================================
    socket.on("connect", () => {
      setConnected(true);

      socket.emit("booking.chat.join", {
        bookingId,
      });

      // console.log("Joined room:", bookingId);
    });

    // ==========================================
    // DISCONNECT
    // ==========================================
    socket.on("disconnect", () => {
      setConnected(false);
    });

    // ==========================================
    // ERROR
    // ==========================================
    socket.on("connect_error", (error) => {
      console.error("Socket Error:", error);
    });
    socket.on("unauthorized", () => {
      console.error("Unauthorized");
    });

    // ==========================================
    // RECEIVE SAVED MESSAGE
    // EVENT: booking.chat-message
    // ==========================================
  socket.on("booking.chat-message", (payload: any) => {
  const chatMessage =
    payload?.chatMessage ?? payload?.payload?.chatMessage;

  if (!chatMessage) return;

  const incomingMessage: Message = {
    id: chatMessage.id,
    text: chatMessage.message,
    senderId: chatMessage.senderId,
    senderName: chatMessage.senderName,
    createdAt: chatMessage.createdAt,
    self: chatMessage.senderId === myUserId,
    status: "delivered",
  };

  setMessages((prev) => {
    const next = mergeUniqueMessages(prev, [incomingMessage]);
    messageCache.set(bookingId, next);
    return next;
  });

  const isInChatPageRoute =
    location.pathname === `/chat/${bookingId}`;

  // 🔊 Play sound
  if (incomingMessage.senderId !== myUserId) {
    audioRef.current?.pause();
    audioRef.current!.currentTime = 0;

    audioRef.current
      ?.play()
      .catch((err) => console.log("Audio blocked:", err));
  }

  if (
    incomingMessage.senderId !== myUserId &&
    !isInChatPageRoute
  ) {
    navigator.serviceWorker?.controller?.postMessage({
      type: "SOCKET_CHAT_MESSAGE",
      payload: {
        title: `New message from ${
          incomingMessage.senderName || "User"
        }`,
        body: incomingMessage.text || "New message received",
        bookingId,
        chatMessageId: incomingMessage.id,
        url: `/chat/${bookingId}`,
      },
    });
  }
});

    return () => {
      socket.emit("booking.chat.leave", {
        bookingId,
      });

      socket.off("booking.chat-message");
      socket.disconnect();

      socketRef.current = null;

      setConnected(false);
    };
  }, [
    bookingId,
    accessToken,
    myUserId,
    navigate,
  ]);

  // ==========================================
  // SEND MESSAGE
  // ==========================================
  const sendMessage = async () => {
    const text = input.trim();

    if (!text) return;

    setInput("");

    try {
      await sendMessageApi({
        message: text,
      });

      // No optimistic update.
      // No socket emit.
      // Server will broadcast
      // booking.chat-message after save.
    } catch (error) {
      console.error(error);
    }
  };

   return {
    messages,
    connected,
    input,
    setInput,
    sendMessage,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  };
}