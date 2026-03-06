import type { ServiceCategory } from "@/pages/Servicesettings/domain/entities/servicecategory";
import type { Booking } from "./booking";
import type { Customer } from "./customer.types";
import type { ServiceTier } from "@/pages/Servicesettings/domain/entities/servicetier";
import type { BookingStatus } from "./bookingstatus";


export interface BookingHistoryResponse {
  data: BookingHistory[];
  pagination:BookingHistoryPagination;
}
export interface BookingHistoryPagination { totalItems: number; totalPages: number; currentPage: number; hasNextPage: boolean; hasPrevPage: boolean; }
export interface BookingHistoryQueryParams{ page?:number; limit?:number; sort?:string; search?:string; }
export interface BookingHistory{
  _id: string;
  workerId: string;
  bookingId: string;
  status: BookingStatus;
  assignedAt: string;
  startedAt: string;
  completedAt: string;
  booking: Booking;
  service: ServiceCategory;
  serviceTier: ServiceTier;
  customer: Customer;
}

