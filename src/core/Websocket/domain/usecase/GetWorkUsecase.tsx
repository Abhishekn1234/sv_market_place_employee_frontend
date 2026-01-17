import type { BookingRepository } from "../repositories/GetRepo";

export class GetAvailableBookingsUseCase {
  private bookingrepo:BookingRepository

 constructor(BookingRepo:BookingRepository){
    this.bookingrepo=BookingRepo
 }
  execute() {
    return this.bookingrepo.getAvailableBookings();
  }
}
