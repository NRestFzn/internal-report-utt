import {useState, useEffect, useCallback, useMemo} from 'react';
import {useAppNotification} from '@/lib/use-app-notification';
import {getUserMonitoringReports} from '../services/monitoringService';
import {UserReportData} from '../types';
import dayjs from 'dayjs';

export function useUserMonitoring() {
  const notify = useAppNotification();
  const [data, setData] = useState<UserReportData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter States
  const [activeQuarter, setActiveQuarter] = useState('1');
  const [selectedYear, setSelectedYear] = useState<number>(dayjs().year());

  // Modal States
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [viewingReport, setViewingReport] = useState<UserReportData | null>(
    null,
  );

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const reports = await getUserMonitoringReports();
      setData(reports);
    } catch (error: any) {
      notify.error('Failed to load history', error.message);
    } finally {
      setIsLoading(false);
    }
  }, [notify]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredData = useMemo(() => {
    return data.filter((report) => {
      if (!report.submittedDate) return false;

      const reportDate = dayjs(report.submittedDate);
      const reportYear = reportDate.year();
      const month = reportDate.month() + 1;

      let reportQuarter = '1';
      if (month >= 4 && month <= 6) reportQuarter = '2';
      else if (month >= 7 && month <= 9) reportQuarter = '3';
      else if (month >= 10 && month <= 12) reportQuarter = '4';

      const matchYear = String(reportYear) === String(selectedYear);
      const matchQuarter = String(reportQuarter) === String(activeQuarter);

      return matchYear && matchQuarter;
    });
  }, [data, activeQuarter, selectedYear]);

  const yearOptions = useMemo(() => {
    const years = new Set<number>();
    years.add(dayjs().year());
    data.forEach((item) => {
      if (item.submittedDate) years.add(dayjs(item.submittedDate).year());
    });

    return Array.from(years)
      .sort((a, b) => b - a)
      .map((y) => ({value: y, label: String(y)}));
  }, [data]);

  const showDetail = (report: UserReportData) => {
    setViewingReport(report);
    setIsDetailOpen(true);
  };

  return {
    filteredData,
    isLoading,
    activeQuarter,
    setActiveQuarter,
    selectedYear,
    setSelectedYear,
    yearOptions,
    isDetailOpen,
    viewingReport,
    showDetail,
    closeDetail: () => setIsDetailOpen(false),
  };
}
