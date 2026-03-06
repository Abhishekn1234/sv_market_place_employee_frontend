import type {  BookingHistoryQueryParams, BookingHistoryResponse } from "../entities/bookinghistory";

export interface BookingHistoryRepo{
    getBookingHistory:(params?:BookingHistoryQueryParams)=>Promise<BookingHistoryResponse>
}