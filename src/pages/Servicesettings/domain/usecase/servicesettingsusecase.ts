import type {  WorkerPayload } from "../entities/servicesettings";
import type { ServiceSettingRepo } from "../repositories/servicesettingsrepo";

export class ServiceSettingsUseCase {
  private servicesettingsrepo: ServiceSettingRepo;

  constructor(servicesetting: ServiceSettingRepo) {
    this.servicesettingsrepo = servicesetting;
  }

  async execute(data: WorkerPayload) {
   
    return await this.servicesettingsrepo.updatesettings(data);
  }
}
