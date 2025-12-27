import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  DollarSign, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  TrendingUp,} from "lucide-react";
import ActivityHeader from "./components/ActivityHeader";
import { ActivityEmptyState, ActivityFilters, ActivityStats, ActivityTimeline } from "./components";
import ActivityAnalytics from "./components/ActivityAnalytics";
import ActivityCurrent from "./components/ActivityCurrent";
import type { Activity } from "../domain/entities/activity";
import type { ActivityStatus } from "../domain/entities/activitystatus";
import type { ActivityType } from "../domain/entities/activitytype";
import type { TimePeriod } from "../domain/entities/timeperiod";
import { generateMockActivities } from "./helpers/getMockdata";
interface PastActivityProps {
  employeeName?: string;
  employeeId?: string;
}


export default function PastActivity({ 
  employeeName = "John Doe", 
  employeeId = "EMP-2024-001" 
}: PastActivityProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>("1month");
  const [selectedType, setSelectedType] = useState<ActivityType | "all">("all");
  const [showAnalytics, setShowAnalytics] = useState(false);
  
  const allActivities = generateMockActivities();
  
  const filterByPeriod = (activities: Activity[], period: TimePeriod): Activity[] => {
    const now = new Date();
    const cutoffDates: Record<TimePeriod, Date> = {
      "7days": new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
      "15days": new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000),
      "1month": new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
      "3months": new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000),
      "6months": new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000)
    };
    
    return activities.filter(a => a.timestamp >= cutoffDates[period]);
  };
  
  const filterByType = (activities: Activity[], type: ActivityType | "all"): Activity[] => {
    if (type === "all") return activities;
    return activities.filter(a => a.type === type);
  };
  
  const filteredActivities = filterByType(filterByPeriod(allActivities, selectedPeriod), selectedType);
  
  const getActivityIcon = (type: ActivityType) => {
    switch (type) {
      case "booking":
        return <Calendar className="size-5" />;
      case "transaction":
        return <TrendingUp className="size-5" />;
      case "payment":
        return <DollarSign className="size-5" />;
    }
  };

  const getStatusBadge = (status: ActivityStatus) => {
    const variants: Record<ActivityStatus, { variant: "default" | "secondary" | "destructive" | "outline", label: string }> = {
      completed: { variant: "default", label: "Completed" },
      confirmed: { variant: "secondary", label: "Confirmed" },
      pending: { variant: "outline", label: "Pending" },
      cancelled: { variant: "destructive", label: "Cancelled" }
    };
    
    const config = variants[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getStatusIcon = (status: ActivityStatus) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="size-4 text-green-600" />;
      case "confirmed":
        return <CheckCircle2 className="size-4 text-blue-600" />;
      case "pending":
        return <Clock className="size-4 text-amber-600" />;
      case "cancelled":
        return <AlertCircle className="size-4 text-red-600" />;
    }
  };

