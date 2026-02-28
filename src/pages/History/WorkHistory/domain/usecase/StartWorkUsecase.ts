import type { Booking } from "@/pages/History/BookingHistory/domain/entities/booking";
import type { Startworkrequest } from "../entities/startwork";
import type { StartWorkRepo } from "../repositories/startworkRepo";

export class StartWorkUsecase{
    private startWorkRepo:StartWorkRepo;
    constructor(startWorkRepo:StartWorkRepo){
        this.startWorkRepo=startWorkRepo;
    }
    execute(request:Startworkrequest):Promise<Booking>{
        return this.startWorkRepo.startWork(request);
    }
}