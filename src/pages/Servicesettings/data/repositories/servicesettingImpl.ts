import api from "@/api/api";
import { baseURL } from "@/api/apiConfig";
import type { WorkerPayload } from "../../domain/entities/workerpayload";
import type { ServiceSettingRepo } from "../../domain/repositories/servicesettingsrepo";
import { useAuthStore} from "@/core/store/auth";

export class ServiceSettingsRepoimpl implements ServiceSettingRepo {
  async updatesettings(data: WorkerPayload): Promise<WorkerPayload> {
    try {
      const response = await api.post(
        `${baseURL}/worker/update`,
        data,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

    
      const updateWorker = useAuthStore.getState().updateWorker;

updateWorker({
  status: response.data.status,
  serviceTierIds: response.data.serviceTierIds,
  categoryIds: response.data.categoryIds,
  serviceRadius: response.data.serviceRadius,
  location: response.data.location,
});
      return response.data;
    } catch (error) {
      console.error("Update settings failed", error);
      throw error;
    }
  }
}






