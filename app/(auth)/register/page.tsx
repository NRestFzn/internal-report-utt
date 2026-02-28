'use client';

import Image from 'next/image';
import {useRegister} from './hooks/useRegister';
import {RegisterForm} from './partials/registerForm';

export default function RegisterPage() {
  const {form, isLoading, onFinish} = useRegister();

  return (
    <div className="min-h-screen w-full bg-brand-gradient flex items-center justify-center p-0">
      <div className="w-full max-w-360 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-0 mt-8 lg:mt-0">
        <div className="flex-1 flex flex-col items-center justify-center w-full px-4 lg:px-0">
          <div className="mb-8 lg:mb-12 relative w-48 h-28 lg:w-61.5 lg:h-35">
            <Image
              src="/utt-main-logo.svg"
              alt="United Transworld Trading Logo"
              fill
              sizes="(max-width: 768px) 4rem, 4rem"
              className="object-contain"
              priority
            />
          </div>

          <div className="w-full max-w-[320px] sm:max-w-sm md:max-w-md px-2 sm:px-0">
            <RegisterForm
              form={form}
              isLoading={isLoading}
              onSubmit={onFinish}
            />
          </div>
        </div>

        <div className="flex-1 hidden lg:flex flex-col items-center justify-center w-full relative">
          <h1 className="font-micro5 text-white text-[28px] lg:text-[36px] leading-tight tracking-widest text-center -mb-5 z-10 drop-shadow-md max-w-150 px-4 lg:px-0">
            INTERNAL REPORT UNITED TRANSWORLD TRADING
          </h1>

          <div className="relative w-full max-w-150 aspect-[6/5]">
            <Image
              src="/crowd-login.svg"
              alt="Register Flow"
              fill
              sizes="50vw"
              className="object-contain"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
}
