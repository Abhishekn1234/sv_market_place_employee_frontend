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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">

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

        {/* Summary Stats */}
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

        {/* Current Period */}
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
