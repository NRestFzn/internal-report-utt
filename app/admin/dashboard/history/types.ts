export interface HistoryEvidence {
  id: number;
  actionTitle: string | null;
  actionImageUrl: string | null;
  actionDesc: string | null;
  outcomeTitle: string | null;
  outcomeImageUrl: string | null;
  outcomeDesc: string | null;
}

export interface HistoryData {
  key: string;
  id: number;
  reportId: number;
  taskName: string;
  picName: string;
  completedDate: string;
  status: 'Completed' | 'Late';
  evidences?: HistoryEvidence[];
}

export interface ChartData {
  month: string;
  total: number;
}
