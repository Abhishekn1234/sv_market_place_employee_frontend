export type GetBooking = {
  _id: string;
  status: "REQUESTED" | "ACCEPTED" | "REJECTED" |"ASSIGNED" | "WORKER_ACCEPTED";
  amount: number;
  currency?: string;

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

