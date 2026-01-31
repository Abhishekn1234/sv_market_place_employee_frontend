import type { Work } from "../entities/workhistory";

export interface WorkHistoryRepo{
    getWorkList:()=>Promise<Work[]>
}