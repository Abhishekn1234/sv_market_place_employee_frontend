import type { BookingHistoryQueryParams } from "../entities/bookinghistory";
import type { BookingHistoryRepo } from "../repositories/BookingHistoryRepo";

export class GetBookingHistoryUsecase{
    private getbookingrepo:BookingHistoryRepo;
    constructor(getbooking:BookingHistoryRepo){
        this.getbookingrepo=getbooking;
    }
    async execute(params?:BookingHistoryQueryParams){
         return this.getbookingrepo.getBookingHistory(params);
    }
}