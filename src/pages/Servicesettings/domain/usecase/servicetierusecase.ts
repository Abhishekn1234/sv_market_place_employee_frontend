import type { ServiceTier } from "../entities/servicetier";
import type { ServiceTierRepo } from "../repositories/servicetierrepo";

export class ServiceTierUsecase {
  private repo: ServiceTierRepo;

  constructor(repo: ServiceTierRepo) {
    this.repo = repo;
  }

  async execute(): Promise<ServiceTier[]> {
    return this.repo.getServiceTier();
  }
}
