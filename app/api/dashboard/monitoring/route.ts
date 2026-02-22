import {NextResponse} from 'next/server';
import {createAdminClient} from '@/lib/supabase/admin';
import {createClient} from '@/lib/supabase/server';

export async function GET() {
  try {
    const authClient = await createClient();
    const {
      data: {user},
      error: authError,
    } = await authClient.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({error: 'Unauthorized'}, {status: 401});
    }

    const supabase = createAdminClient();

    const {data: tasksData, error: taskError} = await supabase
      .from('tasks')
      .select(
        `
        id,
        mops ( title )
      `,
      )
      .eq('pic_id', user.id);

    if (taskError) {
      return NextResponse.json({error: taskError.message}, {status: 400});
    }

    const taskIds = (tasksData ?? []).map((task) => task.id);
    if (taskIds.length === 0) {
      return NextResponse.json({data: []});
    }

    const taskNameById = new Map<number, string>(
      (tasksData ?? []).map((task) => {
        const mop = Array.isArray(task.mops) ? task.mops[0] : task.mops;
        return [task.id, mop?.title ?? 'Unknown Task'];
      }),
    );

    const {data: reportsData, error: reportError} = await supabase
      .from('reports')
      .select(
        `
        id,
        task_id,
        submitted_at,
        status,
        rejection_notes,
        report_evidences (
          id,
          action_title,
          action_image_url,
          action_description,
          outcome_title,
          outcome_image_url,
          outcome_description
        )
      `,
      )
      .in('task_id', taskIds)
      .order('submitted_at', {ascending: false});

    if (reportError) {
      return NextResponse.json({error: reportError.message}, {status: 400});
    }

    const responseData = (reportsData ?? []).map((report) => ({
      ...report,
      task_name: taskNameById.get(report.task_id) ?? 'Unknown Task',
    }));

    return NextResponse.json({data: responseData});
  } catch (error) {
    return NextResponse.json(
      {error: error instanceof Error ? error.message : 'Internal server error'},
      {status: 500},
    );
  }
}
