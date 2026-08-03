import type { Work } from "../entities/work";
import type { AvailableWork } from "../repositories/AvailableWork";

export class WorkHistoryGetUsecase{
  private workHistoryRepo:AvailableWork;
  constructor (workhistory:AvailableWork){
    this.workHistoryRepo=workhistory
  }
  async execute():Promise<Work[]>{
    return this.workHistoryRepo.getWorkList();
  }
     
}