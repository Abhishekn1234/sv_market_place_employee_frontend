import { useQuery } from "@tanstack/react-query";
import { WorkHistoryRepoImpl } from "../../data/repositories/WorkHistoryRepoImpl";
import { WorkHistoryGetUsecase } from "../../domain/usecase/WorkHistoryRepoUsecase";
import type { Work } from "../../domain/entities/workhistory";

export function useWorkHistory(){
    const repo= new WorkHistoryRepoImpl();
    const usecase=new WorkHistoryGetUsecase(repo);

    return useQuery<Work[],Error>({
        queryKey:["work-history"],
        queryFn:()=>usecase.execute(),
    })
}