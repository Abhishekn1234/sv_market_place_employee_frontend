import type { BookingStatus } from "./bookingstatus";

export interface Booking {
  id: string;
  clientName: string;
  clientEmail: string;
  serviceType: string;
  date: string;
  time: string;
  duration: number;
  status: BookingStatus;
  payment: number;
  location: string;
  notes?: string;
}