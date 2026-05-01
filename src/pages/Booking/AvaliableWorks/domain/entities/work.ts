import type { Booking } from "@/pages/Booking/AvailableBooking/domain/entities/booking";
import type { Invoice } from "./invoice";
import type { ServiceTier } from "@/pages/Servicesettings/domain/entities/servicetier";
import type { BookingStatus } from "@/pages/Booking/AvailableBooking/domain/entities/bookingstatus";
import type { PricingTier } from "@/pages/Booking/AvailableBooking/domain/entities/pricingtier.types";
import type { GeoPoint } from "@/pages/Profile/domain/entities/location";
import type { ServiceCategory } from "@/pages/Servicesettings/domain/entities/servicecategory";

export interface Work {
  _id: string;
  id?: string;
  bookingId?: string;
  status: BookingStatus;
  assignedAt: string;
  workStartedAt?: Date | string | null;
  elapsedTime?: string;
  workElapsedTime?: string;
  location?: GeoPoint | string;
  workerPoolAmount?: number;
  numberOfWorkers?: number;
  pricingMode?: PricingTier;
  service?: ServiceCategory;
  serviceTier?: ServiceTier;
  invoice?: Invoice;
  customer?: {
    _id: string;
    fullName: string;
    phone?: string;
  };
  booking: Booking;
}