//   const formatDate = (date: Date) => {
//     return date.toLocaleDateString('en-US', { 
//       month: 'short', 
//       day: 'numeric',
//       year: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

  const getPeriodLabel = (period: TimePeriod): string => {
    const labels: Record<TimePeriod, string> = {
      "7days": "Last 7 Days",
      "15days": "Last 15 Days",
      "1month": "Last Month",
      "3months": "Last 3 Months",
      "6months": "Last 6 Months"
    };
    return labels[period];
  };

  // Calculate statistics
  const totalEarnings = filteredActivities
    .filter(a => a.status === "completed" && a.amount)
    .reduce((sum, a) => sum + (a.amount || 0), 0);

  const completedCount = filteredActivities.filter(a => a.status === "completed").length;
  const pendingCount = filteredActivities.filter(a => a.status === "pending").length;
  const cancelledCount = filteredActivities.filter(a => a.status === "cancelled").length;

  const bookingsCount = filteredActivities.filter(a => a.type === "booking").length;
  const paymentsCount = filteredActivities.filter(a => a.type === "payment").length;
  const transactionsCount = filteredActivities.filter(a => a.type === "transaction").length;

  // Group activities by date
  const groupedActivities: Record<string, Activity[]> = {};
  filteredActivities.forEach(activity => {
    const dateKey = activity.timestamp.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    });
    if (!groupedActivities[dateKey]) {
      groupedActivities[dateKey] = [];
    }
    groupedActivities[dateKey].push(activity);
  });

  // Analytics data preparation
  const prepareChartData = () => {
    // Earnings trend data
    const earningsByWeek: Record<string, number> = {};
    filteredActivities
      .filter(a => a.status === "completed" && a.amount)
      .forEach(activity => {
        const weekStart = new Date(activity.timestamp);
        weekStart.setDate(weekStart.getDate() - weekStart.getDay());
        const weekKey = weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        earningsByWeek[weekKey] = (earningsByWeek[weekKey] || 0) + (activity.amount || 0);
      });

    const earningsTrendData = Object.entries(earningsByWeek)
      .map(([week, earnings]) => ({ week, earnings }))
      .slice(0, 8)
      .reverse();

    // Activity type distribution
    const activityTypeData = [
      { name: 'Bookings', value: bookingsCount, color: '#3b82f6' },
      { name: 'Payments', value: paymentsCount, color: '#10b981' },
      { name: 'Transactions', value: transactionsCount, color: '#8b5cf6' }
    ].filter(item => item.value > 0);

    // Status distribution
    const statusData = [
      { name: 'Completed', value: completedCount, color: '#10b981' },
      { name: 'Pending', value: pendingCount, color: '#f59e0b' },
      { name: 'Cancelled', value: cancelledCount, color: '#ef4444' }
    ].filter(item => item.value > 0);

    // Activity count by week
    const activitiesByWeek: Record<string, { bookings: number; payments: number; transactions: number }> = {};
    filteredActivities.forEach(activity => {
      const weekStart = new Date(activity.timestamp);
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      const weekKey = weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      
      if (!activitiesByWeek[weekKey]) {
        activitiesByWeek[weekKey] = { bookings: 0, payments: 0, transactions: 0 };
      }
      
      if (activity.type === 'booking') activitiesByWeek[weekKey].bookings++;
      if (activity.type === 'payment') activitiesByWeek[weekKey].payments++;
      if (activity.type === 'transaction') activitiesByWeek[weekKey].transactions++;
    });

    const activityTrendData = Object.entries(activitiesByWeek)
      .map(([week, counts]) => ({ week, ...counts }))
      .slice(0, 8)
      .reverse();

    return { earningsTrendData, activityTypeData, statusData, activityTrendData };
  };

  const { earningsTrendData, activityTypeData, statusData, activityTrendData } = prepareChartData();
  
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
      <ActivityHeader employeeName={employeeName} employeeId={employeeId}showAnalytics={showAnalytics} setShowAnalytics={setShowAnalytics}/>
        {/* Time Period Filters */}
    <ActivityFilters
  period={selectedPeriod}
  setPeriod={setSelectedPeriod}
  type={selectedType}
  setType={setSelectedType}
  stats={{
    bookingsCount,
    paymentsCount,
    transactionsCount,
  }}
/>

        {/* Summary Stats */}
      <ActivityStats
  totalActivities={filteredActivities.length}
  completedCount={completedCount}
  pendingCount={pendingCount}
  totalEarnings={totalEarnings}
/>


        {/* Analytics Section */}
        {showAnalytics && (
  <ActivityAnalytics
    earningsTrendData={earningsTrendData}
    activityTrendData={activityTrendData}
    activityTypeData={activityTypeData}
    statusData={statusData}
    totalActivities={filteredActivities.length}
    completedCount={completedCount}
    totalEarnings={totalEarnings}
    groupedActivities={groupedActivities}
  />
)}


   <ActivityCurrent
  getPeriodLabel={getPeriodLabel}
  selectedPeriod={selectedPeriod}
  filteredActivities={filteredActivities}
/>

        {/* Activity Timeline - Grouped by Date */}
        {Object.keys(groupedActivities).length > 0 ? (
         <ActivityTimeline
    groupedActivities={groupedActivities}
    getActivityIcon={getActivityIcon}
    getStatusIcon={getStatusIcon}
    getStatusBadge={getStatusBadge}
  />
        ) : (
          <ActivityEmptyState/>
        )}
      </div>
    </div>
  );
}