import {Table} from 'antd';
import type {ColumnsType} from 'antd/es/table';
import {HistoryData} from '../types';

interface HistoryTableSectionProps {
  columns: ColumnsType<HistoryData>;
  data: HistoryData[];
  isLoading?: boolean;
}

export function HistoryTableSection({
  columns,
  data,
  isLoading,
}: HistoryTableSectionProps) {
  return (
    <div className="bg-[#6168FF] rounded-4xl p-8 shadow-2xl h-fit min-h-100 text-white">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Archives</h2>
        <p className="text-white/70">Historical data of all approved reports</p>
      </div>

      <Table
        columns={columns}
        dataSource={data}
        loading={isLoading}
        pagination={{
          pageSize: 5,
          placement: ['bottomCenter'],
          className: 'custom-pagination-white !mt-8',
        }}
        className="custom-admin-table"
      />
    </div>
  );
}
