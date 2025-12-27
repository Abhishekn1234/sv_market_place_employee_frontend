import api from "@/api/api";
import { baseURL } from "@/api/apiConfig";
import type {  WorkerPayload } from "../../domain/entities/servicesettings";
import type { ServiceSettingRepo } from "../../domain/repositories/servicesettingsrepo";

export class ServiceSettingsRepoimpl implements ServiceSettingRepo {
  async updatesettings(data: WorkerPayload): Promise<WorkerPayload> {
    try {
      const response = await api.post(`${baseURL}worker/update`, data, {
        headers: { "Content-Type": "application/json" },
      });

      // --- Update localStorage ---
      const storedData = localStorage.getItem("employeeData");
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        // Merge updated data inside employeeData.user
        parsedData.user = {
          ...parsedData.user,
          ...data, // this spreads all values from WorkerPayload
        };
        localStorage.setItem("employeeData", JSON.stringify(parsedData));
      } else {
        // If nothing exists, create a new structure
        localStorage.setItem(
          "employeeData",
          JSON.stringify({ user: { ...data } })
        );
      }

      return response.data;
    } catch (error) {
      console.error("Update settings failed", error);
      throw error;
    }
  }
}





