
import { useLanguage } from "@/context/LanguageContext";
import { useHomeCards } from "./data/cards";
export default function HomePage() {
  const cards=useHomeCards();
  const { translations, language } = useLanguage();
  const homeTranslations = translations.HomePage;
  const isRTL = language === "AR";
   return (
    <div className="p-4">
     <div className={`flex items-center justify-between mb-6 ${isRTL ? "flex-row-reverse" : ""}`}>
        <h1 className="text-2xl font-bold">{homeTranslations.dashboard}</h1>
        </div>
       <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 ${isRTL ? "rtl" : ""}`}>
        {(isRTL ? [...cards].reverse() : cards).map((card) => (
          <div key={card.title} className="rounded-5xl border bg-white p-5 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{card.title}</p>
                <p className="text-2xl font-bold mt-1 text-yellow-500">{card.value}</p>
              </div>
               <div className={`h-12 w-12 flex items-center justify-center rounded-xl ${card.bg}`}>
                <card.icon className={`h-6 w-6 ${card.text}`} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
