import {Form} from 'antd';
import {useState} from 'react';
import {useRouter} from 'next/navigation';
import {useAppNotification} from '@/lib/use-app-notification';
import {loginUser} from '../services/loginService';
import {LoginSchema} from '../types';

export function useLogin() {
  const notify = useAppNotification();
  const router = useRouter();
  const [form] = Form.useForm<LoginSchema>();
  const [isLoading, setIsLoading] = useState(false);

  const onFinish = async (values: LoginSchema) => {
    setIsLoading(true);
    try {
      await loginUser(values);

      notify.success('Login Success', 'Welcome to User Dashboard!');

      router.push('/dashboard');
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
