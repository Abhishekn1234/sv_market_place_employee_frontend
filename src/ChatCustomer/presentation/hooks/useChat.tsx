import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAuthStore } from "@/core/store/auth";
import { useLocation, useNavigate } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";

import { baseURL } from "@/api/apiConfig";

import { useChatMessages } from "./useChatMessages";
import { useSendChatMessage } from "./useSendChatMessage";

const SOCKET_URL = `${baseURL}/chat`;

type Message = {
  id?: string;
  text: string;
  senderId: string;
  senderName?: string;
  self?: boolean;
  createdAt?: string;
};

const messageCache = new Map<string, Message[]>();

function playIncomingMessageSound() {
  try {
    const AudioContext =
      window.AudioContext || (window as any).webkitAudioContext;

    if (!AudioContext) return;

    const audioContext = new AudioContext();
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(740, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(
      520,
      audioContext.currentTime + 0.12
    );

    gain.gain.setValueAtTime(0.001, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(
      0.18,
      audioContext.currentTime + 0.02
    );
    gain.gain.exponentialRampToValueAtTime(
      0.001,
      audioContext.currentTime + 0.18
    );

    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.2);

    oscillator.onended = () => {
      audioContext.close().catch(() => undefined);
    };
  } catch {}
}

export function useChat(bookingId: string) {
  const { accessToken, user } = useAuthStore();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const socketRef = useRef<Socket | null>(null);
  const tRef = useRef(t);
  const locationPathRef = useRef(location.pathname);

  const [messages, setMessages] = useState<Message[]>(
    () => messageCache.get(bookingId) ?? []
  );

  const [connected, setConnected] = useState(false);
  const [input, setInput] = useState("");

  const myUserId = user?._id;

  // =========================
  // API GET MESSAGES
  // =========================

  const { data } = useChatMessages(bookingId);

  // =========================
  // API SEND MESSAGE
  // =========================

  const { mutateAsync: sendMessageApi } =
    useSendChatMessage(bookingId);

  // =========================
  // TRANSLATION REF
  // =========================

  useEffect(() => {
    tRef.current = t;
  }, [t]);

  useEffect(() => {
    locationPathRef.current = location.pathname;
  }, [location.pathname]);

  // =========================
  // LOAD API MESSAGES
  // =========================

// =========================
// LOAD API MESSAGES
// =========================

useEffect(() => {
  if (!data?.data) return;

  const formatted: Message[] = data.data.map(
    (msg: any) => ({
      id: msg._id,
      text: msg.message,
      senderId: msg.senderId,
      senderName: msg.senderName,
      createdAt: msg.createdAt,
      self: msg.senderId === myUserId,
    })
  );

  setMessages((prev) => {
    // keep optimistic/local messages
    const merged = [...prev];

    formatted.forEach((incoming) => {
      const exists = merged.some(
        (m) =>
          (incoming.id && m.id === incoming.id) ||
          (
            m.text === incoming.text &&
            m.senderId === incoming.senderId &&
            m.createdAt === incoming.createdAt
          )
      );

      if (!exists) {
        merged.push(incoming);
      }
    });

    // sort by time
    merged.sort((a, b) => {
      return (
        new Date(a.createdAt || "").getTime() -
        new Date(b.createdAt || "").getTime()
      );
    });

    messageCache.set(bookingId, merged);

    return merged;
  });
}, [data, bookingId, myUserId]);

  // =========================
  // SOCKET CONNECTION
  // =========================

  useEffect(() => {
    if (!accessToken || !bookingId) return;

    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission().catch(() => undefined);
    }

    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current.removeAllListeners();
    }

    const socket = io(SOCKET_URL, {
      auth: {
        token: accessToken,
      },
      transports: ["websocket"],
      forceNew: true,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Connected:", socket.id);

      setConnected(true);

      socket.emit("booking.chat.join", {
        bookingId,
      });
    });

    socket.on("disconnect", (reason) => {
      console.log("Disconnected:", reason);
      setConnected(false);
    });

    socket.on("connect_error", (err) => {
      console.log("connect_error:", err.message);
    });

    // =========================
    // RECEIVE MESSAGE
    // =========================

   socket.on("booking.chat.message", (msg: any) => {
  console.log("Received:", msg);

  const nextMessage: Message = {
    id: msg._id || msg.id,
    text: msg.message || msg.text,
    senderId: msg.senderId,
    senderName: msg.senderName,
    createdAt: msg.createdAt,
    self: msg.senderId === myUserId,
  };

  setMessages((prev) => {
    const exists = prev.some((item) => {
      // same real id
      if (
        nextMessage.id &&
        item.id === nextMessage.id
      ) {
        return true;
      }

      // optimistic duplicate detection
      return (
        item.text === nextMessage.text &&
        item.senderId === nextMessage.senderId &&
        Math.abs(
          new Date(item.createdAt || "").getTime() -
            new Date(
              nextMessage.createdAt || ""
            ).getTime()
        ) < 5000
      );
    });

    if (exists) {
      return prev;
    }

    const next = [...prev, nextMessage];

    messageCache.set(bookingId, next);

    return next;
  });

  if (!nextMessage.self) {
    playIncomingMessageSound();
  }
});

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

  const sendMessage = async () => {
    const text = String(input || "").trim();

    if (!text) {
      console.log("Empty message blocked");
      return;
    }

    if (!socketRef.current) {
      console.log("Socket not ready");
      return;
    }

    const tempId = Date.now().toString();

    const optimisticMessage: Message = {
      id: tempId,
      text,
      senderId: myUserId || "",
      senderName: user?.fullName || "You",
      createdAt: new Date().toISOString(),
      self: true,
    };

    // optimistic update
    setMessages((prev) => {
      const next = [...prev, optimisticMessage];

      messageCache.set(bookingId, next);

      return next;
    });

    setInput("");

    try {
      // socket emit
      socketRef.current.emit("booking.chat.send", {
        bookingId,
        text,
      });

      // api save
      const saved: any = await sendMessageApi({
        message: text,
      });

      // replace temp id
      setMessages((prev) => {
        const next = prev.map((msg) =>
          msg.id === tempId
            ? {
                ...msg,
                id: saved._id,
              }
            : msg
        );

        messageCache.set(bookingId, next);

        return next;
      });
    } catch (error) {
      console.log(error);

      // rollback
      setMessages((prev) => {
        const next = prev.filter(
          (msg) => msg.id !== tempId
        );

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