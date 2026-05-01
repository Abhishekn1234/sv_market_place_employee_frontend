import type { DisputesRepo } from "../repositories/DisputesRepo";

export class GetDisputesUsecase {
  private disputesRepo: DisputesRepo;

  constructor(disputesRepo: DisputesRepo) {
    this.disputesRepo = disputesRepo;
  }

  async execute() {
    return await this.disputesRepo.getdisputes();
  }
}