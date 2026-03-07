import type { CancelWorkRepo } from "../repositories/cancelworkrepo";

export class CancelWorkUsecase{
    private cancelworkrepo:CancelWorkRepo;
    constructor(cancelworkrepo:CancelWorkRepo){
        this.cancelworkrepo=cancelworkrepo;
    }
    async execute(bookingId:string){
        return await this.cancelworkrepo.cancelWork(bookingId);
    }
}