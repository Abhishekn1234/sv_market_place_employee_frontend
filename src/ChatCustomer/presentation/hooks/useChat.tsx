"use client";

import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAuthStore } from "@/core/store/auth";
import { useLocation, useNavigate } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";

import { baseURL } from "@/api/apiConfig";

import { useChatMessages } from "./useChatMessages";
import { useSendChatMessage } from "./useSendChatMessage";
import type { Message } from "@/ChatCustomer/domain/entities/chat";
// import { showBrowserNotification } from "./showBrowserNotification";
// import { playIncomingMessageSound } from "./PlayIncomingMessageSound";
import { mergeUniqueMessages } from "./mergeUniqueMessages";
const SOCKET_URL = `${baseURL}/chat`;
const messageCache = new Map<string, Message[]>();

export function useChat(
  bookingId: string
) {
  const { accessToken, user } =
    useAuthStore();

  const { t } = useLanguage();

  const navigate = useNavigate();

  const location = useLocation();

  const socketRef =
    useRef<Socket | null>(null);

  const tRef = useRef(t);

  const locationPathRef = useRef(
    location.pathname
  );

  const [messages, setMessages] =
    useState<Message[]>(
      () =>
        messageCache.get(bookingId) ??
        []
    );

  const [connected, setConnected] =
    useState(false);

  const [input, setInput] =
    useState("");

  const myUserId = user?._id;

  // =========================
  // API GET
  // =========================

  const { data } =
    useChatMessages(bookingId);

  // =========================
  // API SEND
  // =========================

  const {
    mutateAsync: sendMessageApi,
  } = useSendChatMessage(
    bookingId
  );

  // =========================
  // TRANSLATION REF
  // =========================

  useEffect(() => {
    tRef.current = t;
  }, [t]);

  useEffect(() => {
    locationPathRef.current =
      location.pathname;
  }, [location.pathname]);

  // =========================
  // LOAD API MESSAGES
  // =========================

  useEffect(() => {
    if (!data?.data) return;

   const formatted: Message[] =
  data.data.map((msg: any) => ({
    id: msg._id,

    text: msg.message,

    senderId: msg.senderId,

    senderName: msg.senderName,

    createdAt: msg.createdAt,

    self:
      msg.senderId === myUserId,

    status:
      msg.status ||
      (msg.senderId === myUserId
        ? "delivered"
        : undefined),
  }));

    setMessages((prev) => {
      const next =
        mergeUniqueMessages(
          prev,
          formatted
        );

      messageCache.set(
        bookingId,
        next
      );

      return next;
    });
  }, [data, bookingId, myUserId]);

  // =========================
  // SOCKET CONNECTION
  // =========================

  useEffect(() => {
    if (
      !accessToken ||
      !bookingId
    )
      return;

    if (
      "Notification" in window &&
      Notification.permission ===
        "default"
    ) {
      Notification.requestPermission().catch(
        () => undefined
      );
    }

    if (socketRef.current) {
      socketRef.current.disconnect();

      socketRef.current.removeAllListeners();
    }

    const socket = io(
      SOCKET_URL,
      {
        auth: {
          token: accessToken,
        },
        transports: ["websocket"],
        forceNew: true,
      }
    );

    socketRef.current = socket;

    // =========================
    // CONNECT
    // =========================

    socket.on("connect", () => {
      console.log(
        "Connected:",
        socket.id
      );

      setConnected(true);

      socket.emit(
        "booking.chat.join",
        {
          bookingId,
        }
      );
    });

    // =========================
    // DISCONNECT
    // =========================

    socket.on(
      "disconnect",
      (reason) => {
        console.log(
          "Disconnected:",
          reason
        );

        setConnected(false);
      }
    );

    // =========================
    // ERROR
    // =========================

    socket.on(
      "connect_error",
      (err) => {
        console.log(
          "connect_error:",
          err.message
        );
      }
    );

    // =========================
    // RECEIVE MESSAGE
    // =========================

    socket.on(
      "booking.chat.message",
      (msg: any) => {
        console.log(
          "Received:",
          msg
        );

        const nextMessage: Message = {
  id:
    msg._id || msg.id,

  text:
    msg.message ||
    msg.text,

  senderId:
    msg.senderId,

  senderName:
    msg.senderName,

  createdAt:
    msg.createdAt,

  self:
    msg.senderId ===
    myUserId,

  status:
    msg.status ||
    (msg.senderId === myUserId
      ? "delivered"
      : undefined),
};

        setMessages((prev) => {
          const next =
            mergeUniqueMessages(
              prev,
              [nextMessage]
            );

          messageCache.set(
            bookingId,
            next
          );

          return next;
        });

     if (!nextMessage.self) {
  // optional: emit event instead of UI logic
  window.dispatchEvent(
    new CustomEvent("chat:new-message", {
      detail: nextMessage,
    })
  );
}
      }
    );

    return () => {
      socket.disconnect();
    };
  }, [
    bookingId,
    accessToken,
    myUserId,
    navigate,
  ]);

  // =========================
  // SEND MESSAGE
  // =========================

  const sendMessage =
    async () => {
      const text = String(
        input || ""
      ).trim();

      if (!text) {
        console.log(
          "Empty message blocked"
        );

        return;
      }

      if (!socketRef.current) {
        console.log(
          "Socket not ready"
        );

        return;
      }

      // PREVENT DOUBLE SEND

      const alreadySending =
        messages.some(
          (m) =>
            m.text.trim() ===
              text &&
            m.senderId ===
              myUserId &&
            Math.abs(
              new Date(
                m.createdAt || 0
              ).getTime() -
                Date.now()
            ) < 2000
        );

      if (alreadySending) return;

      // TEMP ID

      const tempId =
        Date.now().toString();

      // OPTIMISTIC MESSAGE

            const optimisticMessage: Message = {
          id: tempId,

          text,

          senderId:
            myUserId || "",

          senderName:
            user?.fullName ||
            "You",

          createdAt:
            new Date().toISOString(),

          self: true,

          status: "sent",
        };

      // ADD OPTIMISTIC

      setMessages((prev) => {
        const next =
          mergeUniqueMessages(
            prev,
            [optimisticMessage]
          );

        messageCache.set(
          bookingId,
          next
        );

        return next;
      });

      setInput("");

      try {
        // SOCKET SEND

        socketRef.current.emit(
          "booking.chat.send",
          {
            bookingId,
            text,
          }
        );

        // API SAVE

        const saved: any =
          await sendMessageApi({
            message: text,
          });

        // REMOVE TEMP + ADD REAL

        setMessages((prev) => {
                const savedMessage: Message = {
            id: saved._id,

            text:
              saved.message,

            senderId:
              saved.senderId,

            senderName:
              saved.senderName,

            createdAt:
              saved.createdAt,

            self:
              saved.senderId ===
              myUserId,

            status: "delivered",
          };

          const withoutTemp =
            prev.filter(
              (msg) =>
                msg.id !== tempId
            );

          const next =
            mergeUniqueMessages(
              withoutTemp,
              [savedMessage]
            );

          messageCache.set(
            bookingId,
            next
          );

          return next;
        });
      } catch (error) {
        console.log(error);

        // ROLLBACK

        setMessages((prev) => {
          const next =
            prev.filter(
              (msg) =>
                msg.id !== tempId
            );

          messageCache.set(
            bookingId,
            next
          );

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