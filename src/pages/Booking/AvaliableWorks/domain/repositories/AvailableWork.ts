import type { Work } from "../entities/work";

export interface AvailableWork{
    getWorkList:()=>Promise<Work[]>
}