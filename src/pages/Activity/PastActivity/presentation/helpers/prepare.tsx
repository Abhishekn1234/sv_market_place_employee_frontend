import { useMemo } from "react";
import type { Activity } from "../../domain/entities/activity";
import type { ActivityType } from "../../domain/entities/activitytype";
import type { TimePeriod } from "../../domain/entities/timeperiod";

export function useActivityAnalytics(
  activities: Activity[],
  period: TimePeriod,
  type: ActivityType | "all"
) {
  return useMemo(() => {

    const now = new Date();

    const cutoffDates: Record<TimePeriod, Date> = {
      "7days": new Date(now.getTime() - 7 * 86400000),
      "15days": new Date(now.getTime() - 15 * 86400000),
      "1month": new Date(now.getTime() - 30 * 86400000),
      "3months": new Date(now.getTime() - 90 * 86400000),
      "6months": new Date(now.getTime() - 180 * 86400000),
    };

    const filteredActivities = activities
      .filter(a => a.timestamp >= cutoffDates[period])
      .filter(a => (type === "all" ? true : a.type === type));

    
    const totalEarnings = filteredActivities
      .filter(a => a.status === "completed" && a.amount)
      .reduce((sum, a) => sum + (a.amount || 0), 0);

    const completedCount = filteredActivities.filter(a => a.status === "completed").length;
    const pendingCount = filteredActivities.filter(a => a.status === "pending").length;
    const cancelledCount = filteredActivities.filter(a => a.status === "cancelled").length;

    const bookingsCount = filteredActivities.filter(a => a.type === "booking").length;
    const paymentsCount = filteredActivities.filter(a => a.type === "payment").length;
    const transactionsCount = filteredActivities.filter(a => a.type === "transaction").length;

    const groupedActivities: Record<string, Activity[]> = {};
    filteredActivities.forEach(activity => {
      const key = activity.timestamp.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
      (groupedActivities[key] ||= []).push(activity);
    });

  
    const earningsByWeek: Record<string, number> = {};
    filteredActivities
      .filter(a => a.status === "completed" && a.amount)
      .forEach(a => {
        const week = new Date(a.timestamp);
        week.setDate(week.getDate() - week.getDay());
        const key = week.toLocaleDateString("en-US", { month: "short", day: "numeric" });
        earningsByWeek[key] = (earningsByWeek[key] || 0) + (a.amount || 0);
      });

    const earningsTrendData = Object.entries(earningsByWeek)
      .map(([week, earnings]) => ({ week, earnings }))
      .slice(0, 8)
      .reverse();

  
    const activitiesByWeek: Record<string, { bookings: number; payments: number; transactions: number }> = {};

    filteredActivities.forEach(a => {
      const week = new Date(a.timestamp);
      week.setDate(week.getDate() - week.getDay());
      const key = week.toLocaleDateString("en-US", { month: "short", day: "numeric" });

      activitiesByWeek[key] ||= { bookings: 0, payments: 0, transactions: 0 };
      if (a.type === "booking") activitiesByWeek[key].bookings++;
      if (a.type === "payment") activitiesByWeek[key].payments++;
      if (a.type === "transaction") activitiesByWeek[key].transactions++;
    });

    const activityTrendData = Object.entries(activitiesByWeek)
      .map(([week, counts]) => ({ week, ...counts }))
      .slice(0, 8)
      .reverse();

    
    const activityTypeData = [
      { name: "Bookings", value: bookingsCount, color: "#3b82f6" },
      { name: "Payments", value: paymentsCount, color: "#10b981" },
      { name: "Transactions", value: transactionsCount, color: "#8b5cf6" },
    ].filter(i => i.value > 0);

    const statusData = [
      { name: "Completed", value: completedCount, color: "#10b981" },
      { name: "Pending", value: pendingCount, color: "#f59e0b" },
      { name: "Cancelled", value: cancelledCount, color: "#ef4444" },
    ].filter(i => i.value > 0);

    return {
      filteredActivities,
      groupedActivities,

      stats: {
        totalEarnings,
        completedCount,
        pendingCount,
        cancelledCount,
        bookingsCount,
        paymentsCount,
        transactionsCount,
      },

      charts: {
        earningsTrendData,
        activityTrendData,
        activityTypeData,
        statusData,
      },
    };
  }, [activities, period, type]);
}
