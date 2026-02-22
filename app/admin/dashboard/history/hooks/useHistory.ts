import {useCallback, useEffect, useState} from 'react';
import {ChartData, HistoryData} from '../types';
import {exportToPDF, getHistoryData} from '../services/historyService';
import {useAppNotification} from '@/lib/use-app-notification';

export function useHistory() {
  const notify = useAppNotification();
  const [data, setData] = useState<HistoryData[]>([]);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [viewingHistory, setViewingHistory] = useState<HistoryData | null>(
    null,
  );

  const loadHistory = useCallback(async () => {
    setIsLoading(true);

    try {
      const historyData = await getHistoryData();
      setData(historyData.rows);
      setChartData(historyData.chart);
    } catch (error) {
      notify.error(
        'History Load Failed',
        error instanceof Error ? error.message : 'Failed to load history',
      );
    } finally {
      setIsLoading(false);
    }
  }, [notify]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const showDetail = (record: HistoryData) => {
    setViewingHistory(record);
    setIsDetailOpen(true);
  };

  const closeDetail = () => {
    setIsDetailOpen(false);
    setViewingHistory(null);
  };

  const handleExport = async (record: HistoryData) => {
    try {
      notify.info(
        'Preparing PDF...',
        `Downloading report for ${record.taskName}. Please wait...`,
      );

      await exportToPDF(record);

      notify.success(
        'Download Complete!',
        `Report successfully saved to your device.`,
      );
    } catch (error: any) {
      notify.error('Download Failed', error.message);
    }
  };

  return {
    data,
    chartData,
    isLoading,
    isDetailOpen,
    viewingHistory,
    showDetail,
    closeDetail,
    handleExport,
  };
}
