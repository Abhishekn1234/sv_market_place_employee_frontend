import type { CancelWork } from "../entities/cancelwork";
import type { CancelWorkRepo } from "../repositories/cancelworkrepo";

export class CancelWorkUsecase{
    private cancelworkrepo:CancelWorkRepo;
    constructor(cancelworkrepo:CancelWorkRepo){
        this.cancelworkrepo=cancelworkrepo;
    }
    async execute(data:CancelWork){
        return await this.cancelworkrepo.cancelWork(data);
    }
}