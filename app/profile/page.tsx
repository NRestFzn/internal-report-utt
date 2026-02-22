'use client';

import {Spin} from 'antd';
import {ArrowLeft} from 'lucide-react';
import {useRouter} from 'next/navigation';
import {useProfile} from './hooks/useProfile';
import {ProfileForm} from './partials/profileForm';

export default function ProfilePage() {
  const router = useRouter();
  const {form, profile, isLoading, isSubmitting, onFinish} = useProfile();

  return (
    <div className="w-full min-h-screen bg-brand-gradient flex flex-col p-4 md:p-8 pb-20">
      <div className="w-full max-w-4xl mx-auto">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-white/80 hover:text-white mb-6 w-fit transition-colors cursor-pointer"
        >
          <ArrowLeft size={20} />
          <span className="font-semibold text-lg">Back</span>
        </button>

        <div className="mb-8">
          <h1 className="text-white text-3xl md:text-4xl font-bold mb-2">
            My Profile
          </h1>
          <p className="text-white/70 text-lg">
            Manage your personal information and security settings
          </p>
        </div>

        <Spin
          spinning={isLoading}
          size="large"
          description="Loading profile..."
        >
          <ProfileForm
            form={form}
            profile={profile}
            isSubmitting={isSubmitting}
            onSubmit={onFinish}
          />
        </Spin>
      </div>
    </div>
  );
}
