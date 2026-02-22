export interface CategoryData {
  key: string;
  id: number;
  name: string;
  prefix: string;
  description: string;
  docCount: number;
}

export interface CategoryFormValues {
  name: string;
  prefix: string;
  description: string;
}
