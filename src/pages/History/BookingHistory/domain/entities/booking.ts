import type { ServiceCategory } from "@/pages/Servicesettings/domain/entities/servicecategory";
import type { Pagination } from "./bookingpagination";
import type { BookingStatus } from "./bookingstatus";
import type { ServiceTier } from "@/pages/Servicesettings/domain/entities/servicetier";
import type { GeoPoint } from "@/pages/Profile/domain/entities/location";

export interface Booking {
  id: string;
  clientName: string;
  startDate?:Date;
  clientEmail: string;
  clientPhone?:string;
  clientPhoto?:string;
  serviceType: string;
  bookingType?:string;
  date: string;
  time: string;
  duration: number;
  pricingMode?:"HOURLY" |"PER_DAY";
  currency?:string;
  service?:ServiceCategory | string;
  serviceTier?:ServiceTier | string;
  

  status: BookingStatus;
  payment: number;
  location?: GeoPoint | string;
  notes?: string;
}

export interface BookingResponse{
  data:Booking[];
  pagination:Pagination;
}