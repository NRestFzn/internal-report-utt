export type ReportStatus = 'ongoing' | 'pending' | 'approved' | 'rejected';

export interface ReportData {
  id: string;
  maintenanceName: string;
  picName: string;
  mainFileName: string;
  startDate: string;
  endDate: string;
  submittedDate: string;
  status: ReportStatus;
  serviceReportCount: number;
  adminNote: string | null;
  revisionNote: string | null;
}
