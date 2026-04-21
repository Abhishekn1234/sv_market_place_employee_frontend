import type { GetBooking } from "@/core/Websocket/domain/entities/getrepo";
import type { CancelWork } from "../entities/cancelwork";

export interface CancelWorkRepo{
    cancelWork(data:CancelWork):Promise<GetBooking>;
}