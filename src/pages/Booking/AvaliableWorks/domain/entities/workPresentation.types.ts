import type { Dispatch, SetStateAction } from "react";
import type { UseMutationResult } from "@tanstack/react-query";
import type { ServiceCategory } from "@/pages/Servicesettings/domain/entities/servicecategory";
import type { Booking } from "@/pages/Booking/AvailableBooking/domain/entities/booking";
import type {
  CancelReasonType,
  CancelWork,
} from "./cancelwork";
import type { Work } from "./work";
import type { Bookingschedule } from "@/pages/Booking/AvailableBooking/domain/entities/bookingschedule";

/**
 * ============================================
 * STATUS
 * ============================================
 */

export type WorkStatus =
  | "UNKNOWN"

  // Booking
  | "CREATED"
  | "ACCEPTED"
  | "ASSIGNED"
  | "FINALIZED"
  | "REVIEWED"
  | "EXPIRED"

  // Worker
  | "WORKER_ACCEPTED"
  | "WORKER_REJECTED"
  | "WORKER_STARTED"
  | "WORKER_COMPLETED"

  // Work
  | "WORK_START_OTP_GENERATED"
  | "WORK_STARTED"
  | "STARTED"
  | "IN_PROGRESS"
  | "WORK_COMPLETED_BY_WORKER"
  | "WORK_COMPLETED_PENDING"
  | "COMPLETION_OTP_GENERATED"
  | "COMPLETION_CONFIRMED"

  // Multi-worker
  | "ALL_WORKERS_STARTED"
  | "ALL_WORKERS_COMPLETED"

  // Invoice / Payment
  | "INVOICE_GENERATED"
  | "PAYMENT_PENDING"
  | "PENDING"
  | "PARTIALLY_PAID"
  | "PAYMENT_INITIATED"
  | "PAYMENT_COMPLETED"
  | "PAYMENT_FAILED"
  | "PAID"
  | "REFUNDED"

  // Final
  | "COMPLETED"

  // Cancel
  | "WORKER_CANCELLED"
  | "CUSTOMER_CANCELLED"
  | "ADMIN_CANCELLED"
  | "CANCELLED"
  | "CANCELLED_BY_CUSTOMER"
  | "CANCELLED_BY_WORKER"
  | "CANCELLED_BY_PLATFORM";

/**
 * ============================================
 * MODALS
 * ============================================
 */

export type WorkModalType =
  | "start"
  | "complete"
  | "verify"
  | "dispute"
  | "confirmCashPayment";

export type WorkTimerMap = Record<string, string>;

export type WorkLocation =
  | string
  | {
      type?: "Point";
      coordinates?: [number, number];
    };

/**
 * ============================================
 * BOOKING VALUE TYPES
 * ============================================
 */

export interface TaxLine {
  name: string;
  taxType: string;
  rate: number;
  taxableAmount: number;
  amount: number;
}

export interface AppliedDiscount {
  id?: string;
  name?: string;
  type?: string;
  value?: number;
  amount?: number;
}

export interface BookingValues {
  workHours: number;
  workDays: number;
  noOfWorkers: number;
  amount: number;
  serviceFee: number;
  discountAmount: number;
  taxableAmount: number;
  vatRate: number;
  vatAmount: number;
  taxLines: TaxLine[];
  commissionAmount: number;
  workerPoolAmount: number;
  finalAmount: number;
  appliedDiscounts: AppliedDiscount[];
}

/**
 * ============================================
 * PAYMENT
 * ============================================
 */

export interface PendingCashPayment {
  _id: string;
  bookingId: string;
  invoiceId: string;
  userId: string;
  amount: number;
  remainingAmount: number;
  currency: string;
  paymentMethod: string;
  paymentFlowMode: string;
  status: string;
  initiatedAt: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * ============================================
 * SERVICE
 * ============================================
 */

export interface DisplayService {
  _id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  currency: string;
  pricingTiers: {
    tierId: string;
    HOURLY: {
      ratePerHour: number;
    };
    PER_DAY: {
      ratePerDay: number;
    };
    commissionType: string;
    commissionValue: number;
    _id: string;
  }[];
  isActive: boolean;
  avgRating: number;
  totalRatings: number;
  createdAt: string;
  updatedAt: string;
  iconPublicId: string;
  iconUrl: string;
  thumbnailPublicId: string;
  thumbnailUrl: string;
  vatRate: number;
}

export interface DisplayServiceTier {
  _id: string;
  code: string;
  displayName: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  features: string;
}

/**
 * ============================================
 * CUSTOMER
 * ============================================
 */

export interface DisplayCustomer {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
}

/**
 * ============================================
 * DISPLAY WORK
 * ============================================
 */

export type DisplayWork = Omit<
  Work,
  | "status"
  | "location"
  | "booking"
  | "service"
  | "serviceTier"
  | "customer"
> & {
  id: string;

  status: WorkStatus;

  workStartedAt?: string;

  location?: WorkLocation;

  workerActions?: {
    canConfirmCashPayment: boolean;
  };
  schedule?:Bookingschedule;

  pendingCashPayment?: PendingCashPayment;

  service?: DisplayService;

  serviceTier?: DisplayServiceTier;

  customer?: DisplayCustomer;

  booking?: Booking & {
    location?: WorkLocation;
    estimatedValues?: BookingValues;
    actualValues?: BookingValues;
  };
};

/**
 * ============================================
 * CANCELABLE WORK
 * ============================================
 */

export type CancelableWork = DisplayWork & {
  cancelType?: CancelReasonType;
  cancelledReason?: string;
};

/**
 * ============================================
 * GRID PROPS
 * ============================================
 */

export interface WorkGridProps {
  workList: DisplayWork[];

  categories?: ServiceCategory[];

  timers: WorkTimerMap;

  onStart: (work: DisplayWork) => void;

  onComplete: (work: DisplayWork) => void;

  onVerify: (work: DisplayWork) => void;

  onCancel: (work: CancelableWork) => void;

  onConfirmCashPayment: (work: DisplayWork) => void;

  isRTL: boolean;
}

/**
 * ============================================
 * MODAL PROPS
 * ============================================
 */

export interface WorkModalsProps {
  selectedWork: DisplayWork | null;

  modalType: WorkModalType | null;

  closeModal: () => void;

  cancelConfirmWork: CancelableWork | null;

  setCancelConfirmWork: Dispatch<
    SetStateAction<CancelableWork | null>
  >;

  cancelMutation: UseMutationResult<
    unknown,
    Error,
    CancelWork,
    unknown
  >;

  timers?: WorkTimerMap;

  onCancelSuccess?: (updatedBooking: Booking) => void;

  onCompleteSuccess?: (updatedWork: Work | DisplayWork) => void;

  // ✅ replace useBookingSocketStore's upsertAssigned/removeAssigned —
  // WorkModals writes straight into the page's own liveBookings state.
  onUpsertWork?: (work: any, eventName?: string) => void;

  onRemoveWork?: (id: string | undefined) => void;
}