
"use client";

import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, ChevronRight, MessageCircle } from "lucide-react";

import CommonSpinner from "@/components/common/CommonSpinner";
import ChatWindow from "./components/ChatWindow";
import { useAssign } from "@/pages/Booking/AvailableWorks/presentation/hooks/useAssign";
import { useLanguage } from "@/context/presentation/components/LanguageContext";
import { Button } from "@/components/ui/button";

export default function ChatWorkerPage() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const { assignedWorks: bookings, isLoading } = useAssign();
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const BackIcon = language === "AR" ? ChevronRight : ChevronLeft;

  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100dvh-88px)] items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3 rounded-lg border border-border bg-card px-8 py-7 text-card-foreground shadow-sm">
          <CommonSpinner />
          <p className="text-sm font-medium text-muted-foreground">
            {t("chat.loadingChat")}
          </p>
        </div>
      </div>
    );
  }

  const booking = bookings?.find(
    (b) => String(b.bookingId) === String(bookingId)
  );

  if (!booking) {
    return (
      <div className="flex min-h-[calc(100dvh-88px)] items-center justify-center bg-background px-4">
        <div className="w-full max-w-sm rounded-lg border border-border bg-card px-6 py-8 text-center text-card-foreground shadow-sm">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <MessageCircle className="h-5 w-5" />
          </div>
          <h1 className="text-base font-semibold text-foreground">
            {t("chat.bookingNotFound")}
          </h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {t("chat.bookingNotFoundDescription")}
          </p>
          <Button
            type="button"
            onClick={() => navigate("/availableWork")}
            className="mt-5 inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-background px-4 text-sm font-medium text-foreground transition hover:bg-accent hover:text-accent-foreground"
          >
            <BackIcon className="h-4 w-4" />
            {t("chat.back")}
          </Button>
        </div>
      </div>
    );
  }

  const customer = booking.customer;

  return (
    <div className="flex min-h-[calc(100dvh-88px)] bg-background py-4">
      <div className="mx-auto flex h-[calc(100dvh-120px)] w-full max-w-5xl flex-col">
        <ChatWindow
          bookingId={bookingId!}
          onBack={() => navigate("/availableWork")}
          customer={{
            name: customer?.fullName,
            id: customer?._id,
          }}
        />
      </div>
    </div>
  );
}
