import type { GeoPoint } from "./location";
import type { WorkerStatus } from "@/pages/Servicesettings/domain/entities/workerstatus";

export interface Worker {
  categoryIds?: string[];
  serviceTierIds?: string[];

  status?: WorkerStatus;

  location?: GeoPoint;

  locationMode?: "CURRENT" | "MANUAL"; // optional (not in API but ok for UI)

  serviceRadius?: number;
}