import type { Booking } from "@/pages/Booking/AvailableBooking/domain/entities/booking";

export type AcceptWork={
    bookingId?:string;
    bookingStatus?:string;
    booking?:Booking;
}