import {Form} from 'antd';
import {useState, useEffect, useCallback} from 'react';
import {useRouter} from 'next/navigation';
import {useAppNotification} from '@/lib/use-app-notification';
import {getTaskDetail, submitReportToDB} from '../services/submitReportService';
import {ReportFormValues, TaskDetail} from '../types';

export function useSubmitReport(taskId: string | undefined) {
  const notify = useAppNotification();
  const router = useRouter();
  const [form] = Form.useForm<ReportFormValues>();

  const [taskDetail, setTaskDetail] = useState<TaskDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadTask = useCallback(async () => {
    if (!taskId || taskId === 'undefined' || taskId === 'null') {
      notify.error('Invalid URL', 'ID Task tidak ditemukan.');
      router.push('/dashboard/reports');
      return;
    }

    try {
      const detail = await getTaskDetail(taskId);
      setTaskDetail(detail);

      form.setFieldsValue({
        supervisorName: '',
        evidences: [
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
      notify.error('Failed to load task data', error.message);
      router.push('/dashboard/reports');
    } finally {
      setIsLoading(false);
    }
  }, [taskId, notify, router, form]);

  useEffect(() => {
    loadTask();
  }, [loadTask]);

  const onFinish = async (values: ReportFormValues) => {
    setIsSubmitting(true);
    try {
      if (!taskId) throw new Error('Task ID hilang');
      await submitReportToDB(taskId, values);
      notify.success(
        'Report Submitted!',
        'Your report is now waiting for admin approval.',
      );
      router.push('/dashboard/monitoring');
    } catch (error: any) {
      notify.error('Submission Failed', error.message);
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
