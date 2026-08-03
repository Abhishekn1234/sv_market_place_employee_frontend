import type { Worker } from "@/pages/Profile/domain/entities/workertype";
import type { WorkerRepo } from "../../domain/repositories/workerrepo";
import api from "@/api/api";

export  class WorkRepoImpl implements WorkerRepo{
    async updateStatus(status: "online" | "offline"): Promise<Worker | null> {
        const response=await api.post('/worker/update',{status});
        return response.data
    }
  
}