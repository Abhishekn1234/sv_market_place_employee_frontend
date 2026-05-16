import type { WalletStatistics, WalletStatisticsPeriod } from "../entities/statistics";
import type { WalletRepository } from "../repositories/statsrepo";

export class GetMyWalletStatisticsUseCase {
  private readonly walletRepository: WalletRepository;

  constructor(walletRepository: WalletRepository) {
    this.walletRepository = walletRepository;
  }

  async execute(
    period: WalletStatisticsPeriod = "all"
  ): Promise<WalletStatistics> {
    return this.walletRepository.getMyStatistics(period);
  }
}