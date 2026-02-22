import {Button, Space} from 'antd';
import type {ColumnsType} from 'antd/es/table';
import {Pencil, Trash2} from 'lucide-react';
import {MopData} from './types';

export function getMopColumns(
  showModal: (mop?: MopData) => void,
  handleDelete: (mopId: number) => void,
): ColumnsType<MopData> {
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
      title: 'Document No',
      dataIndex: 'docNumber',
      width: 150,
      render: (text) => (
        <span className="text-white/80 font-mono text-sm">{text}</span>
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
      render: (text) => (
        <span className="bg-white/10 px-3 py-1 rounded-lg text-white text-sm">
          {text}
        </span>
      ),
    },
    {
      title: 'Actions',
      key: 'action',
      width: 200,
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<Pencil size={14} />}
            onClick={() => showModal(record)}
            className="bg-[#293038]! border-none hover:bg-[#1a1f24]! shadow-sm"
          >
            Edit
          </Button>
          <Button
            danger
            icon={<Trash2 size={14} />}
            onClick={() => handleDelete(record.mopId)}
            className="border-none shadow-sm bg-white/10"
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];
}
