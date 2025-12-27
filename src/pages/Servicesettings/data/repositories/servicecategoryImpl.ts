import api from "@/api/api";
import type { ServiceCategory } from "../../domain/entities/servicecategory";
import type { ServiceCategoryRepo } from "../../domain/repositories/servicecategoryrepo";
import { baseURL } from "@/api/apiConfig";

export class ServiceCategoryImpl implements ServiceCategoryRepo{
    async getCategoryRepo(): Promise<ServiceCategory[]> {
        const response=await api.get(`${baseURL}categories`)
        return response.data
    }
}