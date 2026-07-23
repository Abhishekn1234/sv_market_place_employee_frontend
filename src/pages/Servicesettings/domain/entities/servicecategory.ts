import type { PricingTier } from "@/pages/Booking/AvailableBooking/domain/entities/pricingtier.types";

export interface ServiceCategory{
    _id:string;
    name:string;
    slug?:string;
    iconUrl?:string| File;
    icon?:string|File;
    createdAt?:Date;
    updatedAt?:Date;
    category?:string;
    avgRating?:number;
    pricingTiers?:PricingTier[];
}