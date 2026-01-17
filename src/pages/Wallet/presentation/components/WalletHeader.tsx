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
  const { translations } = useLanguage();
  const walletT = translations.Wallet;

  return (
    <div className="mb-8">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
        {employeeName}
      </h1>

      <p
        className={`mt-1 px-3 py-1 inline-block rounded-full text-sm font-semibold ${tierColor(
          employeeTier
        )}`}
      >
        {walletT.tier}: {employeeTier}
      </p>

      <p className="text-gray-600 mt-2">{walletT.manage}</p>
    </div>
  );
}
