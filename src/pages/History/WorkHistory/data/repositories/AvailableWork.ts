import api from "@/api/api";
import type { Work } from "../../domain/entities/workhistory";
import type { AvailableWork } from "../../domain/repositories/AvailableWork";
import { mapApiToWork } from "../../presentation/mappers/workstatusmapping";

export class AvailableWorkImpl implements AvailableWork {
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