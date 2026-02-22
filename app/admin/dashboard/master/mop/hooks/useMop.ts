import {Form, Modal} from 'antd';
import {useCallback, useEffect, useState} from 'react';
import {useAppNotification} from '@/lib/use-app-notification';
import {
  CategoryOption,
  createMop,
  deleteMop,
  getCategoryOptions,
  getMops,
  updateMop,
} from '../services/mopService';
import {MopData, MopFormValues} from '../types';

export function useMopManagement() {
  const notify = useAppNotification();
  const [data, setData] = useState<MopData[]>([]);
  const [categoryOptions, setCategoryOptions] = useState<CategoryOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMop, setEditingMop] = useState<MopData | null>(null);
  const [form] = Form.useForm<MopFormValues>();
  const [modal, modalContextHolder] = Modal.useModal();

  const loadMops = useCallback(async () => {
    setIsLoading(true);

    try {
      const [mops, categories] = await Promise.all([
        getMops(),
        getCategoryOptions(),
      ]);

      setData(mops);
      setCategoryOptions(categories);
    } catch (error) {
      notify.error(
        'MOP Load Failed',
        error instanceof Error ? error.message : 'Failed to load MOP data',
      );
    } finally {
      setIsLoading(false);
    }
  }, [notify]);

  useEffect(() => {
    loadMops();
  }, [loadMops]);

  const showModal = (mop?: MopData) => {
    if (mop) {
      setEditingMop(mop);
      form.setFieldsValue({
        docNumber: mop.docNumber,
        title: mop.title,
        categoryId: mop.categoryId ?? undefined,
      });
    } else {
      setEditingMop(null);
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingMop) {
        await updateMop(editingMop.mopId, values);
        notify.success('MOP Updated', 'MOP document has been updated.');
      } else {
        await createMop(values);
        notify.success('MOP Created', 'New MOP document has been created.');
      }
      await loadMops();
      setIsModalOpen(false);
    } catch (error) {
      if (error instanceof Error) {
        notify.error('MOP Save Failed', error.message);
      }
    }
  };

  const handleDelete = (mopId: number) => {
    modal.confirm({
      title: 'Delete MOP Document?',
      content: 'This will remove the document permanently.',
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          await deleteMop(mopId);
          await loadMops();
          notify.success('MOP Deleted', 'MOP document has been removed.');
        } catch (error) {
          notify.error(
            'MOP Delete Failed',
            error instanceof Error ? error.message : 'Failed to delete MOP',
          );
        }
      },
    });
  };

  return {
    data,
    categoryOptions,
    isLoading,
    isModalOpen,
    editingMop,
    form,
    modalContextHolder,
    showModal,
    handleOk,
    handleDelete,
    closeModal: () => setIsModalOpen(false),
  };
}
