import api from "@/api/api";
import type { AcceptWork } from "../../domain/entities/acceptwork";
import type { AcceptRepository } from "../../domain/repositories/AcceptRepo";

export  class AcceptRepoImpl implements AcceptRepository{
    async acceptStatus(data:AcceptWork):Promise<AcceptWork> {
      const response= await api.post('/booking/update',data);
      console.log(response);
      return response.data;
    }
}