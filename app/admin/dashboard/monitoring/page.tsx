'use client';

import {Table} from 'antd';
import {getMonitoringColumns} from './columns';
import {useMonitoring} from './hooks/useMonitoring';
import {MonitoringDetailModal} from './partials/monitoringDetailModal';
import {MonitoringHeader} from './partials/monitoringHeader';
import {MonitoringRevisiModal} from './partials/monitoringRevisiModal';

export default function MonitoringPage() {
  const {
    data,
    isLoading,
    isDetailOpen,
    viewingReport,
    isRevisiOpen,
    formRevisi,
    modalContextHolder,
    handleApprove,
    openRevisiModal,
    handleRevisiSubmit,
    showDetail,
    closeDetail,
    closeRevisi,
    handlePrint,
  } = useMonitoring();

  const columns = getMonitoringColumns(
    handleApprove,
    openRevisiModal,
    showDetail,
    handlePrint,
  );

  return (
    <div className="w-full h-fit flex flex-col p-2 pb-10">
      <div className="w-full bg-[#6168FF] rounded-4xl p-4 sm:p-6 md:p-10 shadow-2xl h-fit min-h-150 text-white overflow-hidden">
        {modalContextHolder}
        <MonitoringHeader />

        <Table
          columns={columns}
          dataSource={data}
          loading={isLoading}
          pagination={{
            pageSize: 10,
            placement: ['bottomCenter'],
            className: 'custom-pagination-white !mt-8',
          }}
          className="custom-admin-table"
        />

        <MonitoringRevisiModal
          open={isRevisiOpen}
          form={formRevisi}
          onSubmit={handleRevisiSubmit}
          onClose={closeRevisi}
        />
        <MonitoringDetailModal
          open={isDetailOpen}
          viewingReport={viewingReport}
          onClose={closeDetail}
        />
      </div>
    </div>
  );
}
