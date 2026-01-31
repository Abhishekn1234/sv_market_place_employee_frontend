import { useLanguage } from "@/context/LanguageContext";
import { useHomeCards } from "./data/cards";
import { CommonCard } from "@/components/common/CommonCard";

export default function HomePage() {
  const cards = useHomeCards();
  const { translations, language } = useLanguage();
  const homeTranslations = translations.HomePage;

  const isRTL = language === "AR";

  return (
    <div className="w-full p-4 sm:p-6">
      
      <div
        className={`flex items-center justify-between mb-6 ${
          isRTL ? "flex-row-reverse" : ""
        }`}
      >
        <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold">
          {homeTranslations.dashboard}
        </h1>
      </div>

     
      <div
        className={`
          grid w-full max-w-[1600px] mx-auto
          grid-cols-1
          sm:grid-cols-2
          md:grid-cols-3
          lg:grid-cols-2
          xl:grid-cols-2
          2xl:grid-cols-2
          gap-4 sm:gap-5 md:gap-6 lg:gap-8
        `}
        dir={isRTL ? "rtl" : "ltr"}
      >
        {(isRTL ? [...cards].reverse() : cards).map((card) => (
          <CommonCard
            key={card.title}
            className="h-full"
            contentClassName="p-0"
          >
            <div
              className={`flex items-center justify-between p-3 sm:p-4 md:p-5 lg:p-6 ${
                isRTL ? "flex-row-reverse text-right" : "text-left"
              }`}
            >
           
              <div className="min-w-0">
                <p className="text-xs sm:text-sm md:text-base lg:text-base text-gray-500 truncate">
                  {card.title}
                </p>
                <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mt-1 text-yellow-500">
                  {card.value}
                </p>
              </div>

          
              <div
                className={`h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 lg:h-16 lg:w-16 flex items-center justify-center rounded-xl ${card.bg}`}
              >
                <card.icon
                  className={`h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 lg:h-8 lg:w-8 ${card.text}`}
                />
              </div>
            </div>
          </CommonCard>
        ))}
      </div>
    </div>
  );
}
