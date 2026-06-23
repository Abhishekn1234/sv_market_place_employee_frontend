import api from "@/api/api";
import type { Work } from "../../domain/entities/work";
import type { AvailableWork } from "../../domain/repositories/AvailableWork";
import { mapApiToWork } from "../../presentation/utils/workstatusmapping";

export class AvailableWorkImpl implements AvailableWork {
  async getWorkList(): Promise<Work[]> {
    const response = await api.get('/booking/get-assigned-booking');
      // console.log(response);
    const rawData = response.data;
    //  console.log(rawData);
    const dataArray = Array.isArray(rawData)
      ? rawData
      : rawData?.data
      ? rawData.data
      : [rawData];
    // console.log(dataArray);
    const works: Work[] = mapApiToWork(dataArray);

    // console.log("Mapped Works:", works);

    return works;
  }
}