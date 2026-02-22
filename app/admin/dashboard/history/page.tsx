'use client';

import {getHistoryColumns} from './columns';
import {useHistory} from './hooks/useHistory';
import {HistoryChartSection} from './partials/historyChartSection';
import {HistoryDetailModal} from './partials/historyDetailModal';
import {HistoryTableSection} from './partials/historyTableSection';

export default function HistoryPage() {
  const {
    data,
    chartData,
    isLoading,
    isDetailOpen,
    viewingHistory,
    showDetail,
    closeDetail,
    handleExport,
  } = useHistory();

  const columns = getHistoryColumns(showDetail, handleExport);

  return (
    <div className="w-full h-fit flex flex-col p-2 pb-10 space-y-6">
      <HistoryChartSection chartData={chartData} />
      <HistoryTableSection
        columns={columns}
        data={data}
        isLoading={isLoading}
      />
      <HistoryDetailModal
        isOpen={isDetailOpen}
        viewingHistory={viewingHistory}
        onClose={closeDetail}
        onDownload={handleExport}
      />
    </div>
  );
}
