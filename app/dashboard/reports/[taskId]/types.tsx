export interface TaskDetail {
  id: number;
  mopTitle: string;
  docNumber: string;
  category: string;
  scheduledDate: string;
  picName: string;
}

export interface EvidenceItem {
  actionTitle: string;
  actionFileList?: any[];
  actionDesc: string;

  outcomeTitle: string;
  outcomeFileList?: any[];
  outcomeDesc: string;
}

export interface ReportFormValues {
  supervisorName: string;
  evidences: EvidenceItem[];
}
