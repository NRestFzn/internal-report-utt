import {Button} from 'antd';
import type {ColumnsType} from 'antd/es/table';
import {PlayCircle, FileCheck} from 'lucide-react';
import {UserTaskData} from './types';
import {AppRouterInstance} from 'next/dist/shared/lib/app-router-context.shared-runtime';

export function getReportColumns(
  router: AppRouterInstance,
): ColumnsType<UserTaskData> {
  return [
    {
      title: 'No',
      key: 'no',
      width: 60,
      render: (_text, _record, index) => (
        <span className="text-white font-medium">{index + 1}</span>
      ),
    },
    {
      title: 'Document Title',
      dataIndex: 'title',
      render: (text) => (
        <span className="text-white font-medium text-base">{text}</span>
      ),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      render: (text) => <span className="text-white/80">{text}</span>,
    },
    {
      title: 'Scheduled Date',
      dataIndex: 'scheduledDate',
      render: (text) => (
        <div className="bg-white/10 px-3 py-1 rounded-lg text-white inline-block text-sm font-medium">
          {text}
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (status) => {
        let colorClass = 'bg-white/20 text-white';
        if (status === 'Completed')
          colorClass = '!bg-[#FFE58F] !text-[#876800]';
        if (status === 'Overdue') colorClass = '!bg-[#FFBB96] !text-[#871400]';
        if (status === 'In Progress')
          colorClass = '!bg-[#91caff] !text-[#003eb3]';

        return (
          <div
            className={`px-3 py-1 rounded-lg font-bold min-w-22.5 text-center inline-block text-xs ${colorClass}`}
          >
            {status}
          </div>
        );
      },
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => {
        if (record.status === 'Completed') {
          return (
            <Button
              type="primary"
              onClick={() =>
                router.push(`/dashboard/monitoring/${record.taskId}`)
              }
              className="bg-[#293038]! hover:bg-[#1a1f24]! border-none flex items-center gap-2 px-6 h-9.5 rounded-lg font-semibold shadow-md"
              icon={<FileCheck size={16} />}
            >
              View
            </Button>
          );
        }

        return (
          <Button
            type="primary"
            onClick={() => router.push(`/dashboard/reports/${record.taskId}`)}
            className="bg-[#1273D4]! hover:bg-[#0f62b5]! border-none flex items-center gap-2 px-6 h-9.5 rounded-lg font-semibold shadow-md"
            icon={<PlayCircle size={16} />}
          >
            Start
          </Button>
        );
      },
    },
  ];
}
