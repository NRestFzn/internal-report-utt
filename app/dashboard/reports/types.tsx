export interface UserTaskData {
  key: string;
  taskId: number;
  title: string;
  docNumber: string;
  category: string;
  scheduledDate: string;
  status: string;
}

export interface CategoryOption {
  value: string;
  label: string;
}
