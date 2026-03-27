import type { GeoPoint } from "@/pages/Profile/domain/entities/location";
import type { WorkerStatus } from "@/pages/Servicesettings/domain/entities/workerstatus";

export type GetBooking = {
  _id: string;
  status: WorkerStatus;
  amount: number;
  currency?: string;
  location?:GeoPoint
  bookingType?: "INSTANT" | "SCHEDULED";
  pricingMode?: "HOURLY" | "FIXED";
  distance?: number;

  customer?: {
    _id: string;
    fullName?: string;
    phone?: string;
    profilePictureUrl?: string;
  };

  service?: {
    _id: string;
    name?: string;
    category?: string;
  };

  serviceTier?: {
    _id: string;
    code?: string;
    displayName?: string;
  };

  createdAt?: string;
  updatedAt?: string;
};


export type PaginatedBookings<T> = {
  data: T[];
  pagination: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
};

