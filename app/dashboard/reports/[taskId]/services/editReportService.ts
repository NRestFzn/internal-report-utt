import {createClient} from '@/lib/supabase/client';
import {EditReportFormValues, EditTaskDetail} from '../types';

const supabase = createClient();

export async function getReportDetail(reportId: string) {
  const {data, error} = await supabase
    .from('reports')
    .select(
      `
      id,
      task_id,
      supervisor_name,
      rejection_notes,
      tasks (
        scheduled_date,
        mops ( title, document_number, categories (name) ),
        profiles (fullname)
      ),
      report_evidences (
        id, action_title, action_image_url, action_description,
        outcome_title, outcome_image_url, outcome_description
      )
    `,
    )
    .eq('id', reportId)
    .single();

  if (error || !data) throw new Error(error?.message || 'Report not found');

  const task = Array.isArray(data.tasks) ? data.tasks[0] : data.tasks;
  const mop = Array.isArray(task?.mops) ? task?.mops[0] : task?.mops;
  const categoryName = mop?.categories
    ? Array.isArray(mop.categories)
      ? mop.categories[0]?.name
      : mop.categories?.name
    : 'Uncategorized';
  const profile = Array.isArray(task?.profiles)
    ? task?.profiles[0]
    : task?.profiles;

  const taskDetail: EditTaskDetail = {
    id: data.task_id,
    reportId: data.id,
    mopTitle: mop?.title ?? 'Unknown MOP',
    docNumber: mop?.document_number ?? '-',
    category: categoryName ?? '-',
    scheduledDate: task?.scheduled_date,
    picName: profile?.fullname ?? '-',
    rejectionNotes: data.rejection_notes ?? undefined,
  };

  return {
    taskDetail,
    supervisorName: data.supervisor_name,
    evidences: data.report_evidences,
  };
}

async function uploadEvidenceFile(
  fileObj: any,
  reportId: number,
  prefix: string,
): Promise<string> {
  if (fileObj?.url) return fileObj.url;

  if (!fileObj || !fileObj.originFileObj) return '';

  const file = fileObj.originFileObj;
  const fileExt = file.name.split('.').pop();
  const fileName = `${reportId}-${prefix}-revisi-${Math.random().toString(36).substring(2)}.${fileExt}`;

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

export async function updateReportToDB(
  reportId: string,
  values: EditReportFormValues,
) {
  const numericReportId = parseInt(reportId);

  const {error: reportError} = await supabase
    .from('reports')
    .update({
      supervisor_name: values.supervisorName,
      status: 'Pending',
    })
    .eq('id', numericReportId);

  if (reportError)
    throw new Error(`Gagal update report: ${reportError.message}`);

  const evidencePromises = values.evidences.map(async (item) => {
    const [actionImageUrl, outcomeImageUrl] = await Promise.all([
      item.actionFileList?.length
        ? uploadEvidenceFile(item.actionFileList[0], numericReportId, 'action')
        : Promise.resolve(''),
      item.outcomeFileList?.length
        ? uploadEvidenceFile(
            item.outcomeFileList[0],
            numericReportId,
            'outcome',
          )
        : Promise.resolve(''),
    ]);

    return {
      report_id: numericReportId,
      action_title: item.actionTitle,
      action_image_url: actionImageUrl,
      action_description: item.actionDesc,
      outcome_title: item.outcomeTitle,
      outcome_image_url: outcomeImageUrl,
      outcome_description: item.outcomeDesc,
    };
  });

  const newEvidences = await Promise.all(evidencePromises);

  await supabase
    .from('report_evidences')
    .delete()
    .eq('report_id', numericReportId);

  const {error: insertError} = await supabase
    .from('report_evidences')
    .insert(newEvidences);

  if (insertError)
    throw new Error(`Gagal update data evidence: ${insertError.message}`);
}
