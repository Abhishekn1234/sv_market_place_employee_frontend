import type { ApiDocument } from "@/pages/Profile/domain/entities/documents";
import type { GeoPoint } from "@/pages/Profile/domain/entities/profile";

export interface WorkerPayload {
  categoryIds?: string[];
  serviceTierIds?: string[];
  status?: "ONLINE" | "OFFLINE" | "BLOCKED" | "IN_SERVICE" | "WAITING_DOCUMENTS" | "PENDING_APPROVAL" | "REJECTED";
  location?: GeoPoint;  // ✅ location goes here
 serviceRadius?:number;
}


export interface ServiceSettings {
  servicetier?: string[];
  servicecategory?: string[];
  _id?: string;
  accessToken?: string;
  documents?: ApiDocument[];
  worker?: WorkerPayload;  // ✅ object, not string[]
  location?:GeoPoint;
  serviceRadius?:number;
}
