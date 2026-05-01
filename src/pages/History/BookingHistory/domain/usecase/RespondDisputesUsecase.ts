import type { DisputesRepo } from "../repositories/DisputesRepo";
import type { DisputesRespond } from "../entities/disputesrespond";

export class RespondDisputesUsecase {
  private disputesRepo: DisputesRepo;

  constructor(disputesRepo: DisputesRepo) {
    this.disputesRepo = disputesRepo;
  }

  async execute(payload: DisputesRespond) {
    return await this.disputesRepo.responddisputes(payload);
  }
}