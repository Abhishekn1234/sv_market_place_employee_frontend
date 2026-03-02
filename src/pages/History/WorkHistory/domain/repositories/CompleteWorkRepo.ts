import type { Booking } from "@/pages/History/BookingHistory/domain/entities/booking";
import type { CompleteWork } from "../entities/completework";


export interface CompleteWorkRepo{
    completeworkotp:(data:CompleteWork)=>Promise<Booking>
}