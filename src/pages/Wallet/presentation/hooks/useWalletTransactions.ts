import { useQuery } from "@tanstack/react-query";
import { WalletRepoImpl } from "../../data/repositories/WalletRepoImpl";
import { GetWalletUsecase } from "../../domain/usecase/GetWalletUsecase";
import type { WalletSummary } from "../../domain/entities/wallet";

export function useWallet() {
  const repo = new WalletRepoImpl();
  const usecase = new GetWalletUsecase(repo);

  return useQuery<WalletSummary>({
    queryKey: ["walletSummary"],
    queryFn: () => usecase.execute(),
  });
}
