import type { BookingResponse } from "../entities/booking";

export interface BookingHistoryRepo{
    getBookingHistory:(page:number)=>Promise<BookingResponse>
}