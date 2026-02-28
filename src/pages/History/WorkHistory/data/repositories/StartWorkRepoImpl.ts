import type { Booking } from "@/pages/History/BookingHistory/domain/entities/booking";
import type { Startworkrequest } from "../../domain/entities/startwork";
import type { StartWorkRepo } from "../../domain/repositories/startworkRepo";
import api from "@/api/api";

export class StartWorkRepoImpl implements StartWorkRepo{
    async startWork(request: Startworkrequest): Promise<Booking> {
      const response=await api.post('/booking/start-work',  request )
      return response.data;
    }
}