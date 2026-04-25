import type { Booking } from "@/pages/Booking/AvailableBooking/domain/entities/booking";
import type { BookingStatus } from "@/pages/Booking/AvailableBooking/domain/entities/bookingstatus";

import type { ServiceCategory } from "@/pages/Servicesettings/domain/entities/servicecategory";
import type { ServiceTier } from "@/pages/Servicesettings/domain/entities/servicetier";
import type { Invoice } from "./invoice";
import type { PricingTier } from "@/pages/Booking/AvailableBooking/domain/entities/pricingtier.types";

export interface Work {
  _id: string; 
  bookingId?:string;
  status: BookingStatus; 
  assignedAt: string; 
   workStartedAt?:Date | null | string |undefined;
   elapsedTime?:string;
  workElapsedTime?: string;
  booking: Booking
  pricingMode?:PricingTier
  service?:ServiceCategory
  serviceTier?:ServiceTier
  invoice?:Invoice;
  customer?: {
    _id: string;
    fullName: string; 
    phone?: string;
  };    
}
