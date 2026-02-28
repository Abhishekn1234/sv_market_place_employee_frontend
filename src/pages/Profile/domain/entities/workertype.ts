import type { GeoPoint } from "./location";
import type { WorkerStatus } from "@/pages/Servicesettings/domain/entities/workerstatus";

export interface Worker {
  categoryIds: string[];
  serviceTierIds: string[];
  location: GeoPoint;
  status: WorkerStatus;
  serviceRadius?:number;
}