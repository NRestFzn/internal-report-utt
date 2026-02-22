'use client';

import {Spin} from 'antd';
import {useDashboard} from './hooks/useDashboard';
import {DashboardPicCard} from './partials/dashboardPicCard';
import {DashboardReportTypeCard} from './partials/dashboardReportTypeCard';
import {DashboardStatsGrid} from './partials/dashboardStatsGrid';

export default function DashboardPage() {
  const {stats, chartData, pics, isLoading} = useDashboard();

  if (isLoading) {
    return (
      <div className="w-full h-100 flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <>
      <h1 className="text-white text-2xl font-bold mb-6">Dashboard</h1>
      <DashboardStatsGrid stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-125 mb-8">
        <DashboardReportTypeCard chartData={chartData} />
        <DashboardPicCard picList={pics} />
      </div>
    </>
  );
}
