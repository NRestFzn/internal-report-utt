import dayjs from 'dayjs';
import {UserReportData, ReportStatus} from '../types';

interface MonitoringApiEvidence {
  id: number;
  action_title: string | null;
  action_image_url: string | null;
  action_description: string | null;
  outcome_title: string | null;
  outcome_image_url: string | null;
  outcome_description: string | null;
}

interface MonitoringApiReport {
  id: number;
  task_id: number;
  task_name: string;
  submitted_at: string | null;
  status: string | null;
  rejection_notes: string | null;
  report_evidences: MonitoringApiEvidence[];
}

const toReportStatus = (status: string | null): ReportStatus => {
  if (status === 'Approved' || status === 'Revisi') return status;
  return 'Pending';
};

export async function getUserMonitoringReports(): Promise<UserReportData[]> {
  const response = await fetch('/api/dashboard/monitoring', {
    method: 'GET',
    cache: 'no-store',
  });

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload?.error || 'Failed to load monitoring reports');
  }

  const reportsData = (payload?.data ?? []) as MonitoringApiReport[];

  const mappedReports: UserReportData[] = (reportsData || []).map(
    (report, index) => {
      const evidences = (report.report_evidences || []).map((ev: any) => ({
        id: ev.id,
        actionTitle: ev.action_title,
        actionImageUrl: ev.action_image_url,
        actionDesc: ev.action_description,
        outcomeTitle: ev.outcome_title,
        outcomeImageUrl: ev.outcome_image_url,
        outcomeDesc: ev.outcome_description,
      }));

      return {
        key: String(report.id),
        id: index + 1,
        reportId: report.id,
        taskId: report.task_id,
        taskName: report.task_name ?? 'Unknown Task',
        submittedDate: report.submitted_at ?? '',
        displayDate: report.submitted_at
          ? dayjs(report.submitted_at).format('DD MMM YYYY')
          : '-',
        status: toReportStatus(report.status),
        notes: report.rejection_notes ?? undefined,
        evidences,
      };
    },
  );

  return mappedReports;
}
