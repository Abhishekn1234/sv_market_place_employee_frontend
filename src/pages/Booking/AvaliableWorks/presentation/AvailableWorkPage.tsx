"use client";

import { useEffect, useMemo, useState } from "react";
import { CommonCard } from "@/components/common/CommonCard";
import { useLanguage } from "@/context/presentation/components/LanguageContext";
import { useServiceCategory } from "@/pages/Servicesettings/presentation/hooks/useServiceCategory";
import { useCancel } from "./hooks/useCancel";
import { useAssign } from "./hooks/useAssign";
import WorkGrid from "./components/WorkGrid";
import WorkModals from "./components/WorkModals";

import {
  FINAL_WORK_STATUSES,
  getBookingId,
} from "./utils/workPresentation.helpers";
import type {
  CancelableWork,
  DisplayWork,
  WorkModalType,
  WorkTimerMap,
} from "../domain/entities/workPresentation.types";
import { BookingEvents } from "@/components/common/BookingEvents";
import { getSocket, initializeSocket } from "@/core/Websocket/presentation/components/socket";

const BOOKING_NAMESPACE = "/workers/assigned-updates";

const EXCLUDED_STATUSES = [
  "CANCELLED",
  "CANCELLED_BY_CUSTOMER",
  "CANCELLED_BY_WORKER",
  "INVOICE_GENERATED",
  "PAYMENT_COMPLETED",
];

const UPSERT_EVENTS = [
  BookingEvents.ASSIGNED,
  BookingEvents.WORKER_ACCEPTED,
  BookingEvents.WORKER_STARTED,
  BookingEvents.WORKER_COMPLETED,
  BookingEvents.WORK_START_OTP_GENERATED,
  BookingEvents.WORK_STARTED,
  BookingEvents.WORK_COMPLETED_BY_WORKER,
  BookingEvents.COMPLETION_OTP_GENERATED,
  BookingEvents.COMPLETION_CONFIRMED,
  BookingEvents.COMPLETED,

  BookingEvents.PAYMENT_INITIATED, // <-- Add this

  BookingEvents.PARTIALLY_PAID,
  BookingEvents.PAID,

  BookingEvents.COORDINATOR_ASSIGNED_WORKER,
  BookingEvents.COORDINATOR_REASSIGNED_WORKER,
];

const REMOVE_EVENTS = [
  BookingEvents.CANCELLED_BY_CUSTOMER,
  BookingEvents.CANCELLED_BY_WORKER,
  BookingEvents.CANCELLEDLED_BY_PLATFORM,
  BookingEvents.INVOICE_GENERATED,
  BookingEvents.PAYMENT_COMPLETED,
];


function resolveStartedAt(work: any): string | null {
  return (
    work?.workStartedAt ??
    work?.startedAt ??
    work?.booking?.startedAt ??
    work?.booking?.workStartedAt ??
    null
  );
}

