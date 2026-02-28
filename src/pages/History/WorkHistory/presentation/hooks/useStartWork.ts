import { useMutation } from "@tanstack/react-query";
import { StartWorkRepoImpl } from "../../data/repositories/StartWorkRepoImpl"
import { StartWorkUsecase } from "../../domain/usecase/StartWorkUsecase";
import type { Startworkrequest } from "../../domain/entities/startwork";
import type { Booking } from "@/pages/History/BookingHistory/domain/entities/booking";

export const useStartWork = () => {
    const repo= new StartWorkRepoImpl();
    const usecase=new StartWorkUsecase(repo);

    return useMutation<Booking, Error, Startworkrequest>({
        mutationKey: ["startWork"],
        mutationFn: (request: Startworkrequest) => usecase.execute(request)
    })
}