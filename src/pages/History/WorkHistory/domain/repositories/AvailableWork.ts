import type { Work } from "../entities/workhistory";

export interface AvailableWork{
    getWorkList:()=>Promise<Work[]>
}