import type { Dispatch, SetStateAction } from "react";
import type { UseMutationResult } from "@tanstack/react-query";
import type { ServiceCategory } from "@/pages/Servicesettings/domain/entities/servicecategory";
import type { Booking } from "@/pages/Booking/AvailableBooking/domain/entities/booking";
import type { CancelReasonType, CancelWork } from "../../domain/entities/cancelwork";
import type { Work } from "../../domain/entities/work";

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


export type WorkModalType = "start" | "complete" | "verify" | "dispute";

export type WorkTimerMap = Record<string, string>;

export type WorkLocation =
  | string
  | {
      coordinates?: [number, number];
    };

export type DisplayWork = Omit<Work, "status" | "location" | "booking"> & {
  id: string;
  _id: string;
  status: WorkStatus;
  startedAt?: string;
  location?: WorkLocation;
  booking?: Booking & {
    location?: WorkLocation;
  };
};

export type CancelableWork = DisplayWork & {
  cancelType?: CancelReasonType;
  cancelledReason?: string;
};

export type WorkGridProps = {
  workList: Array<Partial<DisplayWork>>;
  categories?: ServiceCategory[];
  timers: WorkTimerMap;
  onStart: (work: DisplayWork) => void;
  onComplete: (work: DisplayWork) => void;
  onVerify: (work: DisplayWork) => void;
  onCancel: (work: CancelableWork) => void;
};

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
