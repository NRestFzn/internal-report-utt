import {Button, Space, Tag} from 'antd';
import type {ColumnsType} from 'antd/es/table';
import {Pencil, Trash2, Calendar, Eye} from 'lucide-react';
import {TaskData} from './types';

export function getTaskColumns(
  showModal: (task?: TaskData) => void,
  showDetail: (task: TaskData) => void,
  handleDelete: (taskId: number) => void,
): ColumnsType<TaskData> {
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
      title: 'Task / MOP',
      dataIndex: 'mopTitle',
      render: (text) => (
        <span className="text-white font-medium text-base line-clamp-1 max-w-62.5">
          {text}
        </span>
      ),
    },
    {
      title: 'Assigned To',
      dataIndex: 'picName',
      render: (text) => <span className="text-white/90">{text}</span>,
    },
    {
      title: 'Scheduled Date',
      dataIndex: 'scheduledDate',
      render: (text) => (
        <div className="flex items-center gap-2 text-white/80">
          <Calendar size={14} />
          <span>{text}</span>
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (status) => {
        let color = 'default';
        if (status === 'Completed') color = 'success';
        if (status === 'Overdue') color = 'error';
        if (status === 'In Progress') color = 'processing';

        return (
          <Tag
            color={color}
            className="font-semibold border-none px-3 py-0.5 rounded-md"
          >
            {status}
          </Tag>
        );
      },
    },
    {
      title: 'Actions',
      key: 'action',
      width: 180,
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
            onClick={() => showModal(record)}
            className="bg-[#293038]! border-none hover:bg-[#1a1f24]! shadow-sm"
          >
            <Pencil size={14} />
            Edit
          </Button>
          <Button
            danger
            onClick={() => handleDelete(record.taskId)}
            className="border-none shadow-sm bg-white/10"
          >
            <Trash2 size={14} />
            Delete
          </Button>
        </Space>
      ),
    },
  ];
}
