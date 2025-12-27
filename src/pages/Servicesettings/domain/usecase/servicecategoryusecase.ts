import type { ServiceCategory } from "../entities/servicecategory";
import type { ServiceCategoryRepo } from "../repositories/servicecategoryrepo";

export class ServiceCategoryUsecase {
  private repo: ServiceCategoryRepo;

  constructor(repo: ServiceCategoryRepo) {
    this.repo = repo;
  }

  async getServiceCategories(): Promise<ServiceCategory[]> {
    return this.repo.getCategoryRepo();
  }
}

