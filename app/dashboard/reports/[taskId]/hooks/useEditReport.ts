import {Form} from 'antd';
import {useState, useEffect, useCallback} from 'react';
import {useRouter} from 'next/navigation';
import {useAppNotification} from '@/lib/use-app-notification';
import {getReportDetail, updateReportToDB} from '../services/editReportService';
import {EditReportFormValues, EditTaskDetail} from '../types';

export function useEditReport(reportId: string | undefined) {
  const notify = useAppNotification();
  const router = useRouter();
  const [form] = Form.useForm<EditReportFormValues>();

  const [taskDetail, setTaskDetail] = useState<EditTaskDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadReport = useCallback(async () => {
    if (!reportId || reportId === 'undefined' || reportId === 'null') {
      notify.error('Invalid URL', 'ID Laporan tidak ditemukan.');
      router.push('/dashboard/monitoring');
      return;
    }

    try {
      const {taskDetail, supervisorName, evidences} =
        await getReportDetail(reportId);
      setTaskDetail(taskDetail);

      const mappedEvidences = evidences.map((ev: any) => ({
        actionTitle: ev.action_title,
        actionFileList: ev.action_image_url
          ? [
              {
                uid: `action-${ev.id}`,
                name: 'Action Photo',
                status: 'done',
                url: ev.action_image_url,
              },
            ]
          : [],
        actionDesc: ev.action_description,
        outcomeTitle: ev.outcome_title,
        outcomeFileList: ev.outcome_image_url
          ? [
              {
                uid: `outcome-${ev.id}`,
                name: 'Outcome Photo',
                status: 'done',
                url: ev.outcome_image_url,
              },
            ]
          : [],
        outcomeDesc: ev.outcome_description,
      }));

      form.setFieldsValue({
        supervisorName: supervisorName,
        evidences:
          mappedEvidences.length > 0
            ? mappedEvidences
            : [
                {
                  actionTitle: '',
                  actionFileList: [],
                  actionDesc: '',
                  outcomeTitle: '',
                  outcomeFileList: [],
                  outcomeDesc: '',
                },
              ],
      });
    } catch (error: any) {
      notify.error('Failed to load report data', error.message);
      router.push('/dashboard/monitoring');
    } finally {
      setIsLoading(false);
    }
  }, [reportId, notify, router, form]);

  useEffect(() => {
    loadReport();
  }, [loadReport]);

  const onFinish = async (values: EditReportFormValues) => {
    setIsSubmitting(true);
    try {
      if (!reportId) throw new Error('ID Laporan hilang');
      await updateReportToDB(reportId, values);
      notify.success(
        'Report Resubmitted!',
        'Your revised report has been sent back to Admin.',
      );
      router.push('/dashboard/monitoring');
    } catch (error: any) {
      notify.error('Resubmission Failed', error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    taskDetail,
    isLoading,
    isSubmitting,
    onFinish,
  };
}
