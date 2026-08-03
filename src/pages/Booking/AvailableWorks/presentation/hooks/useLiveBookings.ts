"use client";

import { useEffect, useMemo, useState } from "react";
import { BookingEvents } from "@/components/common/BookingEvents";
import { getSocket, initializeSocket } from "@/core/Websocket/presentation/components/socket";
import {
//   FINAL_WORK_STATUSES,
  getBookingId,
} from "../utils/workPresentation.helpers";
import type { DisplayWork } from "../../domain/entities/workPresentation.types";

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

interface UseLiveWorkBookingsParams {
  assignedFromApi: any[] | undefined;
  refetch: () => void;
}

interface UseLiveWorkBookingsResult {
  workList: DisplayWork[];
  liveBookingsCount: number;
  upsertLiveBooking: (payload: any, eventName?: string) => void;
  removeLiveBooking: (id: string | undefined) => void;
}

/**
 * Owns the "source of truth" list of live bookings:
 * - hydrates from the API result on load / reload
 * - refetches whenever the tab/window regains visibility or focus
 *   (and makes sure the socket reconnects if it dropped)
 * - subscribes to the assigned-updates socket namespace and keeps
 *   liveBookings in sync via a single upsert/remove path
 * - derives the de-duped, non-terminal, display-ready work list
 *
 * upsertLiveBooking / removeLiveBooking are also handed to WorkModals so
 * every update (socket-driven or from a modal action) lands in the exact
 * same state the grid renders from.
 */
export function useLiveWorkBookings({
  assignedFromApi,
  refetch,
}: UseLiveWorkBookingsParams): UseLiveWorkBookingsResult {
  const [liveBookings, setLiveBookings] = useState<any[]>([]);

  // Hydrate from API once on load / reload
  useEffect(() => {
    setLiveBookings(assignedFromApi ?? []);
  }, [assignedFromApi]);

  // Refetch when the tab regains focus/visibility, and make sure the
  // socket is actually alive (reconnect if it dropped) before doing so.
  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        const socket = getSocket(BOOKING_NAMESPACE);
        if (socket && !socket.connected) {
          socket.connect();
        }
        refetch();
      }
    };

    window.addEventListener("focus", onVisibilityChange);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      window.removeEventListener("focus", onVisibilityChange);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [refetch]);

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

        customer: tagged.customer ?? tagged.booking?.customer ?? next[idx].customer,

        service: tagged.service ?? tagged.booking?.service ?? next[idx].service,

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // No normalizeAssignedWorks — liveBookings already carries the shape
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

  return {
    workList,
    liveBookingsCount: liveBookings.length,
    upsertLiveBooking,
    removeLiveBooking,
  };
}