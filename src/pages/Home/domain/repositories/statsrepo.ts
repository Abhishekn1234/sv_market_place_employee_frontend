import type { WalletStatistics, WalletStatisticsPeriod } from "../entities/statistics";

export interface WalletRepository {
  getMyStatistics(
    period?: WalletStatisticsPeriod
  ): Promise<WalletStatistics>;
}