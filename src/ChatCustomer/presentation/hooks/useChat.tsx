"use client";

import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAuthStore } from "@/core/store/auth";
import { useLocation, useNavigate } from "react-router-dom";
// import { useLanguage } from "@/context/LanguageContext";

import { baseURL } from "@/api/apiConfig";

import { useChatMessages } from "./useChatMessages";
import { useSendChatMessage } from "./useSendChatMessage";
import type { Message } from "@/ChatCustomer/domain/entities/chat";
import { mergeUniqueMessages } from "./mergeUniqueMessages";

const SOCKET_URL = `${baseURL}/chat`;
const messageCache = new Map<string, Message[]>();

export function useChat(bookingId: string) {
  const { accessToken, user } = useAuthStore();
  // const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const socketRef = useRef<Socket | null>(null);
  const locationRef = useRef(location.pathname);

  const isInChatPage = useRef(false);

  const [messages, setMessages] = useState<Message[]>(
    () => messageCache.get(bookingId) ?? []
  );

  const [connected, setConnected] = useState(false);
  const [input, setInput] = useState("");

  const myUserId = user?._id;

  // =========================
  // API GET
  // =========================
  const { data } = useChatMessages(bookingId);

  // =========================
  // API SEND
  // =========================
  const { mutateAsync: sendMessageApi } = useSendChatMessage(bookingId);

  // =========================
  // TRACK ROUTE
  // =========================
  useEffect(() => {
    locationRef.current = location.pathname;

    // Determine whether user is currently viewing this booking's chat.
    // Using pathname.includes can fail due to formatting differences; extract bookingId from URL instead.
    const match = location.pathname.match(/\/chat\/([^/]+)/);
    const currentBookingId = match?.[1];
    isInChatPage.current = String(currentBookingId) === String(bookingId);

  }, [location.pathname, bookingId]);

  // =========================
  // LOAD API MESSAGES
  // =========================
  useEffect(() => {
    if (!data?.data) return;

    const formatted: Message[] = data.data.map((msg: any) => ({
      id: msg._id,
      text: msg.message,
      senderId: msg.senderId,
      senderName: msg.senderName,
      createdAt: msg.createdAt,
      self: msg.senderId === myUserId,
      status:
        msg.status ||
        (msg.senderId === myUserId ? "delivered" : undefined),
    }));

    setMessages((prev) => {
      const next = mergeUniqueMessages(prev, formatted);
      messageCache.set(bookingId, next);
      return next;
    });
  }, [data, bookingId, myUserId]);

  // =========================
  // SOCKET CONNECTION
  // =========================
  useEffect(() => {
    if (!accessToken || !bookingId) return;

    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission().catch(() => {});
    }

    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current.removeAllListeners();
    }

    const socket = io(SOCKET_URL, {
      auth: { token: accessToken },
      transports: ["websocket"],
      forceNew: true,
    });

    socketRef.current = socket;

    // CONNECT
    socket.on("connect", () => {
      setConnected(true);

      socket.emit("booking.chat.join", { bookingId });
    });

    // DISCONNECT
    socket.on("disconnect", () => {
      setConnected(false);
    });

    // ERROR
    socket.on("connect_error", (err) => {
      console.log("connect_error:", err.message);
    });

    // =========================
    // RECEIVE MESSAGE
    // =========================
    socket.on("booking.chat.message", (msg: any) => {
      const nextMessage: Message = {
        id: msg._id || msg.id,
        text: msg.message || msg.text,
        senderId: msg.senderId,
        senderName: msg.senderName,
        createdAt: msg.createdAt,
        self: msg.senderId === myUserId,
        status:
          msg.status ||
          (msg.senderId === myUserId ? "delivered" : undefined),
      };

      setMessages((prev) => {
        const next = mergeUniqueMessages(prev, [nextMessage]);
        messageCache.set(bookingId, next);
        return next;
      });

      // =========================
      // NOTIFICATION CONTROL
      // =========================
      const isSelf = nextMessage.self;

      // If user is already viewing this booking's chat, skip browser notifications.
      if (!isSelf && !isInChatPage.current) {


        const title = `New message from ${
          nextMessage.senderName || "User"
        }`;

        const body = nextMessage.text || "New message received";

        const url = `/chat/${bookingId}`;

        if (
          Notification.permission === "granted" &&
          "serviceWorker" in navigator
        ) {
          navigator.serviceWorker.ready
            .then((registration) =>
              registration.showNotification(title, {
                body,
                icon: "/logo.png",
                tag: nextMessage.id,
                requireInteraction: true,
                actions: [{ action: "open", title: "Open" }],
                data: { url, bookingId },
              } as NotificationOptions & {
                actions: { action: string; title: string }[];
              })
            )
            .catch(() => {
              navigate(url);
            });
        }
      }
    });

    return () => {
      socket.emit("booking.chat.leave", { bookingId });

      socket.removeAllListeners();
      socket.disconnect();

      socketRef.current = null;
      setConnected(false);
    };
  }, [bookingId, accessToken, myUserId, navigate]);

  // =========================
  // SEND MESSAGE
  // =========================
  const sendMessage = async () => {
    const text = String(input || "").trim();
    if (!text || !socketRef.current) return;

    const tempId = Date.now().toString();

    const optimisticMessage: Message = {
      id: tempId,
      text,
      senderId: myUserId || "",
      senderName: user?.fullName || "You",
      createdAt: new Date().toISOString(),
      self: true,
      status: "sent",
    };

    setMessages((prev) => {
      const next = mergeUniqueMessages(prev, [optimisticMessage]);
      messageCache.set(bookingId, next);
      return next;
    });

    setInput("");

    try {
      socketRef.current.emit("booking.chat.send", {
        bookingId,
        text,
      });

      const saved: any = await sendMessageApi({ message: text });

      setMessages((prev) => {
        const withoutTemp = prev.filter((m) => m.id !== tempId);

        const finalMessage: Message = {
          id: saved._id,
          text: saved.message,
          senderId: saved.senderId,
          senderName: saved.senderName,
          createdAt: saved.createdAt,
          self: saved.senderId === myUserId,
          status: "delivered",
        };

        const next = mergeUniqueMessages(withoutTemp, [finalMessage]);
        messageCache.set(bookingId, next);
        return next;
      });
    } catch (err) {
      console.log(err);

      setMessages((prev) => {
        const next = prev.filter((m) => m.id !== tempId);
        messageCache.set(bookingId, next);
        return next;
      });
    }
  };

  return {
    messages,
    connected,
    input,
    setInput,
    sendMessage,
  };
}
