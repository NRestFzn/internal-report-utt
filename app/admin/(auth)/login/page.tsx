'use client';

import Image from 'next/image';
import {useAdminLogin} from './hooks/useLogin';
import {AdminLoginForm} from './partials/loginForm';

export default function AdminLoginPage() {
  const {form, isLoading, onFinish} = useAdminLogin();

  return (
    <div className="min-h-screen w-full bg-brand-gradient flex items-center justify-center p-0">
      <div className="w-full max-w-360 flex flex-row items-center justify-center gap-0">
        <div className="flex-1 flex flex-col items-center justify-center w-full">
          <div className="mb-12 relative w-61.5 h-35">
            <Image
              src="/utt-main-logo.svg"
              alt="United Transworld Trading Logo"
              fill
              className="object-contain"
              priority
            />
          </div>

          <div className="w-md">
            <AdminLoginForm
              form={form}
              isLoading={isLoading}
              onSubmit={onFinish}
            />
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center w-full relative">
          <h1 className="font-micro5 text-white text-[36px] leading-tight tracking-widest text-center -mb-5 z-10 drop-shadow-md max-w-150">
            INTERNAL REPORT UNITED TRANSWORLD TRADING
          </h1>

          <div className="relative w-150 h-125">
            <Image
              src="/crowd-login.svg"
              alt="Workers Illustration"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
}
