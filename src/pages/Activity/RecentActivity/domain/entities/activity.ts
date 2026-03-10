import type { ActivityType } from "./activitytype.type";

import type { BookingStatus } from "@/pages/Booking/AvailableBooking/domain/entities/bookingstatus";

export interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: Date;
  status: BookingStatus;
  amount?: number;
  client?: string;
  location?: string;
  currency?:string;
}
