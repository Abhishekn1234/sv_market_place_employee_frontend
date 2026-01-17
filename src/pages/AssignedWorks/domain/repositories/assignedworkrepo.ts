import type { GetBooking } from "@/core/Websocket/domain/entities/getrepo";

export interface AssignedWork{
    getAssignedWorks():Promise<GetBooking>;
}