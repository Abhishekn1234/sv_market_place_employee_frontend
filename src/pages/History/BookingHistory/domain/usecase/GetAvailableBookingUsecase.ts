import type { BookingHistoryRepo } from "../repositories/AvalableBookingHistoryRepo";

export class GetBookingHistoryUsecase {
  private getBooking: BookingHistoryRepo;

  constructor(GetBooking: BookingHistoryRepo) {
    this.getBooking = GetBooking;
  }

  async execute(page: number) {
    return this.getBooking.getBookingHistory(page);
  }
}
