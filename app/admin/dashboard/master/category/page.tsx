'use client';

import {Button, Table} from 'antd';
import {Plus} from 'lucide-react';
import {getCategoryColumns} from './columns';
import {useCategoryManagement} from './hooks/useCategory';
import {CategoryFormModal} from './partials/categoryFormModal';

export default function CategoryManagementPage() {
  const {
    data,
    isLoading,
    isModalOpen,
    editingCategory,
    form,
    modalContextHolder,
    showModal,
    handleOk,
    handleDelete,
    closeModal,
    setPrefixUppercase,
  } = useCategoryManagement();
  const columns = getCategoryColumns(showModal, handleDelete);

  return (
    <div className="w-full h-fit flex flex-col p-2 pb-10">
      {modalContextHolder}
      <div className="admin-surface min-h-150">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-white text-3xl font-bold mb-2">
              Category Management
            </h1>
            <p className="text-white/70 text-lg">
              Organize maintenance types and prefixes
            </p>
          </div>

          <Button
            type="primary"
            icon={<Plus size={18} />}
            onClick={() => showModal()}
            className="bg-[#293038]! hover:bg-[#1a1f24]! border-none h-10.5 px-6 rounded-xl font-semibold text-base shadow-lg"
          >
            Add Category
          </Button>
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
        <CategoryFormModal
          open={isModalOpen}
          editingCategory={editingCategory}
          form={form}
          onSubmit={handleOk}
          onClose={closeModal}
          onPrefixChange={setPrefixUppercase}
        />
      </div>
    </div>
  );
}
