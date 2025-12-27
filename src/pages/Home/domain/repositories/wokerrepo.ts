import type { Worker } from "@/pages/Profile/domain/entities/profile"

export interface WorkerRepo{
      updateStatus(status: "online" | "offline"): Promise<Worker | null> 
     
}