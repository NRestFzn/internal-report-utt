import {Form, Input, Button} from 'antd';
import {FormInstance} from 'antd/es/form';
import Link from 'next/link';
import {LoginSchema} from '../types';

interface LoginFormProps {
  form: FormInstance<LoginSchema>;
  isLoading: boolean;
  onSubmit: (values: LoginSchema) => void;
}

export function LoginForm({form, isLoading, onSubmit}: LoginFormProps) {
  return (
    <Form
      form={form}
      name="login_form"
      layout="vertical"
      onFinish={onSubmit}
      requiredMark={false}
      size="large"
      className="w-full"
    >
      <Form.Item<LoginSchema>
        name="email"
        rules={[
          {required: true, message: 'Please input your email!'},
          {type: 'email', message: 'Please enter a valid email!'},
        ]}
        className="mb-6"
      >
        <Input
          placeholder="Email"
          disabled={isLoading}
          className="login-input w-md h-11.5! rounded-lg! text-gray-700"
        />
      </Form.Item>

      <Form.Item<LoginSchema>
        name="password"
        rules={[{required: true, message: 'Please input your password!'}]}
        className="mb-2"
      >
        <Input.Password
          placeholder="Password"
          disabled={isLoading}
          className="login-input w-md h-11.5! rounded-lg! text-gray-700"
        />
      </Form.Item>

      <div className="flex justify-start mb-8 w-md mt-2">
        <Link
          href="/forgot-password"
          className="text-[#3B3F6F]/80 text-sm hover:text-[#3B3F6F] hover:underline transition-colors"
        >
          Forgot Password
        </Link>
      </div>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          loading={isLoading}
          className="w-md h-11.5! bg-[#3B3F6F]! hover:bg-[#2d3055]! rounded-lg! font-bold text-lg shadow-lg border-none"
        >
          Sign In
        </Button>
      </Form.Item>

      <div className="text-center w-md mt-2">
        <Link
          href="/register"
          className="text-white/70 hover:text-white transition-colors text-sm font-medium"
        >
          Don't have an account? Sign Up
        </Link>
      </div>
    </Form>
  );
}
