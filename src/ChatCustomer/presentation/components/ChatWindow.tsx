"use client";

import { useEffect,  useRef } from "react";
// useMemo,
import {
  // Check,
  // CheckCheck,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  Send,
  Wifi,
  WifiOff,
} from "lucide-react";

import { useChat } from "../hooks/useChat";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CommonCard } from "@/components/common/CommonCard";

type ChatWindowProps = {
  bookingId: string;
  onBack: () => void;
  customer: {
    id?: string;
    name?: string;
  };
};

function formatTime(createdAt?: string) {
  if (!createdAt) return null;
  const d = new Date(createdAt);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function getInitials(name?: string) {
  const trimmed = name?.trim();
  if (!trimmed) return "CU";

  return trimmed
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();
}

export default function ChatWindow({
  bookingId,
  onBack,
  customer,
}: ChatWindowProps) {
  const {
    messages,
    input,
    setInput,
    sendMessage,
    connected,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useChat(bookingId);

  const { language, t } = useLanguage();

  const listRef = useRef<HTMLDivElement | null>(null);
  const scrollAnchorRef = useRef<HTMLDivElement | null>(null);
  const prevLen = useRef(messages.length);

  const BackIcon = language === "AR" ? ChevronRight : ChevronLeft;
  const customerLabel = t("chat.customer");

  // const lastMessage = useMemo(() => {
  //   return messages.length ? messages[messages.length - 1] : null;
  // }, [messages]);

  // =========================
  // AUTO SCROLL (ONLY NEW MESSAGE)
  // =========================
  useEffect(() => {
    const isNewMessage = messages.length > prevLen.current;
    prevLen.current = messages.length;

    if (isNewMessage) {
      scrollAnchorRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // =========================
  // INFINITE SCROLL (TOP)
  // =========================
  const handleScroll = () => {
    const el = listRef.current;
    if (!el) return;

    if (
      el.scrollTop === 0 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
  };

  return (
    <section className="flex h-full min-h-0 w-full flex-col overflow-hidden rounded-lg border border-border bg-card text-card-foreground shadow-sm">
      {/* HEADER */}
      <header className="flex shrink-0 items-center justify-between gap-3 border-b border-border bg-card px-4 py-3 sm:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <Button
            onClick={onBack}
            className="flex h-9 w-9 items-center justify-center rounded-lg border"
          >
            <BackIcon className="h-4 w-4" />
          </Button>

          <div className="relative flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 text-white font-semibold">
            {getInitials(customer?.name)}
            <span
              className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-card ${
                connected ? "bg-green-500" : "bg-gray-400"
              }`}
            />
          </div>

          <div className="min-w-0">
            <h2 className="truncate font-semibold">
              {customer?.name || customerLabel}
            </h2>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{t("chat.booking")}</span>
              <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />
              <span className="flex items-center gap-1">
                {connected ? (
                  <Wifi className="h-3 w-3" />
                ) : (
                  <WifiOff className="h-3 w-3" />
                )}
                {connected ? t("chat.online") : t("chat.connecting")}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* CHAT LIST */}
      <div
        ref={listRef}
        onScroll={handleScroll}
        className="min-h-0 flex-1 overflow-y-auto bg-muted/35 px-3 py-5"
      >
        {messages.length === 0 ? (
          <CommonCard className="flex h-full items-center justify-center text-center">
            <div>
              <MessageCircle className="mx-auto mb-2 h-5 w-5" />
              <p className="font-semibold">{t("chat.startConversation")}</p>
              <p className="text-xs text-muted-foreground">
                {t("chat.emptyDescription")}
              </p>
            </div>
          </CommonCard>
        ) : (
          <div className="space-y-4">
            {messages.map((msg, i) => {
              const self = !!msg.self;
              const time = formatTime(msg.createdAt);
              const prev = messages[i - 1];
              const showSender =
                !self && prev?.senderId !== msg.senderId;

              return (
                <div
                  key={msg.id ?? i}
                  className={`flex items-end gap-2 ${
                    self ? "justify-end" : "justify-start"
                  }`}
                >
                  {!self && (
                    <div className="h-7 w-7 flex items-center justify-center rounded-full bg-gray-200 text-xs">
                      {getInitials(msg.senderName)}
                    </div>
                  )}

                  <div className="max-w-[75%]">
                    {showSender && (
                      <p className="text-xs text-muted-foreground mb-1">
                        {msg.senderName}
                      </p>
                    )}

                    <div
                      className={`rounded-2xl px-4 py-2 text-sm ${
                        self
                          ? "bg-blue-600 text-white"
                          : "border bg-white"
                      }`}
                    >
                      {msg.text}
                    </div>

                    {time && (
                      <div className="text-[11px] text-muted-foreground mt-1">
                        {time}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* anchor */}
        <div ref={scrollAnchorRef} />
      </div>

      {/* FOOTER */}
      <footer className="border-t p-3 flex gap-2">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          placeholder={t("chat.typeMessage")}
        />

        <Button
          onClick={sendMessage}
          disabled={!input.trim()}
          className="bg-blue-600 text-white"
        >
          <Send className="h-4 w-4" />
        </Button>
      </footer>
    </section>
  );
}