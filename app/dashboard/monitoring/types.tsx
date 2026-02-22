export type ReportStatus = 'Pending' | 'Approved' | 'Revisi';

export interface UserEvidenceData {
  id: number;
  actionTitle: string | null;
  actionImageUrl: string | null;
  actionDesc: string | null;
  outcomeTitle: string | null;
  outcomeImageUrl: string | null;
  outcomeDesc: string | null;
}

export interface UserReportData {
  key: string;
  id: number;
  reportId: number;
  taskId: number;
  taskName: string;
  submittedDate: string;
  displayDate: string;
  status: ReportStatus;
  notes?: string;
  evidences: UserEvidenceData[];
}
