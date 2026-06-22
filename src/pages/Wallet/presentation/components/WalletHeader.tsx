import { useLanguage } from "@/context/presentation/components/LanguageContext";
import type { WalletSummary } from "../../domain/entities/wallet";

type Props = {
  employeeName: string;
  wallet?: WalletSummary;
};

export function WalletHeader({ employeeName, wallet }: Props) {
  const { translations, language } = useLanguage();
  const walletT = translations.wallet;
  const isRTL = language === "AR";
  const statusText = wallet
    ? `${wallet.currency ?? "USD"} ${walletT.title}`
    : walletT.title;

  return (
    <div
      className={`flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 ${
        isRTL ? "text-right" : "text-left"
      }`}
    >
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-slate-600 dark:text-slate-400">
          {walletT.title}
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            {employeeName}
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-400">
            {walletT.manage}
          </p>
        </div>
      </div>

      {wallet && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 text-sm font-semibold text-slate-800 dark:text-slate-100 shadow-sm">
          {statusText}
        </div>
      )}
    </div>
  );
}
