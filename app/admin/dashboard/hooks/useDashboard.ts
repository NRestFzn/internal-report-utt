import {useCallback, useEffect, useState} from 'react';
import {useAppNotification} from '@/lib/use-app-notification';
import {
  DashboardChartData,
  DashboardPicData,
  DashboardStatsData,
  getDashboardData,
} from '../services/dashboardService';

export function useDashboard() {
  const notify = useAppNotification();
  const [stats, setStats] = useState<DashboardStatsData>({
    taskList: 0,
    mopCount: 0,
    totalReport: 0,
    totalPic: 0,
  });
  const [chartData, setChartData] = useState<DashboardChartData[]>([]);
  const [pics, setPics] = useState<DashboardPicData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadDashboard = useCallback(async () => {
    setIsLoading(true);

    try {
      const dashboardData = await getDashboardData();
      setStats(dashboardData.stats);
      setChartData(dashboardData.chart);
      setPics(dashboardData.pics);
    } catch (error) {
      notify.error(
        'Dashboard Load Failed',
        error instanceof Error ? error.message : 'Failed to load dashboard',
      );
    } finally {
      setIsLoading(false);
    }
  }, [notify]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  return {
    stats,
    chartData,
    pics,
    isLoading,
  };
}
