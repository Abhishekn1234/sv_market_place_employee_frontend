"use client";

import { useEffect, useState } from "react";
import {
  FINAL_WORK_STATUSES,
  getBookingId,
} from "../utils/workPresentation.helpers";
import type { DisplayWork, WorkTimerMap } from "../../domain/entities/workPresentation.types";

function resolveStartedAt(work: any): string | null {
  return (
    work?.workStartedAt ??
    work?.startedAt ??
    work?.booking?.startedAt ??
    work?.booking?.workStartedAt ??
    null
  );
}

/**
 * Ticks every second and builds a map of bookingId -> "HH:MM:SS" elapsed
 * time for every work item that has started but isn't in a final status.
 * Works for hydrated jobs, socket-pushed jobs, and locally-started jobs,
 * since it reads the real timestamp via resolveStartedAt() rather than
 * relying on local component state.
 */
export function useWorkTimers(workList: DisplayWork[]): WorkTimerMap {
  const [timers, setTimers] = useState<WorkTimerMap>({});

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

  return timers;
}