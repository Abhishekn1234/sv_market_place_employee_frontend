import type { GetBooking, PaginatedBookings } from "../entities/getrepo";

export interface BookingRepository {
  getAvailableBookings(): Promise<PaginatedBookings<GetBooking>>;
}
