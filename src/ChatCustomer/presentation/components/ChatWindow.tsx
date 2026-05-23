import { useEffect, useMemo, useRef } from "react";
import {
  Check,
  CheckCheck,
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
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export default function ChatWindow({
  bookingId,
  onBack,
  customer,
}: ChatWindowProps) {
  const { messages, input, setInput, sendMessage, connected } =
    useChat(bookingId);
  const { language, t } = useLanguage();

  const listRef = useRef<HTMLDivElement | null>(null);
  const scrollAnchorRef = useRef<HTMLDivElement | null>(null);
  const BackIcon = language === "AR" ? ChevronRight : ChevronLeft;
  const customerLabel = t("chat.customer");

  const lastMessage = useMemo(() => {
    return messages.length ? messages[messages.length - 1] : null;
  }, [messages]);

  useEffect(() => {
    // keep user pinned to latest messages
    scrollAnchorRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lastMessage?.id, messages.length]);

  return (
    <section className="flex h-full min-h-0 w-full flex-col overflow-hidden rounded-lg border border-border bg-card text-card-foreground shadow-sm">
      <header className="flex shrink-0 items-center justify-between gap-3 border-b border-border bg-card px-4 py-3 sm:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <Button
            type="button"
            onClick={onBack}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition hover:bg-accent hover:text-accent-foreground"
            aria-label={t("chat.back")}
            title={t("chat.back")}
          >
            <BackIcon className="h-4 w-4" />
          </Button>

          <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white shadow-sm">
            {getInitials(customer?.name)}
            <span
              className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-card ${
                connected ? "bg-green-500" : "bg-gray-400"
              }`}
            />
          </div>

          <div className="min-w-0">
            <h2 className="truncate text-base font-semibold text-foreground">
              {customer?.name || customerLabel}
            </h2>
            <div className="mt-0.5 flex min-w-0 items-center gap-2 text-xs text-muted-foreground">
              <span className="truncate">
                {t("chat.booking")} #{bookingId}
              </span>
              <span className="h-1 w-1 shrink-0 rounded-full bg-muted-foreground/40" />
              <span
                className={`inline-flex shrink-0 items-center gap-1 ${
                  connected ? "text-green-600 dark:text-green-400" : "text-muted-foreground"
                }`}
              >
                {connected ? (
                  <Wifi className="h-3.5 w-3.5" />
                ) : (
                  <WifiOff className="h-3.5 w-3.5" />
                )}
                {connected ? t("chat.online") : t("chat.connecting")}
              </span>
            </div>
          </div>
        </div>

        <div className="hidden rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-500/10 dark:text-blue-300 sm:block">
          {t("chat.customerChat")}
        </div>
      </header>

      <div
        ref={listRef}
        className="min-h-0 flex-1 overflow-y-auto bg-muted/35 px-3 py-5 dark:bg-background sm:px-5"
      >
        {messages.length === 0 ? (
                <CommonCard className="flex h-full min-h-[240px] sm:min-h-[320px] items-center justify-center text-center">
          <div className="max-w-xs px-5 py-6">
            <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-300">
              <MessageCircle className="h-5 w-5" />
            </div>

            <p className="text-sm font-semibold text-foreground">
              {t("chat.startConversation")}
            </p>

            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              {t("chat.emptyDescription")}
            </p>
          </div>
        </CommonCard>
        ) : (
          <div className="space-y-4">
            {messages.map((msg, i) => {
              const self = !!msg.self;
              const time = formatTime(msg.createdAt);
              const previous = messages[i - 1];
              const showSender = !self && previous?.senderId !== msg.senderId;

              return (
                <div
                  key={msg.id ?? i}
                  className={`flex items-end gap-2 ${
                    self ? "justify-end" : "justify-start"
                  }`}
                >
                  {!self && (
                    <div className="mb-5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent text-[11px] font-semibold text-accent-foreground">
                      {getInitials(msg.senderName || customer?.name)}
                    </div>
                  )}

                  <div className="max-w-[82%] sm:max-w-[68%]">
                    {showSender && (
                      <p className="mb-1 px-1 text-xs font-medium text-muted-foreground">
                        {msg.senderName || customer?.name || customerLabel}
                      </p>
                    )}
                    <div
                      className={`rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
                        self
                          ? "rounded-br-md bg-blue-600 text-white"
                          : "rounded-bl-md border border-border bg-card text-card-foreground"
                      }`}
                    >
                      <p className="whitespace-pre-wrap break-words leading-5">
                        {msg.text}
                      </p>
                    </div>
                  {time && (
                    <div
                      className={`mt-1 flex items-center gap-1 px-1 text-[11px] leading-none ${
                        self
                          ? "justify-end"
                          : "justify-start"
                      } text-muted-foreground/80`}
                    >
                      <span>{time}</span>

                      {self && (
                        <span
                          className={`flex items-center ${
                            msg.status === "read"
                              ? "text-blue-500"
                              : "text-gray-400"
                          }`}
                        >
                          {msg.status === "sent" && (
                            <Check size={12} />
                          )}

                          {msg.status === "delivered" && (
                            <CheckCheck size={12} />
                          )}

                          {msg.status === "read" && (
                            <CheckCheck size={12} />
                          )}
                        </span>
                      )}
                    </div>
                  )}
                  </div>

                  {self && (
                    <div className="mb-5 hidden h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[11px] font-semibold text-blue-700 dark:bg-blue-500/10 dark:text-blue-300 sm:flex">
                      {t("chat.you")}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
        <div ref={scrollAnchorRef} />
      </div>

      <footer className="shrink-0 border-t border-border bg-card p-3 sm:p-4">
        <div className="flex items-end gap-2">
          <div className="min-h-11 flex-1 rounded-lg border border-border bg-muted/60 px-3 py-2 transition focus-within:border-blue-500 focus-within:bg-card focus-within:ring-2 focus-within:ring-blue-100 dark:focus-within:ring-blue-500/20">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t("chat.typeMessage")}
              rows={1}
              className="max-h-28 min-h-7 w-full resize-none overflow-y-auto bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
            />
          </div>

          <Button
            onClick={sendMessage}
            disabled={!input.trim()}
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-sm font-semibold shadow-sm transition disabled:cursor-not-allowed disabled:opacity-50 ${
              input.trim()
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-blue-400 text-white"
            }`}
            aria-label={t("chat.sendMessage")}
            title={t("chat.sendMessage")}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </footer>
    </section>
  );
}

