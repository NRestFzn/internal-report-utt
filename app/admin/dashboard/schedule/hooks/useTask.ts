import {Form, Modal} from 'antd';
import {useCallback, useEffect, useState} from 'react';
import {useAppNotification} from '@/lib/use-app-notification';
import {
  createTask,
  deleteTask,
  getTaskOptions,
  getTasks,
  SelectOption,
  updateTask,
} from '../services/taskService';
import {TaskData, TaskFormValues} from '../types';
import dayjs from 'dayjs';

export function useTaskSchedule() {
  const notify = useAppNotification();
  const [data, setData] = useState<TaskData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mopOptions, setMopOptions] = useState<SelectOption[]>([]);
  const [picOptions, setPicOptions] = useState<SelectOption[]>([]);

  // State Modal Form (Create/Edit)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskData | null>(null);

  // State Modal Detail (View Only)
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [viewingTask, setViewingTask] = useState<TaskData | null>(null);

  const [form] = Form.useForm<TaskFormValues>();
  const [modal, modalContextHolder] = Modal.useModal();

  const loadTasks = useCallback(async () => {
    setIsLoading(true);

    try {
      const [tasks, options] = await Promise.all([
        getTasks(),
        getTaskOptions(),
      ]);
      setData(tasks);
      setMopOptions(options.mops);
      setPicOptions(options.pics);
    } catch (error) {
      notify.error(
        'Schedule Load Failed',
        error instanceof Error ? error.message : 'Failed to load schedules',
      );
    } finally {
      setIsLoading(false);
    }
  }, [notify]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const showModal = (task?: TaskData) => {
    if (task) {
      setEditingTask(task);
      form.setFieldsValue({
        mopId: task.mopId,
        picId: task.picId,
        notes: task.notes,
        scheduledDate: dayjs(task.scheduledDate),
      });
    } else {
      setEditingTask(null);
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingTask) {
        await updateTask(editingTask.taskId, values);
        notify.success(
          'Schedule Updated',
          'Task schedule has been updated successfully.',
        );
      } else {
        await createTask(values);
        notify.success('Task Assigned', 'New task has been assigned.');
      }
      await loadTasks();
      setIsModalOpen(false);
    } catch (error) {
      if (error instanceof Error) {
        notify.error('Schedule Save Failed', error.message);
      }
    }
  };

  const showDetail = (task: TaskData) => {
    setViewingTask(task);
    setIsDetailOpen(true);
  };

  const handleDelete = (taskId: number) => {
    modal.confirm({
      title: 'Cancel Schedule?',
      content: 'This task will be removed from PIC dashboard.',
      okText: 'Yes, Cancel',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        try {
          await deleteTask(taskId);
          await loadTasks();
          notify.info('Task Cancelled', 'Task has been removed from schedule.');
        } catch (error) {
          notify.error(
            'Task Cancel Failed',
            error instanceof Error ? error.message : 'Failed to delete task',
          );
        }
      },
    });
  };

  return {
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
    closeModal: () => setIsModalOpen(false),
    closeDetail: () => setIsDetailOpen(false),
  };
}
