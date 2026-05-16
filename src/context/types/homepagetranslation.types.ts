

export type HomePageTranslations = {
  dashboard: string;
  welcome?: string;
 
stats:{
  title: string;
  subtitle: string;
 filters: {
    today: string;
    "7_days": string;
    "30_days": string;
    "3_months": string;
    all: string;
  };

  cards: {
    totalEarned: {
      title: string;
      sub: string;
    };
    currentBalance: {
      title: string;
      sub: string;
    };
    transactions: {
      title: string;
      sub: string;
    };
    avgTransaction: {
      title: string;
      sub: string;
    };
  };

  footer: string;
}
  
  overview?: string;
  totalEmployees?: string;
  activeEmployees?: string;
  inactiveEmployees?: string;
  totalBookings?:string;
  assignedWorks?:string;
  activeProjects?: string;
  completedProjects?: string;
  pendingProjects?: string;
  monthlyRevenue?: string;
  totalRevenue?: string;
  earnings?: string;
  expenses?: string;
  profit?: string;
  notifications?: string;
  recentActivities?: string;
  viewAll?: string;
  online?: string;
  offline?: string;
  quickActions?: string;
  addEmployee?: string;
  createProject?: string;
  viewReports?: string;
  analytics?: string;
  performance?: string;
  completed?: string;
  pending?: string;
  cancelled?: string;
  bookingStatus?: string;
  monthlyBookings?: string;
  revenueTrend?: string;
  noData?: string;
};
