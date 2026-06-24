"use client";

import type { Dispatch, SetStateAction } from "react";
import type { UseMutationResult } from "@tanstack/react-query";
import type { ServiceCategory } from "@/pages/Servicesettings/domain/entities/servicecategory";
import type { Booking } from "@/pages/Booking/AvailableBooking/domain/entities/booking";
import type {
  CancelReasonType,
  CancelWork,
} from "../../domain/entities/cancelwork";
import type { Work } from "../../domain/entities/work";

/**
 * ✅ SINGLE SOURCE OF TRUTH STATUS
 */
export type WorkStatus =
  | "UNKNOWN"
  | "ASSIGNED"
  | "WORKER_ACCEPTED"
  | "STARTED"
  | "IN_PROGRESS"
  | "WORK_COMPLETED_PENDING"
  | "COMPLETED"
  | "WORKER_CANCELLED"
  | "WORKER_REJECTED"
  | "CUSTOMER_CANCELLED";

/**
 * Modal types
 */
export type WorkModalType = "start" | "complete" | "verify" | "dispute";

/**
 * Timer map keyed by canonical work id
 */
export type WorkTimerMap = Record<string, string>;

/**
 * Location type
 */
export type WorkLocation =
  | string
  | {
      coordinates?: [number, number];
    };

/**
 * ✅ CORE ENTITY (FIXED)
 * - ONLY ONE ID (id)
 * - ONLY ONE timestamp (startedAt)
 */
export type DisplayWork = Omit<Work, "status" | "location" | "booking"> & {
  id: string; // ✅ SINGLE ID (NO _id anymore)

  status: WorkStatus;

  startedAt?: string; // ✅ SINGLE SOURCE (NO workStartedAt)

  location?: WorkLocation;

  booking?: Booking & {
    location?: WorkLocation;
  };
};

/**
 * Cancel work payload extension
 */
export type CancelableWork = DisplayWork & {
  cancelType?: CancelReasonType;
  cancelledReason?: string;
};

/**
 * ✅ FIXED: NEVER USE Partial HERE
 * Partial causes ghost reappearance + merge bugs
 */
export type WorkGridProps = {
  workList: DisplayWork[]; // ✅ FIXED (was Partial<DisplayWork>[])

  categories?: ServiceCategory[];

  timers: WorkTimerMap;

  onStart: (work: DisplayWork) => void;
  onComplete: (work: DisplayWork) => void;
  onVerify: (work: DisplayWork) => void;
  onCancel: (work: CancelableWork) => void;
  isRTL:boolean;
};

/**
 * Modal props
 */
export type WorkModalsProps = {
  selectedWork: DisplayWork | null;
  modalType: WorkModalType | null;
  closeModal: () => void;

  cancelConfirmWork: CancelableWork | null;
  setCancelConfirmWork: Dispatch<SetStateAction<CancelableWork | null>>;

  cancelMutation: UseMutationResult<unknown, Error, CancelWork, unknown>;

  timers?: WorkTimerMap;

  onCancelSuccess?: (updatedBooking: Booking) => void;
  onCompleteSuccess?: (updatedWork: Work | DisplayWork) => void;
};