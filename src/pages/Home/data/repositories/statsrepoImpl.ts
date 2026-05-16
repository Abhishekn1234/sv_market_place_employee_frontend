import api from "@/api/api";
import type { WalletStatistics, WalletStatisticsPeriod } from "../../domain/entities/statistics";
import type { WalletRepository } from "../../domain/repositories/statsrepo";

export class WalletRepositoryImpl implements WalletRepository {
  async getMyStatistics(
    period: WalletStatisticsPeriod = "all"
  ): Promise<WalletStatistics> {
    const response = await api.get(
      "/wallet/me/statistics",
      {
        params: {
          period,
        },
      }
    );

    return response.data;
  }
}