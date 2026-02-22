import {useState, useEffect, useCallback, useMemo} from 'react';
import {useAppNotification} from '@/lib/use-app-notification';
import {getUserTasks, getCategoryOptions} from '../services/reportsService';
import {CategoryOption, UserTaskData} from '../types';
import dayjs from 'dayjs';

export function useReports() {
  const notify = useAppNotification();
  const [tasks, setTasks] = useState<UserTaskData[]>([]);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [activeQuarter, setActiveQuarter] = useState('1');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [fetchedTasks, fetchedCategories] = await Promise.all([
        getUserTasks(),
        getCategoryOptions(),
      ]);
      setTasks(fetchedTasks);
      setCategories(fetchedCategories);
    } catch (error: any) {
      notify.error('Failed to load tasks', error.message);
    } finally {
      setIsLoading(false);
    }
  }, [notify]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const month = dayjs(task.scheduledDate).month() + 1;
      let taskQuarter = '1';

      if (month >= 4 && month <= 6) taskQuarter = '2';
      else if (month >= 7 && month <= 9) taskQuarter = '3';
      else if (month >= 10 && month <= 12) taskQuarter = '4';

      const matchQuarter = taskQuarter === activeQuarter;
      const matchCategory = selectedCategory
        ? task.category === selectedCategory
        : true;

      return matchQuarter && matchCategory;
    });
  }, [tasks, activeQuarter, selectedCategory]);

  return {
    filteredTasks,
    categories,
    isLoading,
    activeQuarter,
    setActiveQuarter,
    selectedCategory,
    setSelectedCategory,
  };
}
