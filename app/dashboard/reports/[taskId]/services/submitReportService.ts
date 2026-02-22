import {createClient} from '@/lib/supabase/client';
import {ReportFormValues, TaskDetail} from '../types';

const supabase = createClient();

export async function getTaskDetail(taskId: string): Promise<TaskDetail> {
  if (!taskId) throw new Error('Invalid Task ID');

  const {data, error} = await supabase
    .from('tasks')
    .select(
      `
      id,
      scheduled_date,
      mops (
        title,
        document_number,
        categories (name)
      ),
      profiles (fullname)
    `,
    )
    .eq('id', taskId)
    .single();

  if (error || !data) throw new Error(error?.message || 'Task not found');

  const mop = Array.isArray(data.mops) ? data.mops[0] : data.mops;
  const categoryName = mop?.categories
    ? Array.isArray(mop.categories)
      ? mop.categories[0]?.name
      : (mop.categories as any)?.name
    : 'Uncategorized';
  const profile = Array.isArray(data.profiles)
    ? data.profiles[0]
    : data.profiles;

  return {
    id: data.id,
    mopTitle: mop?.title ?? 'Unknown MOP',
    docNumber: mop?.document_number ?? '-',
    category: categoryName ?? '-',
    scheduledDate: data.scheduled_date,
    picName: profile?.fullname ?? '-',
  };
}

async function uploadEvidenceFile(
  fileObj: any,
  reportId: number,
  prefix: string,
): Promise<string> {
  if (!fileObj || !fileObj.originFileObj) return '';

  const file = fileObj.originFileObj;
  const fileExt = file.name.split('.').pop();
  const fileName = `${reportId}-${prefix}-${Math.random().toString(36).substring(2)}.${fileExt}`;

  const {error: uploadError} = await supabase.storage
    .from('evidences')
    .upload(fileName, file);

  if (uploadError)
    throw new Error(`Gagal upload gambar ${prefix}: ${uploadError.message}`);

  const {data: publicUrlData} = supabase.storage
    .from('evidences')
    .getPublicUrl(fileName);

  return publicUrlData.publicUrl;
}

export async function submitReportToDB(
  taskId: string,
  values: ReportFormValues,
) {
  const {data: reportData, error: reportError} = await supabase
    .from('reports')
    .insert({
      task_id: parseInt(taskId),
      status: 'Pending',
      supervisor_name: values.supervisorName,
    })
    .select('id')
    .single();

  if (reportError)
    throw new Error(`Gagal membuat report: ${reportError.message}`);

  const reportId = reportData.id;

  const evidencePromises = values.evidences.map(async (item) => {
    const [actionImageUrl, outcomeImageUrl] = await Promise.all([
      item.actionFileList?.length
        ? uploadEvidenceFile(item.actionFileList[0], reportId, 'action')
        : Promise.resolve(''),
      item.outcomeFileList?.length
        ? uploadEvidenceFile(item.outcomeFileList[0], reportId, 'outcome')
        : Promise.resolve(''),
    ]);

    return supabase.from('report_evidences').insert({
      report_id: reportId,
      action_title: item.actionTitle,
      action_image_url: actionImageUrl,
      action_description: item.actionDesc,
      outcome_title: item.outcomeTitle,
      outcome_image_url: outcomeImageUrl,
      outcome_description: item.outcomeDesc,
    });
  });

  await Promise.all(evidencePromises);

  await supabase.from('tasks').update({status: 'Completed'}).eq('id', taskId);
}
