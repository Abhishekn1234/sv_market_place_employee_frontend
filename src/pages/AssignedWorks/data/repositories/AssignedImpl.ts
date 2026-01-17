import type { GetBooking } from "@/core/Websocket/domain/entities/getrepo";
import type { AssignedWork } from "../../domain/repositories/assignedworkrepo";
import api from "@/api/api";

export  class AssignedWorkImpl implements AssignedWork{
    async getAssignedWorks():Promise<GetBooking>{
      const response =await api.get('/booking/get-assigned-booking')
      return response.data;
    }
}