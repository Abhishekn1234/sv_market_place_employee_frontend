import { useState,  useEffect } from "react";

import ActivityHeader from "./components/ActivityHeader";
import {
  ActivityEmptyState,
  ActivityFilters,
  ActivityStats,
  ActivityTimeline,
} from "./components";
import ActivityAnalytics from "./components/ActivityAnalytics";
import ActivityCurrent from "./components/ActivityCurrent";

import {
  getPeriodLabel,
  getActivityIcon,
  getStatusBadge,
  getStatusIcon,
} from "./helpers/getActivity";

import type { ActivityType } from "../domain/entities/activitytype";
import type { TimePeriod } from "../domain/entities/timeperiod";
import type { Activity } from "../domain/entities/activity";

import { useActivityAnalytics } from "./helpers/prepare";
import { useAuthStore } from "@/core/store/auth";
import { useGetBookingHistory } from "@/pages/History/BookingHistory/presentation/hooks/useGetBookingHistory";
import { reverseGeocode } from "@/components/common/CommonMap";

export default function PastActivity() {

  const { user } = useAuthStore();
  const { data } = useGetBookingHistory();

  const bookings = data?.data ?? [];

  const employeeName = user?.fullName ?? "";
  const employeeId = user?._id ?? "";

  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>("1month");
  const [selectedType, setSelectedType] = useState<ActivityType | "all">("all");
  const [showAnalytics, setShowAnalytics] = useState(false);


const [allActivities, setAllActivities] = useState<Activity[]>([]);

useEffect(() => {
  const prepareActivities = async () => {

    const activities: Activity[] = await Promise.all(
      bookings.map(async (item, index) => {

        const loc = item.booking?.location;

        let location = "Unknown location";

        if (typeof loc === "string") {
          location = loc;
        } else if (loc) {
          location = await reverseGeocode(loc.coordinates[1], loc.coordinates[0]);
        }

        return {
          id: item._id ?? String(index),

          type: "booking",

          title: item.service?.name ?? "Service Booking",

          description: item.customer?.fullName ?? "Customer",

          timestamp: item.booking?.startedAt
            ? new Date(item.booking.startedAt)
            : new Date(),

          status:
            (item.booking?.status?.toLowerCase() as Activity["status"]) ??
            "pending",

          amount: item.booking?.amount ?? 0,

          client: item.customer?.email ?? "Client",

          location,
        };
      })
    );

    setAllActivities(activities);
  };

  if (bookings?.length) {
    prepareActivities();
  }
}, [bookings]);

  const {
    filteredActivities,
    groupedActivities,
    stats,
    charts,
  } = useActivityAnalytics(allActivities, selectedPeriod, selectedType);

  return (
    <div className="min-h-screen px-3 py-4 sm:px-4 sm:py-6 lg:px-6">
      <div className="mx-auto max-w-7xl space-y-4 sm:space-y-6 lg:space-y-8">

        {/* Header */}
        <ActivityHeader
          employeeName={employeeName}
          employeeId={employeeId}
          showAnalytics={showAnalytics}
          setShowAnalytics={setShowAnalytics}
        />

        {/* Filters */}
        <ActivityFilters
          period={selectedPeriod}
          setPeriod={setSelectedPeriod}
          type={selectedType}
          setType={setSelectedType}
          stats={{
            bookingsCount: stats.bookingsCount,
            paymentsCount: stats.paymentsCount,
            transactionsCount: stats.transactionsCount,
          }}
        />

        {/* Stats */}
        <ActivityStats
          totalActivities={filteredActivities.length}
          completedCount={stats.completedCount}
          pendingCount={stats.pendingCount}
          totalEarnings={stats.totalEarnings}
        />

        {/* Analytics */}
        {showAnalytics && (
          <ActivityAnalytics
            earningsTrendData={charts.earningsTrendData}
            activityTrendData={charts.activityTrendData}
            activityTypeData={charts.activityTypeData}
            statusData={charts.statusData}
            totalActivities={filteredActivities.length}
            completedCount={stats.completedCount}
            totalEarnings={stats.totalEarnings}
            groupedActivities={groupedActivities}
          />
        )}

        {/* Period label */}
        <ActivityCurrent
          getPeriodLabel={getPeriodLabel}
          selectedPeriod={selectedPeriod}
          filteredActivities={filteredActivities}
        />

        {/* Timeline */}
        {Object.keys(groupedActivities).length > 0 ? (
          <ActivityTimeline
            groupedActivities={groupedActivities}
            getActivityIcon={getActivityIcon}
            getStatusIcon={getStatusIcon}
            getStatusBadge={getStatusBadge}
          />
        ) : (
          <ActivityEmptyState />
        )}

      </div>
    </div>
  );
}