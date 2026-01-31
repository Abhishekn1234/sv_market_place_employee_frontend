import type { Work } from "../entities/workhistory";
import type { WorkHistoryRepo } from "../repositories/WorkHistoryRepo";

export class WorkHistoryGetUsecase{
  private workHistoryRepo:WorkHistoryRepo;
  constructor (workhistory:WorkHistoryRepo){
    this.workHistoryRepo=workhistory
  }
  async execute():Promise<Work[]>{
    return this.workHistoryRepo.getWorkList();
  }
     
}