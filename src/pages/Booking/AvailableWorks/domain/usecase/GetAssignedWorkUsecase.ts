import type { GetBooking } from "@/core/Websocket/domain/entities/getrepo";
import type { AssignedWork } from "../repositories/assignedworkrepo";

export class GetAssignedWorkUsecase {
    private assignedworkrepo: AssignedWork;
    constructor(AssignedWorkRepo: AssignedWork) {
        this.assignedworkrepo = AssignedWorkRepo;
    }
    async execute():Promise<GetBooking>{
        return await this.assignedworkrepo.getAssignedWorks();
    }
}