import type {  WorkerPayload } from "../entities/servicesettings";

export interface ServiceSettingRepo{
  updatesettings(data:WorkerPayload):Promise<WorkerPayload>   
}