import React, { createContext, useContext, useEffect, useState } from "react";
import en from "./en.json";
import ar from "./ar.json";
import hi from "./hi.json";
export type NotificationsTranslations = {
  title: string;
  subtitle: string;
  markAllRead: string;
  clearAll: string;
  total: string;
  unread: string;
  read: string;
  thisWeek: string;
  all: string;
  allCategories: string;
  bookings: string;
  payments: string;
  system: string;
  alerts: string;
  noNotifications: string;
  caughtUp: string;
  viewDetails: string;
  highPriority: string;
  emailDigest: string;
  notificationSettings: string;
  showing: string;
};
export type HomePageTranslations = {
  dashboard: string;
  totalEmployees: string;
  activeProjects: string;
  monthlyRevenue: string;
  notifications: string;
  online: string;
  offline: string;
};

export type RecentActivitiesTranslations = {
  emptyState: {
    title: string;
    description: string;
  };
  periods: {
    "7days": string;
    "15days": string;
    "1month": string;
    "3months": string;
    "6months": string;
  };
  types: {
    booking: string;
    payment: string;
    transaction: string;
    all: string;
  };
  status: {
    completed: string;
    confirmed: string;
    pending: string;
    cancelled: string;
  };
  chart: {
    earningsTrend: string;
    activityType: string;
    statusDistribution: string;
    activityTrend: string;
  };
};
export type WalletTranslations = {
  title: string;
  manage: string;
  tier: string;
  totalBalance: string;
  income: string;
  expenses: string;
  quickActions: string;
  addFunds: string;
  depositMoney: string;
  withdraw: string;
  transferFunds: string;
  recentTransactions: string;
  viewAll: string;
  credit: string;
  debit: string;
  monthlySummary: string;
  totalTransactions: string;
  avgTransaction: string;
  largestIncome: string;
  largestExpense: string;
  paymentMethods: string;
  primary: string;
  expires: string;
  addNewCard: string;
  walletInsights: string;
  availableBalance: string;
  monthlyGrowth: string;
  transactionsToday: string;
};


export type WorkHistoryTranslations = {
  pageTitle: string;
  employeeLabel: string;
  cards: {
    totalWorks: string;
    completed: string;
    inProgress: string;
    upcoming: string;
  };
  filters: {
    timePeriod: string;
    status: string;
    itemsPerPage: string;
    searchPlaceholder: string;
  };
  timeOptions: {
    week: string;
    month: string;
    currentWeek: string;
  };
  statusOptions: {
    all: string;
    completed: string;
    inProgress: string;
    pending: string;
    upcoming: string;
  };
  tableHeaders: {
    title: string;
    description: string;
    location: string;
    assignedDate: string;
    dueDate: string;
    status: string;
    duration: string;
    extraInfo: string;
  };
  pagination: {
    pageInfo: string;
    first: string;
    previous: string;
    next: string;
    last: string;
    noRecords: string;
  };
  extraInfo: {
    daysToStart: string;
    daysUntilDue: string;
    completedOn: string;
    completedIn: string;
  };
};



/* ------------------ TYPES ------------------ */

export type Language = "EN" | "AR" | "HI";

export type TranslationValue = string | { [key: string]: TranslationValue };

export type TranslationSchema = {
  [key: string]: TranslationValue;
  workHistory: WorkHistoryTranslations;
   recentActivities: RecentActivitiesTranslations;
     Wallet: WalletTranslations;   
      Notifications: NotificationsTranslations;
      HomePage: HomePageTranslations; 
};

export type TranslationKey = keyof TranslationSchema;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
  translations: TranslationSchema;
}

/* ------------------ CONTEXT ------------------ */

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

/* ------------------ TRANSLATIONS ------------------ */

const allTranslations: Record<Language, TranslationSchema> = {
  EN: en,
  AR: ar,
  HI: hi,
};

/* ------------------ PROVIDER ------------------ */

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [language, setLanguage] = useState<Language>(
    (localStorage.getItem("lang") as Language) || "EN"
  );

  useEffect(() => {
    localStorage.setItem("lang", language);
    
    document.documentElement.lang =
      language === "AR" ? "ar" : language === "HI" ? "hi" : "en";
  }, [language]);

  const t = (key: TranslationKey): string => {
    const value = allTranslations[language][key];
    return typeof value === "string" ? value : "";
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        translations: allTranslations[language],
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

/* ------------------ HOOK ------------------ */

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
