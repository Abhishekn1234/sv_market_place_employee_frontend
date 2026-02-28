import { useLanguage } from "@/context/LanguageContext";

type Props = {
  employeeName: string;
  employeeTier: "Gold" | "Silver" | "Platinum";
};

const tierColor = (tier: Props["employeeTier"]) => {
  switch (tier) {
    case "Gold":
      return "bg-yellow-100 text-yellow-800";
    case "Silver":
      return "bg-gray-100 text-gray-800";
    case "Platinum":
      return "bg-purple-100 text-purple-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export function WalletHeader({ employeeName, employeeTier }: Props) {
  const { translations, language } = useLanguage();
  const walletT = translations.wallet;
  const isRTL = language === "AR";

  return (
    <div
      className={`flex flex-col gap-2 sm:gap-3 mb-6 sm:mb-8 ${
        isRTL ? "text-right" : "text-left"
      }`}
    >
      {/* Name */}
      <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-400 break-words">
        {employeeName}
      </h1>

      {/* Tier */}
      <div>
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-xs sm:text-sm font-semibold ${tierColor(
            employeeTier
          )}`}
        >
          {walletT.tier}: {employeeTier}
        </span>
      </div>

      {/* Description */}
      <p className="text-sm sm:text-base text-gray-600 max-w-2xl">
        {walletT.manage}
      </p>
    </div>
  );
}
