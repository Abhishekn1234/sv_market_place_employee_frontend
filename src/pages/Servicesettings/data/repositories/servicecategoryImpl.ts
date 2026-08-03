import api from "@/api/api";
import type { ServiceCategory } from "../../domain/entities/servicecategory";
import type { ServiceCategoryRepo } from "../../domain/repositories/servicecategoryrepo";

export class ServiceCategoryImpl implements ServiceCategoryRepo{
    async getCategoryRepo(): Promise<ServiceCategory[]> {
        const response=await api.get("/categories")
        return response.data
    }
}
