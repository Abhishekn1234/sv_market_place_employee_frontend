import type { GetBooking } from "@/core/Websocket/domain/entities/getrepo";
import type { CancelWorkRepo } from "../../domain/repositories/cancelworkrepo";
import api from "@/api/api";
import type { CancelWork } from "../../domain/entities/cancelwork";

export class CancelImpl implements CancelWorkRepo {
  async cancelWork(data:CancelWork): Promise<GetBooking> {
    const response = await api.post("/booking/cancel", data);
    return response.data;
  }
}
