import { useQuery } from "@tanstack/react-query";
import { WalletRepositoryImpl } from "../../data/repositories/statsrepoImpl";
import type { WalletStatistics, WalletStatisticsPeriod } from "../../domain/entities/statistics";
import { GetMyWalletStatisticsUseCase } from "../../domain/usecase/getstatsusecase";

const repository = new WalletRepositoryImpl();

const useCase = new GetMyWalletStatisticsUseCase(
  repository
);

export const useGetMyWalletStatistics = (
  period: WalletStatisticsPeriod = "all"
) => {
  return useQuery<WalletStatistics>({
    queryKey: ["wallet-statistics", period],

    queryFn: () => useCase.execute(period),

    staleTime: 1000 * 60 * 5,
  });
};