import { useState } from "react";

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

import { generateMockActivities } from "./helpers/getMockdata";
import { useActivityAnalytics } from "./helpers/prepare";

interface PastActivityProps {
  employeeName?: string;
  employeeId?: string;
}

export default function PastActivity({
  employeeName = "John Doe",
  employeeId = "EMP-2024-001",
}: PastActivityProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>("1month");
  const [selectedType, setSelectedType] = useState<ActivityType | "all">("all");
  const [showAnalytics, setShowAnalytics] = useState(false);

  const allActivities = generateMockActivities();

  const {
    filteredActivities,
    groupedActivities,
    stats,
    charts,
  } = useActivityAnalytics(allActivities, selectedPeriod, selectedType);

  return (
    <div
      className="
        min-h-screen
        px-3 py-4
        sm:px-4 sm:py-6
        lg:px-6
      "
    >
      <div
        className="
          mx-auto
          max-w-7xl
          space-y-4
          sm:space-y-6
          lg:space-y-8
        "
      >
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

        {/* Analytics (optional) */}
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

        {/* Current period label */}
        <ActivityCurrent
          getPeriodLabel={getPeriodLabel}
          selectedPeriod={selectedPeriod}
          filteredActivities={filteredActivities}
        />

        {/* Timeline / Empty */}
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
