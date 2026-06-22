import api from "@/api/api";
import type { DisputesRepo } from "../../domain/repositories/DisputesRepo";
import type { DisputesRespond } from "../../domain/entities/disputesrespond";

export class DisputesRepoImpl implements DisputesRepo {

  async getdisputes(): Promise<any> {
    const response = await api.get("/disputes/assigned");
    console.log(response);
    return response.data;
  }

  async responddisputes(data: DisputesRespond): Promise<any> {
    const response = await api.post("/disputes/respond", data);
    return response.data;
  }
}