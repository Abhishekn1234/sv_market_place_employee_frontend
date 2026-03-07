import type { BookingResponse } from "../entities/booking";

export interface AvailableBookingRepo{
    getBookingAvailable:(page:number)=>Promise<BookingResponse>
}