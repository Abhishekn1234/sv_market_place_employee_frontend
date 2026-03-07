import type { Booking } from "@/pages/Booking/AvailableBooking/domain/entities/booking";
import type { Startworkrequest } from "../../../../Booking/AvaliableWorks/domain/entities/startwork";

export interface StartWorkRepo{
    startWork:(request:Startworkrequest)=>Promise<Booking>
}