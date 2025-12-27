import type { ServiceTier } from "../entities/servicetier";

export interface ServiceTierRepo{
    getServiceTier():Promise<ServiceTier[]>
}