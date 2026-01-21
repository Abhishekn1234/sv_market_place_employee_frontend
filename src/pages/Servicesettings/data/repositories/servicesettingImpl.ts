import api from "@/api/api";
import { baseURL } from "@/api/apiConfig";
import type { WorkerPayload } from "../../domain/entities/servicesettings";
import type { ServiceSettingRepo } from "../../domain/repositories/servicesettingsrepo";
import { useAuthStore, type EmployeeUser } from "@/core/store/auth";

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

    
      const updateUserProfile =
        useAuthStore.getState().updateUserProfile;
       const partialuser=response.data as Partial<EmployeeUser>;
      updateUserProfile(partialuser);

      return response.data;
    } catch (error) {
      console.error("Update settings failed", error);
      throw error;
    }
  }
}






