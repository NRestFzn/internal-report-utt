import type {Dayjs} from 'dayjs';

export interface TaskData {
  key: string;
  id: number;
  taskId: number;
  mopId: number;
  picId: string;
  mopTitle: string;
  picName: string;
  scheduledDate: string;
  status: 'Scheduled' | 'In Progress' | 'Overdue' | 'Completed';
  notes?: string;
}

export interface TaskFormValues {
  mopId: number;
  picId: string;
  scheduledDate: Dayjs;
  notes?: string;
}
