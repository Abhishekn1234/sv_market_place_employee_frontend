import api from "@/api/api";
import type { ServiceTier } from "../../domain/entities/servicetier";
import type { ServiceTierRepo } from "../../domain/repositories/servicetierrepo";
import { baseURL } from "@/api/apiConfig";

export class ServiceTierImpl implements ServiceTierRepo{
   async getServiceTier(): Promise<ServiceTier[]> {
        const response=await api.get(`${baseURL}services/service-tiers`);
        return response.data
    }
}