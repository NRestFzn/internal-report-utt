import {createClient} from '@/lib/supabase/client';

const supabase = createClient();

export interface DashboardStatsData {
  taskList: number;
  mopCount: number;
  totalReport: number;
  totalPic: number;
}

export interface DashboardChartData {
  name: string;
  value: number;
}

export interface DashboardPicData {
  id: string;
  name: string;
  role: string;
}

export async function getDashboardData(): Promise<{
  stats: DashboardStatsData;
  chart: DashboardChartData[];
  pics: DashboardPicData[];
}> {
  const [
    {count: taskCount, error: taskError},
    {count: mopCount, error: mopError},
    {count: reportCount, error: reportError},
    {data: picRows, error: picRowsError},
  ] = await Promise.all([
    supabase.from('tasks').select('*', {count: 'exact', head: true}),
    supabase.from('mops').select('*', {count: 'exact', head: true}),
    supabase.from('reports').select('*', {count: 'exact', head: true}),
    supabase
      .from('profiles')
      .select('id, fullname, roles!inner(name)')
      .eq('roles.name', 'user')
      .order('fullname', {ascending: true}),
  ]);

  if (taskError) {
    throw new Error(taskError.message);
  }

  if (mopError) {
    throw new Error(mopError.message);
  }

  if (reportError) {
    throw new Error(reportError.message);
  }

  if (picRowsError) {
    throw new Error(picRowsError.message);
  }

  const pics = (picRows ?? []).map((row) => {
    const roleRelation = Array.isArray(row.roles) ? row.roles[0] : row.roles;

    return {
      id: row.id,
      name: row.fullname ?? row.id,
      role: roleRelation?.name ?? 'unassigned',
    };
  });

  const stats = {
    taskList: taskCount ?? 0,
    mopCount: mopCount ?? 0,
    totalReport: reportCount ?? 0,
    totalPic: pics.length,
  };

  const chart = [
    {name: 'Task List', value: stats.taskList},
    {name: 'MOP', value: stats.mopCount},
    {name: 'Total Report', value: stats.totalReport},
  ];

  return {
    stats,
    chart,
    pics,
  };
}
