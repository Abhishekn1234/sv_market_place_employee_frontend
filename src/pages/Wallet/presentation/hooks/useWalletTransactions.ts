import { useQuery } from "@tanstack/react-query";
import { WalletRepoImpl } from "../../data/repositories/WalletRepoImpl";
import { GetWalletTransactionsUsecase } from "../../domain/usecase/GetWalletTransactionsUsecase";
import type { WalletTransactionsResponse, WalletTransactionsParams } from "../../domain/entities/wallet";

export function useWalletTransactions(params?: WalletTransactionsParams) {
  const repo = new WalletRepoImpl();
  const usecase = new GetWalletTransactionsUsecase(repo);

  return useQuery<WalletTransactionsResponse>({
    queryKey: ["walletTransactions", params],
    queryFn: () => usecase.execute(params),
  });
}