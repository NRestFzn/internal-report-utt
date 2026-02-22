'use client';

import {Spin} from 'antd';
import {ArrowLeft} from 'lucide-react';
import {useParams, useRouter} from 'next/navigation';
import {useEditReport} from './hooks/useEditReport';

import {TaskInfoCard} from './partials/taskInfoCard';
import {SubmitForm} from './partials/submitForm';

export default function EditReportPage() {
  const params = useParams();
  const router = useRouter();

  const actualId = (params?.taskId || params?.id) as string;

  const {form, taskDetail, isLoading, isSubmitting, onFinish} =
    useEditReport(actualId);

  if (isLoading) {
    return (
      <div className="w-full h-150 flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="w-full h-fit flex flex-col p-4 md:p-8 pb-20 max-w-6xl mx-auto">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-white/80 hover:text-white mb-6 w-fit transition-colors"
      >
        <ArrowLeft size={20} />
        <span className="font-semibold">Back to History</span>
      </button>

      <TaskInfoCard taskDetail={taskDetail} />

      <SubmitForm form={form} isSubmitting={isSubmitting} onFinish={onFinish} />
    </div>
  );
}
