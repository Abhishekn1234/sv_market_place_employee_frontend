import api from "@/api/api";
import type { Work } from "../../domain/entities/workhistory";
import type { WorkHistoryRepo } from "../../domain/repositories/WorkHistoryRepo";
import { mapApiToWork } from "../../presentation/mappers/workstatusmapping";

export class WorkHistoryRepoImpl implements WorkHistoryRepo {
  async getWorkList(): Promise<Work[]> {
    const response = await api.get('/booking/get-assigned-booking');
    const data = response.data;
   console.log(data);
    
    const works: Work[] = mapApiToWork(data);

    console.log("Mapped Works:", works);
    return works;
  }
}
