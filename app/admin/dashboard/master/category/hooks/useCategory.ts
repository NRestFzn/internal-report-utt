import {Form, Modal} from 'antd';
import {useCallback, useEffect, useState} from 'react';
import {useAppNotification} from '@/lib/use-app-notification';
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from '../services/categoryService';
import {CategoryData, CategoryFormValues} from '../types';

export function useCategoryManagement() {
  const notify = useAppNotification();
  const [data, setData] = useState<CategoryData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryData | null>(
    null,
  );
  const [form] = Form.useForm<CategoryFormValues>();
  const [modal, modalContextHolder] = Modal.useModal();

  const loadCategories = useCallback(async () => {
    setIsLoading(true);

    try {
      const categories = await getCategories();
      setData(categories);
    } catch (error) {
      notify.error(
        'Category Load Failed',
        error instanceof Error ? error.message : 'Failed to load categories',
      );
    } finally {
      setIsLoading(false);
    }
  }, [notify]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const showModal = (category?: CategoryData) => {
    if (category) {
      setEditingCategory(category);
      form.setFieldsValue(category);
    } else {
      setEditingCategory(null);
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      if (editingCategory) {
        await updateCategory(editingCategory.id, values);
        notify.success(
          'Category Updated',
          'Category has been updated successfully.',
        );
      } else {
        await createCategory(values);
        notify.success('Category Created', 'New category has been created.');
      }
      await loadCategories();
      setIsModalOpen(false);
    } catch (error) {
      if (error instanceof Error) {
        notify.error('Category Save Failed', error.message);
      }
    }
  };

  const handleDelete = (categoryId: number) => {
    modal.confirm({
      title: 'Are you sure?',
      content: 'Deleting this category might affect linked MOP documents.',
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          await deleteCategory(categoryId);
          await loadCategories();
          notify.success('Category Deleted', 'Category has been removed.');
        } catch (error) {
          notify.error(
            'Category Delete Failed',
            error instanceof Error
              ? error.message
              : 'Failed to delete category',
          );
        }
      },
    });
  };

  return {
    data,
    isLoading,
    isModalOpen,
    editingCategory,
    form,
    modalContextHolder,
    showModal,
    handleOk,
    handleDelete,
    closeModal: () => setIsModalOpen(false),
    setPrefixUppercase: (value: string) =>
      form.setFieldValue('prefix', value.toUpperCase()),
  };
}
