import type { Booking } from "@/pages/Booking/AvailableBooking/domain/entities/booking";
import type { CompleteWork } from "../../../../Booking/AvaliableWorks/domain/entities/completework";


export interface CompleteWorkRepo{
    completeworkotp:(data:CompleteWork)=>Promise<Booking>
}