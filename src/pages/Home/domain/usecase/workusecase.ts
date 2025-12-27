import type { Worker } from "@/pages/Profile/domain/entities/profile";
import type { WorkerRepo } from "../repositories/wokerrepo";

export class WorkUsecase {
    private workerrepo: WorkerRepo;

    // Constructor should accept an instance of WorkerRepo
    constructor(workerRepo: WorkerRepo) {
        this.workerrepo = workerRepo;
    }

    // Execute method expects a status and returns a Promise of Worker
    async execute(status: "online"|"offline"): Promise<Worker | null> {
        // Assuming your WorkerRepo has a method `updateStatus`
        return this.workerrepo.updateStatus(status);
    }
}
