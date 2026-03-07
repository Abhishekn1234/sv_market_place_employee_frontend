import type { Booking } from "@/pages/Booking/AvailableBooking/domain/entities/booking";
import type { WorkStatus } from "@/pages/History/WorkHistory/domain/entities/workstatus";
import type { ServiceCategory } from "@/pages/Servicesettings/domain/entities/servicecategory";
import type { ServiceTier } from "@/pages/Servicesettings/domain/entities/servicetier";

export interface Work {
  _id: string; 
  bookingId?:string;
  status: WorkStatus; 
  assignedAt: string; 
  booking: Booking
  service?:ServiceCategory
  serviceTier?:ServiceTier
  customer?: {
    _id: string;
    fullName: string; 
    phone?: string;
  };    
}
