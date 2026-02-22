'use client';

import {use} from 'react';
import {Spin} from 'antd';
import {ArrowLeft} from 'lucide-react';
import {useRouter} from 'next/navigation';
import {useEditReport} from './hooks/useEditReport';

import {EditReportForm} from './partials/editReportForm';
import {EditReportInfoCard} from './partials/editReportInfoCard';

export default function EditReportPage({
  params,
}: {
  params: Promise<{taskId: string}>;
}) {
  const unwrappedParams = use(params);
  const router = useRouter();
  const reportId = unwrappedParams.taskId;
  const {form, reportDetail, isLoading, isSubmitting, onFinish} =
    useEditReport(reportId);

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

      <EditReportInfoCard reportDetail={reportDetail} />

      <EditReportForm
        form={form}
        isSubmitting={isSubmitting}
        onFinish={onFinish}
      />
    </div>
  );
}
