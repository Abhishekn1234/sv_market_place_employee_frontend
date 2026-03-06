import type { AvailableBookingRepo } from "../repositories/AvalableBookingRepo";

export class GetBookingAvailableUsecase {
  private getBooking: AvailableBookingRepo;

  constructor(GetBooking: AvailableBookingRepo) {
    this.getBooking = GetBooking;
  }

  async execute(page: number) {
    return this.getBooking.getBookingAvailable(page);
  }
}
