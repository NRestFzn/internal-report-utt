import {createClient} from '@/lib/supabase/client';
import {TablesInsert, TablesUpdate} from '@/lib/types/supabase';
import {MopData, MopFormValues} from '../types';

const supabase = createClient();

const MOP_BUCKET = process.env.NEXT_PUBLIC_SUPABASE_MOP_BUCKET ?? 'mops';

export interface CategoryOption {
  value: number;
  label: string;
}

const toMopData = (
  row: {
    id: number;
    document_number: string;
    title: string;
    category_id: number | null;
    file_url: string | null;
    categories: {name: string} | {name: string}[] | null;
  },
  index: number,
): MopData => {
  const categoryRelation = Array.isArray(row.categories)
    ? row.categories[0]
    : row.categories;

  return {
    key: String(row.id),
    id: index + 1,
    mopId: row.id,
    docNumber: row.document_number,
    title: row.title,
    categoryId: row.category_id,
    category: categoryRelation?.name ?? 'Uncategorized',
    fileUrl: row.file_url,
  };
};

async function uploadMopFile(file: File) {
  const fileExt = file.name.split('.').pop() ?? 'pdf';
  const filePath = `mop-${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;

  const {error: uploadError} = await supabase.storage
    .from(MOP_BUCKET)
    .upload(filePath, file, {upsert: true});

  if (uploadError) {
    throw new Error(uploadError.message);
  }

  const {data} = supabase.storage.from(MOP_BUCKET).getPublicUrl(filePath);
  return data.publicUrl;
}

export async function getCategoryOptions(): Promise<CategoryOption[]> {
  const {data, error} = await supabase
    .from('categories')
    .select('id, name')
    .order('name', {ascending: true});

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((category) => ({
    value: category.id,
    label: category.name,
  }));
}

export async function getMops(): Promise<MopData[]> {
  const {data, error} = await supabase
    .from('mops')
    .select(
      'id, document_number, title, category_id, file_url, categories(name)',
    )
    .order('created_at', {ascending: true});

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((mop, index) => toMopData(mop, index));
}

export async function createMop(values: MopFormValues) {
  const file = values.file?.[0]?.originFileObj;
  const fileUrl = file ? await uploadMopFile(file) : null;

  const payload: TablesInsert<'mops'> = {
    document_number: values.docNumber.trim(),
    title: values.title.trim(),
    category_id: values.categoryId,
    file_url: fileUrl,
  };

  const {error} = await supabase.from('mops').insert(payload);

  if (error) {
    throw new Error(error.message);
  }
}

export async function updateMop(mopId: number, values: MopFormValues) {
  const file = values.file?.[0]?.originFileObj;
  const payload: TablesUpdate<'mops'> = {
    document_number: values.docNumber.trim(),
    title: values.title.trim(),
    category_id: values.categoryId,
  };

  if (file) {
    payload.file_url = await uploadMopFile(file);
  }

  const {error} = await supabase.from('mops').update(payload).eq('id', mopId);

  if (error) {
    throw new Error(error.message);
  }
}

export async function deleteMop(mopId: number) {
  const {error} = await supabase.from('mops').delete().eq('id', mopId);

  if (error) {
    throw new Error(error.message);
  }
}
