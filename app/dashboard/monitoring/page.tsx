'use client';

import {Table, Tabs, Select} from 'antd';
import {useRouter} from 'next/navigation';
import {useUserMonitoring} from './hooks/useMonitoring';
import {getMonitoringColumns} from './columns';
import {MonitoringDetailModal} from './partials/monitoringDetailModal';

export default function UserMonitoringPage() {
  const router = useRouter();
  const {
    filteredData,
    isLoading,
    activeQuarter,
    setActiveQuarter,
    selectedYear,
    setSelectedYear,
    yearOptions,
    isDetailOpen,
    viewingReport,
    showDetail,
    closeDetail,
  } = useUserMonitoring();

  const columns = getMonitoringColumns(router, showDetail);

  const tabBarExtraContent = (
    <div className="flex gap-3 items-center">
      <span className="text-white/70 text-sm font-medium">Year:</span>
      <Select
        style={{width: 120}}
        className="custom-select-reports"
        popupClassName="custom-select-dropdown"
        options={yearOptions}
        value={selectedYear}
        onChange={setSelectedYear}
      />
    </div>
  );

  const items = [
    {
      key: '1',
      label: 'Quarter 1',
      children: (
        <ReportTable
          columns={columns}
          data={filteredData}
          loading={isLoading}
        />
      ),
    },
    {
      key: '2',
      label: 'Quarter 2',
      children: (
        <ReportTable
          columns={columns}
          data={filteredData}
          loading={isLoading}
        />
      ),
    },
    {
      key: '3',
      label: 'Quarter 3',
      children: (
        <ReportTable
          columns={columns}
          data={filteredData}
          loading={isLoading}
        />
      ),
    },
    {
      key: '4',
      label: 'Quarter 4',
      children: (
        <ReportTable
          columns={columns}
          data={filteredData}
          loading={isLoading}
        />
      ),
    },
  ];

  return (
    <div className="w-full h-fit flex flex-col p-4 md:p-8 pb-20">
      <div className="bg-[#6168FF] rounded-4xl p-8 md:p-10 shadow-2xl h-fit min-h-150">
        <div className="mb-8">
          <h1 className="text-white text-3xl md:text-4xl font-bold mb-2">
            Report History
          </h1>
          <p className="text-white/70 text-lg">
            Track the status of your submitted reports
          </p>
        </div>

        <Tabs
          activeKey={activeQuarter}
          onChange={setActiveQuarter}
          items={items}
          tabBarExtraContent={tabBarExtraContent}
          className="custom-tabs-reports"
        />
      </div>

      <MonitoringDetailModal
        open={isDetailOpen}
        viewingReport={viewingReport}
        onClose={closeDetail}
      />
    </div>
  );
}

const ReportTable = ({
  columns,
  data,
  loading,
}: {
  columns: any;
  data: any;
  loading: boolean;
}) => (
  <Table
    columns={columns}
    dataSource={data}
    loading={loading}
    pagination={{
      pageSize: 5,
      position: ['bottomCenter'],
      className: 'custom-pagination-white !mt-8',
    }}
    className="custom-admin-table mt-4"
  />
);
