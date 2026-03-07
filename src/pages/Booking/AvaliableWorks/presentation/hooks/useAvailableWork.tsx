import { useQuery } from "@tanstack/react-query";
import { AvailableWorkImpl} from "../../data/repositories/AvailableWork";
import { WorkHistoryGetUsecase } from "../../domain/usecase/GetAvailableWorkUsecase";
import type { Work } from "../../domain/entities/work";

export function useWorkHistory(){
    const repo= new AvailableWorkImpl();
    const usecase=new WorkHistoryGetUsecase(repo);

    return useQuery<Work[],Error>({
        queryKey:["work-history"],
        queryFn:()=>usecase.execute(),
    })
}