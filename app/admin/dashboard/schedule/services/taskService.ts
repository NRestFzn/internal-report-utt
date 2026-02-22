import {createClient} from '@/lib/supabase/client';
import {TablesInsert, TablesUpdate} from '@/lib/types/supabase';
import dayjs from 'dayjs';
import {TaskData, TaskFormValues} from '../types';

const supabase = createClient();

export interface SelectOption {
  value: number | string;
  label: string;
}

const normalizeTaskStatus = (status: string | null): TaskData['status'] => {
  if (
    status === 'In Progress' ||
    status === 'Overdue' ||
    status === 'Completed'
  ) {
    return status;
  }

  return 'Scheduled';
};

const toTaskData = (
  row: {
    id: number;
    mop_id: number;
    pic_id: string;
    scheduled_date: string;
    status: string | null;
    admin_notes: string | null;
    mops: {title: string} | {title: string}[] | null;
    profiles: {fullname: string | null} | {fullname: string | null}[] | null;
  },
  index: number,
): TaskData => {
  const mopRelation = Array.isArray(row.mops) ? row.mops[0] : row.mops;
  const profileRelation = Array.isArray(row.profiles)
    ? row.profiles[0]
    : row.profiles;

  return {
    key: String(row.id),
    id: index + 1,
    taskId: row.id,
    mopId: row.mop_id,
    picId: row.pic_id,
    mopTitle: mopRelation?.title ?? '-',
    picName: profileRelation?.fullname ?? '-',
    scheduledDate: dayjs(row.scheduled_date).format('YYYY-MM-DD'),
    status: normalizeTaskStatus(row.status),
    notes: row.admin_notes ?? undefined,
  };
};

export async function getTaskOptions() {
  const [{data: mops, error: mopsError}, {data: pics, error: picsError}] =
    await Promise.all([
      supabase
        .from('mops')
        .select('id, title')
        .order('title', {ascending: true}),
      supabase
        .from('profiles')
        .select('id, fullname, roles!inner(name)')
        .eq('roles.name', 'user')
        .order('fullname', {ascending: true}),
    ]);

  if (mopsError) {
    throw new Error(mopsError.message);
  }

  if (picsError) {
    throw new Error(picsError.message);
  }

  return {
    mops: (mops ?? []).map((mop) => ({
      value: mop.id,
      label: mop.title,
    })) as SelectOption[],
    pics: (pics ?? []).map((pic) => ({
      value: pic.id,
      label: pic.fullname ?? pic.id,
    })) as SelectOption[],
  };
}

export async function getTasks(): Promise<TaskData[]> {
  const {data, error} = await supabase
    .from('tasks')
    .select(
      'id, mop_id, pic_id, scheduled_date, status, admin_notes, mops(title), profiles(fullname)',
    )
    .order('scheduled_date', {ascending: true});

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((task, index) => toTaskData(task, index));
}

export async function createTask(values: TaskFormValues) {
  const payload: TablesInsert<'tasks'> = {
    mop_id: values.mopId,
    pic_id: values.picId,
    scheduled_date: dayjs(values.scheduledDate).format('YYYY-MM-DD'),
    admin_notes: values.notes?.trim() || null,
    status: 'Scheduled',
  };

  const {error} = await supabase.from('tasks').insert(payload);

  if (error) {
    throw new Error(error.message);
  }
}

export async function updateTask(taskId: number, values: TaskFormValues) {
  const payload: TablesUpdate<'tasks'> = {
    mop_id: values.mopId,
    pic_id: values.picId,
    scheduled_date: dayjs(values.scheduledDate).format('YYYY-MM-DD'),
    admin_notes: values.notes?.trim() || null,
  };

  const {error} = await supabase.from('tasks').update(payload).eq('id', taskId);

  if (error) {
    throw new Error(error.message);
  }
}

export async function deleteTask(taskId: number) {
  const {error} = await supabase.from('tasks').delete().eq('id', taskId);

  if (error) {
    throw new Error(error.message);
  }
}
