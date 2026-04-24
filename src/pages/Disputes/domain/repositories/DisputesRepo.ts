import type { DisputesRespond } from "../entities/disputesrespond";

export interface DisputesRepo{
    getdisputes:()=>Promise<any>;

    responddisputes:(data:DisputesRespond)=>Promise<any>;
}