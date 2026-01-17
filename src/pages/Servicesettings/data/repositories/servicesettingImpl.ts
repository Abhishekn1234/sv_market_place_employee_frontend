import api from "@/api/api";
import { baseURL } from "@/api/apiConfig";
import type { WorkerPayload } from "../../domain/entities/servicesettings";
import type { ServiceSettingRepo } from "../../domain/repositories/servicesettingsrepo";
import { useAuthStore } from "@/core/store/auth";

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

      /**
       * ✅ Update Zustand Auth Store
       * ❌ No localStorage
       * ❌ No UI logic
       */
      const updateUserProfile =
        useAuthStore.getState().updateUserProfile;

      updateUserProfile(data);

      return response.data;
    } catch (error) {
      console.error("Update settings failed", error);
      throw error;
    }
  }
}






