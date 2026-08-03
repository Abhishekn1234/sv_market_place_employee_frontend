import type { ServiceCategory } from "@/pages/Servicesettings/domain/entities/servicecategory";
import type { Pagination } from "./bookingpagination";
import type { BookingStatus } from "./bookingstatus";
import type { ServiceTier } from "@/pages/Servicesettings/domain/entities/servicetier";
import type { GeoPoint } from "@/pages/Profile/domain/entities/location";
import type { PricingTier } from "./pricingtier.types";
import type { Bookingschedule } from "./bookingschedule";
import type { AppliedDiscount, BookingValues, TaxLine } from "@/pages/Booking/AvailableWorks/domain/entities/workPresentation.types";

export interface Booking {
  _id: string;
  id?: string;

  bookingCode?: string;

  userId?: string;
  customerId?: string;
  workerId?: string;
  workerIds?: string[];

  serviceId?: string;
  serviceTierId?: string | ServiceTier;

  bookingType?: "INSTANT" | "SCHEDULED";
  pricingMode?: "HOURLY" | "PER_DAY";

  schedule?: Bookingschedule;

  startDate?: string;

  status: BookingStatus;

  currency?: string;

  amount?: number;
  serviceFee?: number;
  discountAmount?: number;
  taxableAmount?: number;
  totalCost?: number;

  vatRate?: number;
  vatAmount?: number;

  commissionValue?: number;
  commissionType?: "PERCENTAGE" | "FIXED";
  commissionAmount?: number;

  workerPoolAmount?: number;

  memberDiscount?: number;

  numberOfWorkers?: number;
  remainingWorkers?: number;

  distance?: number;

  workDescription?: string;

  isFinalized?: boolean;

    estimatedValues?: BookingValues;
    actualValues?: BookingValues;

    taxLines?: TaxLine[];
    appliedDiscounts?: AppliedDiscount[];
  finalAmount?: number;
  finalWorkerPoolAmount?: number;

  actualWorkHours?: number;
  actualWorkDays?: number;
  actualWorkMinutes?: number;

  startedAt?: string;
  completedAt?: string;

  assignedAt?: string | Date;
  workStartedAt?: string;

  createdAt?: string;
  updatedAt?: string;

  paymentId?: string;
  invoiceId?: string;

  invoiceGeneratedAt?: string;

  service?: ServiceCategory | string;
  serviceTier?: ServiceTier | string;

  customer?: {
    _id: string;
    fullName: string;
    email?: string;
    phone?: string;
    profilePictureUrl?: string;
  };

  assignedWorkers?: any[];

  clientName?: string;
  clientEmail?: string;
  clientPhone?: string;
  clientPhoto?: string;

  serviceType?: string;

  date?: string;
  time?: string;
  duration?: number;

  pricingTier?: PricingTier[];

  payment?: number;

  notes?: string;

  location?: GeoPoint | string;

  payload?: {
    eventName?: string;
    bookingId?: string;
    actorId?: string;
  };

  eventName?: string;
  occurredAt?: string;
  canConfirmCashPayment?:boolean;
  workerActions?: {
    canConfirmCashPayment: boolean;
  };
}

export interface BookingResponse {
  data: Booking[];
  pagination: Pagination;
}