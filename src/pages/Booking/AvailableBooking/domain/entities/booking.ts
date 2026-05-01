import type { ServiceCategory } from "@/pages/Servicesettings/domain/entities/servicecategory";
import type { Pagination } from "./bookingpagination";
import type { BookingStatus } from "./bookingstatus";
import type { ServiceTier } from "@/pages/Servicesettings/domain/entities/servicetier";
import type { GeoPoint } from "@/pages/Profile/domain/entities/location";
import type { PricingTier } from "./pricingtier.types";
import type { Bookingschedule } from "./bookingschedule";

export interface Booking {
  id: string;
   _id?:string;
  clientName: string;
  startDate?:Date;
  clientEmail: string;
  workerPoolAmount?:number;
  numberofWorkers?:number;
  clientPhone?:string;
  clientPhoto?:string;
  serviceType: string;
  amount?:number;
  bookingType?:string;
  date: string;
  time: string;
  duration: number;
  pricingTier?:PricingTier[];
  pricingMode?:"HOURLY" |"PER_DAY";
  currency?:string;
  service?:ServiceCategory | string;
  serviceTier?:ServiceTier | string;
  serviceTierId?:ServiceTier|string;
  schedule?:Bookingschedule;
  numberOfWorkers?:number;
  actualWorkers?:number;
  actualWorkHours?:number;
  actualDays?:number;
  status: BookingStatus;
  payment: number;
  location?: GeoPoint | string;
  notes?: string;
  assignedAt?:string |Date;
  startedAt?:string;
  workStartedAt?:string;
}

export interface BookingResponse{
  data:Booking[];
  pagination:Pagination;
}