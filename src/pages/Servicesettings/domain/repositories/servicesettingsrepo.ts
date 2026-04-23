import type { WorkerPayload } from "../entities/workerpayload"

export interface ServiceSettingRepo{
  updatesettings(data:WorkerPayload):Promise<WorkerPayload>   
}