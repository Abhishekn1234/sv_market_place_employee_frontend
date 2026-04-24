import { useLanguage } from "@/context/LanguageContext";

type Props = {
  employeeName: string;
  
};



export function WalletHeader({ employeeName }: Props) {
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
      <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold  break-words">
        {employeeName}
      </h1>

      {/* Tier */}
   

      {/* Description */}
      <p className="text-sm sm:text-base text-gray-600 max-w-2xl">
        {walletT.manage}
      </p>
    </div>
  );
}
