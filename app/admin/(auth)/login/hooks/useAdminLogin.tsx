import {Form} from 'antd';
import {useState} from 'react';
import {useRouter} from 'next/navigation';
import {useAppNotification} from '@/lib/use-app-notification';
import {loginAdmin} from '../services/loginService';
import {LoginSchema} from '../types';

export function useAdminLogin() {
  const notify = useAppNotification();
  const router = useRouter();
  const [form] = Form.useForm<LoginSchema>();
  const [isLoading, setIsLoading] = useState(false);

  const onFinish = async (values: LoginSchema) => {
    setIsLoading(true);
    try {
      await loginAdmin(values);

      notify.success('Login Success', 'Welcome back, Administrator.');

      router.replace('/admin/dashboard');
    } catch (error) {
      if (error instanceof Error) {
        notify.error('Login Failed', error.message);
      } else {
        notify.error('Login Failed', 'Invalid credentials or network error.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    isLoading,
    onFinish,
  };
}
