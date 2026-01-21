import type { BookingRepository } from "../../domain/repositories/GetRepo";
import api from "@/api/api";
import type { GetBooking, PaginatedBookings } from "../../domain/entities/getrepo";
export class BookingRepositoryImpl implements BookingRepository {
  async getAvailableBookings(): Promise<PaginatedBookings<GetBooking>> {
  const res = await api.get("/booking/available");

  const payload = res.data;

  return {
    data: payload.data,
    pagination: payload.pagiation, 
  };
}

}
