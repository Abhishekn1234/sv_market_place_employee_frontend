import api from "@/api/api";
import type { BookingHistoryQueryParams, BookingHistoryResponse } from "../../domain/entities/bookinghistory";
import type { BookingHistoryRepo } from "../../domain/repositories/BookingHistoryRepo";

export class BookingHistoryImpl implements BookingHistoryRepo {
  async getBookingHistory(params?: BookingHistoryQueryParams): Promise<BookingHistoryResponse> {
    const response = await api.get('/booking/history', { params });
    return response.data;
  }
}