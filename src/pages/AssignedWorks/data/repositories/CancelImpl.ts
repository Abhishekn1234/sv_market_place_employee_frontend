import type { GetBooking } from "@/core/Websocket/domain/entities/getrepo";
import type { CancelWorkRepo } from "../../domain/repositories/cancelworkrepo";
import api from "@/api/api";

export class CancelImpl implements CancelWorkRepo {
  async cancelWork(bookingId: string): Promise<GetBooking> {
    const response = await api.post("/booking/cancel", { bookingId });
    return response.data;
  }
}
