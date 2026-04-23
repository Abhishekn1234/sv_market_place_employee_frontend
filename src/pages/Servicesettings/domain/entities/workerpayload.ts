import type { GeoPoint } from "@/pages/Profile/domain/entities/location";
import type { WorkerStatus } from "./workerstatus";

export interface WorkerPayload {
  categoryIds?: string[];
  categories?:string[];
  serviceTiers?:string[];
  serviceTierIds?: string[];
  status: WorkerStatus;
  location?: GeoPoint;  
 serviceRadius?:number;
}