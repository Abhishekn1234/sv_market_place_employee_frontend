import type { ServiceCategory } from "@/pages/Servicesettings/domain/entities/servicecategory";
import type { Pagination } from "./bookingpagination";
import type { BookingStatus } from "./bookingstatus";
import type { ServiceTier } from "@/pages/Servicesettings/domain/entities/servicetier";
import type { GeoPoint } from "@/pages/Profile/domain/entities/location";
import type { PricingTier } from "./pricingtier.types";
import type { Bookingschedule } from "./bookingschedule";

export interface Booking {
  _id: string;
  id?: string;

  bookingCode?: string;

  userId?: string;

  serviceId?: string;

  serviceTierId?: string | ServiceTier;

  bookingType?: "INSTANT" | "SCHEDULED";

  pricingMode?: "HOURLY" | "PER_DAY";

  schedule?: Bookingschedule;

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

  workDescription?: string;

  isFinalized?: boolean;

  estimatedValues?: any;

  actualValues?: any;

  taxLines?: any[];

  appliedDiscounts?: any[];

  finalAmount?: number;

  finalWorkerPoolAmount?: number;

  actualWorkHours?: number;

  actualWorkDays?: number;

  actualWorkMinutes?: number;

  startedAt?: string;

  completedAt?: string;

  paymentId?: string;

  invoiceId?: string;

  assignedAt?: string | Date;

  service?: ServiceCategory | string;

  serviceTier?: ServiceTier | string;

  customer?: {
    _id: string;
    fullName: string;
    email?: string;
    phone?: string;
    profilePictureUrl?: string;
  };

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
}

export interface BookingResponse {
  data: Booking[];
  pagination: Pagination;
}