import type { Booking } from "@/pages/History/BookingHistory/domain/entities/booking";
import type { Startworkrequest } from "../entities/startwork";

export interface StartWorkRepo{
    startWork:(request:Startworkrequest)=>Promise<Booking>
}