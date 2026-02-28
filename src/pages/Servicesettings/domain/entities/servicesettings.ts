import type { ApiDocument } from "@/pages/Profile/domain/entities/documents";
import type { GeoPoint } from "@/pages/Profile/domain/entities/location";
import type { WorkerStatus } from "./workerstatus";

export interface WorkerPayload {
  categoryIds?: string[];
  serviceTierIds?: string[];
  status: WorkerStatus | string;
  location?: GeoPoint;  
 serviceRadius?:number;
}


export interface ServiceSettings {
  servicetier?: string[];
  servicecategory?: string[];
  _id?: string;
  accessToken?: string;
  documents?: ApiDocument[];
  worker?: WorkerPayload;  
  location?:GeoPoint;
  serviceRadius?:number;
}
