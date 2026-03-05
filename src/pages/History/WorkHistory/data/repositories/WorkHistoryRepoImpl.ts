import api from "@/api/api";
import type { Work } from "../../domain/entities/workhistory";
import type { WorkHistoryRepo } from "../../domain/repositories/WorkHistoryRepo";
import { mapApiToWork } from "../../presentation/mappers/workstatusmapping";

export class WorkHistoryRepoImpl implements WorkHistoryRepo {
  async getWorkList(): Promise<Work[]> {
    const response = await api.get('/booking/get-assigned-booking');
      console.log(response);
    const rawData = response.data;

    const dataArray = Array.isArray(rawData)
      ? rawData
      : rawData?.data
      ? rawData.data
      : [rawData];

    const works: Work[] = mapApiToWork(dataArray);

    console.log("Mapped Works:", works);

    return works;
  }
}