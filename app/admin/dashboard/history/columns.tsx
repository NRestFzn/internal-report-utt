import {Button, Space} from 'antd';
import type {ColumnsType} from 'antd/es/table';
import {Eye, Download} from 'lucide-react';
import {HistoryData} from './types';

export function getHistoryColumns(
  showDetail: (record: HistoryData) => void,
  handleExport: (record: HistoryData) => void,
): ColumnsType<HistoryData> {
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
      title: 'PIC',
      dataIndex: 'picName',
      render: (text) => <span className="text-white/90">{text}</span>,
    },
    {
      title: 'Completed Date',
      dataIndex: 'completedDate',
      render: (text) => <span className="text-white/80 font-mono">{text}</span>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (status) => {
        let colorClass = 'bg-green-500/20 text-green-300';
        if (status === 'Late') colorClass = 'bg-red-500/20 text-red-300';

        return (
          <div
            className={`px-3 py-1 rounded-lg font-bold text-xs inline-block text-center min-w-20 ${colorClass}`}
          >
            {status}
          </div>
        );
      },
    },
    {
      title: 'Actions',
      key: 'action',
      width: 250,
      render: (_, record) => (
        <Space size="small">
          <Button
            onClick={() => showDetail(record)}
            className="bg-white/20! border-none text-white! hover:bg-white/30! shadow-sm"
          >
            <Eye size={14} />
            Detail
          </Button>

          <Button
            type="primary"
            onClick={() => handleExport(record)}
            className="bg-[#293038]! border-none hover:bg-[#1a1f24]! shadow-sm"
          >
            <Download size={14} />
            Download
          </Button>
        </Space>
      ),
    },
  ];
}
