import type {
  WalletTransactionsParams,
  WalletTransactionsResponse,
} from "@/pages/Wallet/domain/entities/wallet";
import type { TransactionRepository } from "../repositories/TransactionRepo";

export class GetWalletTransactionsUseCase {
  private readonly repository: TransactionRepository;

  constructor(repository: TransactionRepository) {
    this.repository = repository;
  }

  execute(
    params?: WalletTransactionsParams
  ): Promise<WalletTransactionsResponse> {
    return this.repository.getWalletTransactions(params);
  }
}