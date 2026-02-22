import type {UploadFile} from 'antd/es/upload/interface';

export interface MopData {
  key: string;
  id: number;
  mopId: number;
  docNumber: string;
  title: string;
  categoryId: number | null;
  category: string;
  fileUrl: string | null;
}

export interface MopFormValues {
  docNumber: string;
  title: string;
  categoryId: number;
  file?: UploadFile[];
}
