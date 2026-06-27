import { useQuery } from "@tanstack/react-query";
import { TransactionHistoryRepositoryImpl } from "../../data/repositories/TransactionHistoryImpl";
import { GetWalletTransactionsUseCase } from "../../domain/usecase/GetTransactionUsecase";
import type { WalletTransactionsParams } from "@/pages/Wallet/domain/entities/wallet";



const repository = new TransactionHistoryRepositoryImpl();
const useCase = new GetWalletTransactionsUseCase(repository);

export const WALLET_TRANSACTIONS_QUERY_KEY = [
  "wallet-transactions",
];

export const useTransactionHistory = (
  params?: WalletTransactionsParams
) => {
  return useQuery({
    queryKey: [...WALLET_TRANSACTIONS_QUERY_KEY, params],
    queryFn: () => useCase.execute(params),
  });
};