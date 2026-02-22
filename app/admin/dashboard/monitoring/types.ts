export type ReportStatus = 'Pending' | 'Approved' | 'Revisi';

export interface EvidenceData {
  id: number;
  actionTitle: string | null;
  actionImageUrl: string | null;
  actionDesc: string | null;
  outcomeTitle: string | null;
  outcomeImageUrl: string | null;
  outcomeDesc: string | null;
}

export interface ReportData {
  key: string;
  id: number;
  reportId?: number;
  taskName: string;
  picName: string;
  submittedDate: string;
  status: ReportStatus;
  notes?: string;
  evidences?: EvidenceData[];
}
