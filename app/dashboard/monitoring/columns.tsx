import {Button, Space} from 'antd';
import type {ColumnsType} from 'antd/es/table';
import {Eye, Wrench} from 'lucide-react';
import {UserReportData} from './types';
import {AppRouterInstance} from 'next/dist/shared/lib/app-router-context.shared-runtime';

export function getMonitoringColumns(
  router: AppRouterInstance,
  showDetail: (report: UserReportData) => void,
): ColumnsType<UserReportData> {
  return [
    {
      title: 'No',
      dataIndex: 'id',
      width: 60,
      render: (_text, _record, index) => (
        <span className="text-white font-medium">{index + 1}</span>
      ),
    },
    {
      title: 'Task Name',
      dataIndex: 'taskName',
      render: (text) => (
        <span className="text-white font-medium text-base line-clamp-1 max-w-62.5">
          {text}
        </span>
      ),
    },
    {
      title: 'Submitted Date',
      dataIndex: 'displayDate',
      render: (text) => <span className="text-white/80">{text}</span>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (status) => {
        let colorClass = 'bg-[#91caff] text-[#003eb3]';
        if (status === 'Approved') colorClass = 'bg-[#d9f7be] text-[#389e0d]';
        if (status === 'Revisi') colorClass = 'bg-[#ffccc7] text-[#cf1322]';

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
      title: 'Actions',
      key: 'action',
      width: 200,
      render: (_, record) => (
        <Space size="small">
          <Button
            onClick={() => showDetail(record)}
            className="bg-white border-none flex items-center gap-2 font-bold text-[11px] h-8 rounded-lg hover:bg-gray-100! text-gray-600 shadow-sm"
          >
            <Eye size={14} />
            Detail
          </Button>

          {record.status === 'Revisi' && (
            <Button
              onClick={() =>
                router.push(`/dashboard/reports/edit/${record.reportId}`)
              }
              className="bg-[#cf1322]! border-none flex items-center gap-2 font-bold text-[11px] h-8 rounded-lg hover:bg-[#a8071a]! text-white shadow-sm"
            >
              <Wrench size={14} />
              Fix Report
            </Button>
          )}
        </Space>
      ),
    },
  ];
}
