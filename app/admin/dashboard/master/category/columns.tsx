import {Button, Space} from 'antd';
import type {ColumnsType} from 'antd/es/table';
import {FileText, Pencil, Trash2} from 'lucide-react';
import {CategoryData} from './types';

export function getCategoryColumns(
  showModal: (category?: CategoryData) => void,
  handleDelete: (categoryId: number) => void,
): ColumnsType<CategoryData> {
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
      title: 'Category Name',
      dataIndex: 'name',
      render: (text) => (
        <div className="flex items-center gap-3">
          <span className="text-white font-bold text-base">{text}</span>
        </div>
      ),
    },
    {
      title: 'Prefix Code',
      dataIndex: 'prefix',
      render: (text) => (
        <span className="bg-white/20 px-2 py-1 rounded text-white font-mono text-sm tracking-wider">
          {text}
        </span>
      ),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      render: (text) => <span className="text-white/80">{text}</span>,
    },
    {
      title: 'Documents',
      dataIndex: 'docCount',
      render: (count) => (
        <div className="flex items-center gap-2 text-white/90">
          <FileText size={14} />
          <span>{count} MOPs</span>
        </div>
      ),
    },
    {
      title: 'Actions',
      key: 'action',
      width: 180,
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
            onClick={() => handleDelete(record.id)}
            className="border-none shadow-sm bg-white/10"
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];
}