export default function AvailableWorkPage() {
  const { language, t } = useLanguage();
  const { data: categories } = useServiceCategory();
  const cancelMutation = useCancel();
  const { assignedWorks: assignedFromApi, isLoading,refetch } = useAssign();
  const isRTL = language === "AR";

  const [selectedWork, setSelectedWork] = useState<DisplayWork | null>(null);
  const [modalType, setModalType] = useState<WorkModalType | null>(null);
  const [cancelConfirmWork, setCancelConfirmWork] =
    useState<CancelableWork | null>(null);
  const [timers, setTimers] = useState<WorkTimerMap>({});
  const [liveBookings, setLiveBookings] = useState<any[]>([]);

  // Hydrate from API once on load / reload
 useEffect(() => {
    setLiveBookings(assignedFromApi ?? []);
}, [assignedFromApi]);
useEffect(() => {
  const onVisible = () => {
    if (document.visibilityState === "visible") {
      refetch();
    }
  };

  window.addEventListener("focus", onVisible);
  document.addEventListener("visibilitychange", onVisible);

  return () => {
    window.removeEventListener("focus", onVisible);
    document.removeEventListener("visibilitychange", onVisible);
  };
}, [refetch]);
useEffect(() => {
  const onVisibilityChange = () => {
    if (document.visibilityState === "visible") {
      // 1. Make sure socket is actually alive, reconnect if not
      const socket = getSocket(BOOKING_NAMESPACE);
      if (socket && !socket.connected) {
        socket.connect();
      }
      // 2. Always refetch truth from server regardless of socket state
      refetch();
    }
  };

  document.addEventListener("visibilitychange", onVisibilityChange);
  return () => document.removeEventListener("visibilitychange", onVisibilityChange);
}, [refetch]);

  // ✅ Single upsert/remove path — used by both the raw socket listeners below
  // AND by WorkModals (via props), so every update lands in the exact same
  // state the grid renders from. No separate store, no separate normalizer,
  // no zustand.
  const upsertLiveBooking = (payload: any, eventName?: string) => {
    const id = getBookingId(payload);
    if (!id) return;

    const tagged = eventName ? { ...payload, eventName } : payload;

    setLiveBookings((prev) => {
      const idx = prev.findIndex((b) => getBookingId(b) === id);
      if (idx === -1) return [...prev, tagged];

      const next = [...prev];
      // Deep-merge the nested `booking` object instead of clobbering it, so a
      // partial socket payload (e.g. one that only sends
      // `{ bookingId, status, startedAt }`) doesn't wipe out fields like
      // `booking.schedule` or `booking.currency` that the grid still needs.
      next[idx] = {
      ...next[idx],
      ...tagged,

      customer:
        tagged.customer ??
        tagged.booking?.customer ??
        next[idx].customer,

      service:
        tagged.service ??
        tagged.booking?.service ??
        next[idx].service,

      workerActions: {
        ...next[idx].workerActions,
        ...tagged.workerActions,
        ...tagged.booking?.workerActions,
      },

      booking: {
        ...next[idx].booking,
        ...tagged.booking,

        workerActions: {
          ...next[idx].booking?.workerActions,
          ...tagged.booking?.workerActions,
        },
      },
       };
      return next;
    });
  };

  const removeLiveBooking = (id: string | undefined) => {
    if (!id) return;
    setLiveBookings((prev) => prev.filter((b) => getBookingId(b) !== id));
  };

  // Live socket updates drive everything after initial hydration
  useEffect(() => {
    const socket = getSocket(BOOKING_NAMESPACE) ?? initializeSocket(BOOKING_NAMESPACE);

    const upsertHandlers = UPSERT_EVENTS.map((event) => {
      const handler = (payload: any) => upsertLiveBooking(payload, event);
      socket.on(event, handler);
      return { event, handler };
    });

    const removeHandlers = REMOVE_EVENTS.map((event) => {
  
      const handler = (payload: any) => removeLiveBooking(getBookingId(payload));
      socket.on(event, handler);
      return { event, handler };
    });

    return () => {
      upsertHandlers.forEach(({ event, handler }) => socket.off(event, handler));
      removeHandlers.forEach(({ event, handler }) => socket.off(event, handler));
    };
  }, []);

  // ✅ No normalizeAssignedWorks — liveBookings already carries the shape
  // WorkGrid needs (work.service / work.customer / work.booking). We just
  // dedupe by id and drop terminal statuses.
  const workList = useMemo(() => {
  const seen = new Set<string>();
  const result: DisplayWork[] = [];

  for (const item of liveBookings) {
    const id = getBookingId(item);
    if (!id || seen.has(id)) continue;

    const status = (item.booking?.status ?? item.status ?? "").toUpperCase();

    if (EXCLUDED_STATUSES.includes(status)) continue;

    const canConfirmCashPayment =
      item.workerActions?.canConfirmCashPayment ??
      item.booking?.workerActions?.canConfirmCashPayment ??
      item.booking?.canConfirmCashPayment ??
      false;

    if (status === "PAYMENT_PENDING" && !canConfirmCashPayment) {
      continue;
    }

    seen.add(id);
    result.push(item as DisplayWork);
  }

  return result;
    }, [liveBookings]);

  // ✅ Timer tick — now reads the real timestamp via resolveStartedAt(), so it
  // works for hydrated jobs, socket-pushed jobs, and locally-started jobs.
  useEffect(() => {
    const interval = window.setInterval(() => {
      const updatedTimers: WorkTimerMap = {};

      workList.forEach((work) => {
        const status = work.booking?.status ?? (work as any).status;
        if (status && FINAL_WORK_STATUSES.includes(status)) return;

        const startedAt = resolveStartedAt(work);
        if (!startedAt) return;

        const elapsedMs = Date.now() - new Date(startedAt).getTime();
        if (Number.isNaN(elapsedMs) || elapsedMs < 0) return;

        const hours = Math.floor(elapsedMs / 3_600_000);
        const minutes = Math.floor((elapsedMs % 3_600_000) / 60_000);
        const seconds = Math.floor((elapsedMs % 60_000) / 1_000);

        const id = getBookingId(work) ?? work.id;
        updatedTimers[id] = [hours, minutes, seconds]
          .map((unit) => String(unit).padStart(2, "0"))
          .join(":");
      });

      setTimers(updatedTimers);
    }, 1_000);

    return () => window.clearInterval(interval);
  }, [workList]);

  useEffect(() => {
    if (selectedWork && !workList.some((w) => getBookingId(w) === getBookingId(selectedWork))) {
      closeModal();
    }
  }, [workList, selectedWork]);

  const openModal = (work: DisplayWork, type: WorkModalType) => {
    setSelectedWork(work);
    setModalType(type);
  };

  const closeModal = () => {
    setSelectedWork(null);
    setModalType(null);
  };

  if (isLoading && liveBookings.length === 0) {
    return (
      <div className="mt-8 px-4 lg:px-6">
        <CommonCard title={t("sidebar.assignedWork")} headerAlign={isRTL ? "right" : "left"}>
          <div className="text-center py-16 text-gray-500">{t("common.noData")}</div>
        </CommonCard>
      </div>
    );
  }

  return (
    <div className="mt-8 px-4 lg:px-6">
      <CommonCard title={t("sidebar.assignedWork")} headerAlign={isRTL ? "right" : "left"}>
        <WorkGrid
          workList={workList}
          isRTL={isRTL}
          categories={categories}
          timers={timers}
          onStart={(work) => openModal(work, "start")}
          onComplete={(work) => openModal(work, "complete")}
          onVerify={(work) => openModal(work, "verify")}
          onCancel={setCancelConfirmWork}
          onConfirmCashPayment={(work) => openModal(work, "confirmCashPayment")}
        />

        <WorkModals
          selectedWork={selectedWork}
          modalType={modalType}
          closeModal={closeModal}
          cancelConfirmWork={cancelConfirmWork}
          setCancelConfirmWork={setCancelConfirmWork}
          cancelMutation={cancelMutation}
         
          onUpsertWork={upsertLiveBooking}
          onRemoveWork={removeLiveBooking}
          onCancelSuccess={(updatedBooking) => {
            const bookingId = updatedBooking?._id;
            if (bookingId) removeLiveBooking(bookingId);
          }}
        />
      </CommonCard>
    </div>
  );
}