import type { AcceptWork } from "../entities/acceptwork";


export interface AcceptRepository{
    acceptStatus(data:AcceptWork):Promise<AcceptWork>;
}