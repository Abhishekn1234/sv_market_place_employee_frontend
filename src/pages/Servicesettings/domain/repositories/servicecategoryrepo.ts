import type { ServiceCategory } from "../entities/servicecategory";

export interface ServiceCategoryRepo{
    getCategoryRepo():Promise<ServiceCategory[]>
}