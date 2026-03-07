import type { GetBooking } from "@/core/Websocket/domain/entities/getrepo";

export interface CancelWorkRepo{
    cancelWork(bookingId:string):Promise<GetBooking>;
}