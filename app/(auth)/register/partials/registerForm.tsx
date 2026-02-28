import {Form, Input, Button} from 'antd';
import {FormInstance} from 'antd/es/form';
import Link from 'next/link';
import {RegisterSchema} from '../types';

interface RegisterFormProps {
  form: FormInstance<RegisterSchema>;
  isLoading: boolean;
  onSubmit: (values: RegisterSchema) => void;
}

export function RegisterForm({form, isLoading, onSubmit}: RegisterFormProps) {
  return (
    <Form
      form={form}
      name="register_form"
      layout="vertical"
      onFinish={onSubmit}
      requiredMark={false}
      size="large"
      className="w-full"
    >
      <Form.Item<RegisterSchema>
        name="fullname"
        rules={[{required: true, message: 'Please input your name!'}]}
        className="mb-4"
      >
        <Input
          placeholder="Name"
          className="login-input w-full h-11.5! rounded-lg! text-gray-700"
          disabled={isLoading}
        />
      </Form.Item>

      <Form.Item<RegisterSchema>
        name="email"
        rules={[
          {required: true, message: 'Please input your email!'},
          {type: 'email', message: 'Please enter a valid email!'},
        ]}
        className="mb-4"
      >
        <Input
          placeholder="Email"
          className="login-input w-full h-11.5! rounded-lg! text-gray-700"
          disabled={isLoading}
        />
      </Form.Item>

      <Form.Item<RegisterSchema>
        name="password"
        rules={[{required: true, message: 'Please input your password!'}]}
        className="mb-4"
      >
        <Input.Password
          placeholder="Password"
          className="login-input w-full h-11.5! rounded-lg! text-gray-700"
          disabled={isLoading}
        />
      </Form.Item>

      <Form.Item<RegisterSchema>
        name="confirmPassword"
        dependencies={['password']}
        rules={[
          {required: true, message: 'Please confirm your password!'},
          ({getFieldValue}) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('Passwords do not match!'));
            },
          }),
        ]}
        className="mb-8"
      >
        <Input.Password
          placeholder="Confirm Password"
          className="login-input w-full h-11.5! rounded-lg! text-gray-700"
          disabled={isLoading}
        />
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          loading={isLoading}
          className="w-full h-11.5! bg-[#3B3F6F]! hover:bg-[#2d3055]! rounded-lg! font-bold text-lg shadow-lg border-none"
        >
          Sign Up
        </Button>
      </Form.Item>

      <div className="text-center w-full mt-2">
        <Link
          href="/login"
          className="text-white/70 hover:text-white transition-colors text-sm font-medium"
        >
          Already have an account? Sign In
        </Link>
      </div>
    </Form>
  );
}
