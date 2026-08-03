import api from "@/api/api";
import type { ServiceTier } from "../../domain/entities/servicetier";
import type { ServiceTierRepo } from "../../domain/repositories/servicetierrepo";

export class ServiceTierImpl implements ServiceTierRepo{
   async getServiceTier(): Promise<ServiceTier[]> {
        const response=await api.get("/services/service-tiers");
        // console.log(response);
        // console.log(response.data);
        return response.data
    }
}
