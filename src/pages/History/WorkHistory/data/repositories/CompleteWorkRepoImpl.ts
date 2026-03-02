import api from "@/api/api";

import type { CompleteWorkRepo } from "../../domain/repositories/CompleteWorkRepo";
import type { Booking } from "@/pages/History/BookingHistory/domain/entities/booking";
import type { CompleteWork } from "../../domain/entities/completework";

export class CompleteWorkRepoImpl implements CompleteWorkRepo{
    async completeworkotp(data:CompleteWork ): Promise<Booking> {
       const response=await api.post('/booking/complete-work',data)
        return response.data; 
    }
}