import type { Worker } from "@/pages/Profile/domain/entities/workertype"

export interface WorkerRepo{
      updateStatus(status: "online" | "offline"): Promise<Worker | null> 
     
}