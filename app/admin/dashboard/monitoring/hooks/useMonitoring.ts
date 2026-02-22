import {Form, Modal} from 'antd';
import {useState, useEffect, useCallback} from 'react';
import {useAppNotification} from '@/lib/use-app-notification';
import {
  getMonitoringReports,
  approveReport,
  rejectReport,
  printReport,
} from '../services/monitoringService';
import {ReportData} from '../types';

export function useMonitoring() {
  const notify = useAppNotification();
  const [data, setData] = useState<ReportData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modal, modalContextHolder] = Modal.useModal();

  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [viewingReport, setViewingReport] = useState<ReportData | null>(null);

  const [isRevisiOpen, setIsRevisiOpen] = useState(false);
  const [revisiTarget, setRevisiTarget] = useState<number | null>(null);
  const [formRevisi] = Form.useForm();

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const reports = await getMonitoringReports();
      setData(reports);
    } catch (error: unknown) {
      notify.error(
        'Monitoring Load Failed',
        error instanceof Error ? error.message : 'Failed to load reports',
      );
    } finally {
      setIsLoading(false);
    }
  }, [notify]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleApprove = (reportId: number) => {
    modal.confirm({
      title: 'Approve Report?',
      content: 'This report will be marked as approved.',
      okText: 'Approve',
      okButtonProps: {
        className: '!bg-green-600 hover:!bg-green-500 border-none',
      },
      centered: true,
      onOk: async () => {
        try {
          await approveReport(reportId);
          notify.success('Report Approved', 'Report has been approved.');
          await loadData();
        } catch (error: unknown) {
          notify.error(
            'Approve Failed',
            error instanceof Error ? error.message : 'Failed to approve report',
          );
        }
      },
    });
  };

  const openRevisiModal = (reportId: number) => {
    setRevisiTarget(reportId);
    formRevisi.resetFields();
    setIsRevisiOpen(true);
  };

  const handleRevisiSubmit = async () => {
    try {
      const values = await formRevisi.validateFields();
      if (revisiTarget) {
        await rejectReport(revisiTarget, values.notes);
        notify.warning(
          'Revision Requested',
          'Report has been sent back for revision.',
        );
        setIsRevisiOpen(false);
        await loadData();
      }
    } catch (error: unknown) {
      if (
        !(
          error &&
          typeof error === 'object' &&
          'errorFields' in error &&
          Array.isArray((error as {errorFields?: unknown}).errorFields)
        )
      ) {
        notify.error(
          'Revision Submit Failed',
          error instanceof Error ? error.message : 'Failed to submit revision',
        );
      }
    }
  };

  const showDetail = (report: ReportData) => {
    setViewingReport(report);
    setIsDetailOpen(true);
  };

  const handlePrint = (report: ReportData) => {
    try {
      printReport(report);
      notify.success(
        'Print Document',
        'Preparing your document for printing...',
      );
    } catch (error: any) {
      notify.error('Print Failed', error.message);
    }
  };

  return {
    data,
    isLoading,
    isDetailOpen,
    viewingReport,
    isRevisiOpen,
    formRevisi,
    modalContextHolder,
    handleApprove,
    openRevisiModal,
    handleRevisiSubmit,
    showDetail,
    handlePrint,
    closeDetail: () => setIsDetailOpen(false),
    closeRevisi: () => setIsRevisiOpen(false),
  };
}
