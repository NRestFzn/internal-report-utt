import {createClient} from '@/lib/supabase/client';
import {TablesInsert, TablesUpdate} from '@/lib/types/supabase';
import {CategoryData, CategoryFormValues} from '../types';

const supabase = createClient();

const toCategoryData = (
  row: {
    id: number;
    name: string;
    description: string | null;
    prefix: string | null;
  },
  docCount: number,
): CategoryData => ({
  key: String(row.id),
  id: row.id,
  name: row.name,
  prefix: row.prefix || row.name.slice(0, 3).toUpperCase(),
  description: row.description ?? '-',
  docCount,
});

export async function getCategories(): Promise<CategoryData[]> {
  const [
    {data: categories, error: categoryError},
    {data: mops, error: mopError},
  ] = await Promise.all([
    supabase
      .from('categories')
      .select('id, name, description, prefix')
      .order('id', {ascending: true}),
    supabase.from('mops').select('category_id'),
  ]);

  if (categoryError) {
    throw new Error(categoryError.message);
  }

  if (mopError) {
    throw new Error(mopError.message);
  }

  const docCountMap = (mops ?? []).reduce<Record<number, number>>(
    (acc, mop) => {
      if (!mop.category_id) {
        return acc;
      }

      acc[mop.category_id] = (acc[mop.category_id] ?? 0) + 1;
      return acc;
    },
    {},
  );

  return (categories ?? []).map((category) =>
    toCategoryData(category, docCountMap[category.id] ?? 0),
  );
}

export async function createCategory(values: CategoryFormValues) {
  const payload: TablesInsert<'categories'> = {
    name: values.name.trim(),
    description: values.description.trim(),
    prefix: values.prefix.trim().toUpperCase(),
  };

  const {error} = await supabase.from('categories').insert(payload);

  if (error) {
    throw new Error(error.message);
  }
}

export async function updateCategory(
  categoryId: number,
  values: CategoryFormValues,
) {
  const payload: TablesUpdate<'categories'> = {
    name: values.name.trim(),
    description: values.description.trim(),
    prefix: values.prefix.trim().toUpperCase(),
  };

  const {error} = await supabase
    .from('categories')
    .update(payload)
    .eq('id', categoryId);

  if (error) {
    throw new Error(error.message);
  }
}

export async function deleteCategory(categoryId: number) {
  const {error} = await supabase
    .from('categories')
    .delete()
    .eq('id', categoryId);

  if (error) {
    throw new Error(error.message);
  }
}
