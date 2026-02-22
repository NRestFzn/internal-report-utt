import {createClient} from '@/lib/supabase/client';
import {CategoryOption, UserTaskData} from '../types';

const supabase = createClient();

export async function getUserTasks(): Promise<UserTaskData[]> {
  const {data: userData, error: userError} = await supabase.auth.getUser();
  if (userError || !userData.user) throw new Error('User not authenticated');

  const {data, error} = await supabase
    .from('tasks')
    .select(
      `
      id,
      scheduled_date,
      status,
      mops (
        title,
        document_number,
        categories (
          name
        )
      )
    `,
    )
    .eq('pic_id', userData.user.id)
    .order('scheduled_date', {ascending: true});

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((task) => {
    const mop = Array.isArray(task.mops) ? task.mops[0] : task.mops;
    const categoryName = mop?.categories
      ? Array.isArray(mop.categories)
        ? mop.categories[0]?.name
        : (mop.categories as any)?.name
      : 'Uncategorized';

    return {
      key: String(task.id),
      taskId: task.id,
      title: mop?.title ?? 'Unknown MOP',
      docNumber: mop?.document_number ?? '-',
      category: categoryName ?? '-',
      scheduledDate: task.scheduled_date,
      status: task.status,
    };
  });
}

export async function getCategoryOptions(): Promise<CategoryOption[]> {
  const {data, error} = await supabase
    .from('categories')
    .select('id, name')
    .order('name', {ascending: true});

  if (error) throw new Error(error.message);

  return (data ?? []).map((cat) => ({
    value: cat.name,
    label: cat.name,
  }));
}
