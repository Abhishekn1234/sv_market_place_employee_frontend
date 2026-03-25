import type { Booking } from "@/pages/Booking/AvailableBooking/domain/entities/booking";
import type { BookingStatus } from "@/pages/Booking/AvailableBooking/domain/entities/bookingstatus";

import type { ServiceCategory } from "@/pages/Servicesettings/domain/entities/servicecategory";
import type { ServiceTier } from "@/pages/Servicesettings/domain/entities/servicetier";

export interface Work {
  _id: string; 
  bookingId?:string;
  status: BookingStatus; 
  assignedAt: string; 
   workStartedAt?:Date | null | string |undefined;
   elapsedTime?:string;
  workElapsedTime?: string;
  booking: Booking
  service?:ServiceCategory
  serviceTier?:ServiceTier
  customer?: {
    _id: string;
    fullName: string; 
    phone?: string;
  };    
}
