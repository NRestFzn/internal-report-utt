'use client';

import {Table, ConfigProvider} from 'antd';
import {getTaskColumns} from './columns';
import {useTaskSchedule} from './hooks/useTask';
import {TaskScheduleDetailModal} from './partials/taskScheduleDetailModal';
import {TaskScheduleFormModal} from './partials/taskScheduleFormModal';
import {TaskScheduleHeader} from './partials/taskScheduleHeader';

export default function TaskSchedulePage() {
  const {
    data,
    isLoading,
    mopOptions,
    picOptions,
    isModalOpen,
    editingTask,
    isDetailOpen,
    viewingTask,
    form,
    modalContextHolder,
    showModal,
    showDetail,
    handleOk,
    handleDelete,
    closeModal,
    closeDetail,
  } = useTaskSchedule();

  const columns = getTaskColumns(showModal, showDetail, handleDelete);

  return (
    <div className="w-full h-fit flex flex-col p-2 pb-10">
      {modalContextHolder}

      <div className="w-full bg-[#6168FF] rounded-4xl p-4 sm:p-6 md:p-10 shadow-2xl h-fit min-h-150 text-white overflow-hidden">
        <TaskScheduleHeader onCreate={() => showModal()} />

        <ConfigProvider
          theme={{
            components: {
              Table: {
                colorBgContainer: 'transparent',
                colorTextHeading: '#ffffff',
                colorText: '#ffffff',
                borderColor: 'rgba(255, 255, 255, 0.1)',
                headerBg: 'rgba(255, 255, 255, 0.1)',
                headerSplitColor: 'transparent',
              },
              Pagination: {
                colorText: '#ffffff',
                colorPrimary: '#ffffff',
                itemActiveBg: 'rgba(255, 255, 255, 0.2)',
              },
              Modal: {
                titleFontSize: 20,
                headerBg: '#ffffff',
              },
              Select: {selectorBg: '#ffffff'},
              DatePicker: {
                colorBgContainer: '#ffffff',
              },
            },
          }}
        >
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

          <TaskScheduleFormModal
            open={isModalOpen}
            editingTask={editingTask}
            form={form}
            mopOptions={mopOptions}
            picOptions={picOptions}
            onSubmit={handleOk}
            onClose={closeModal}
          />
          <TaskScheduleDetailModal
            open={isDetailOpen}
            viewingTask={viewingTask}
            onClose={closeDetail}
          />
        </ConfigProvider>
      </div>
    </div>
  );
}
