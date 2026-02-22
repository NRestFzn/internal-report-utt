import {Form, Input, Button, Upload} from 'antd';
import {FormInstance} from 'antd/es/form';
import {Upload as UploadIcon} from 'lucide-react';
import {ProfileData, ProfileFormValues} from '../types';
import {useState, useEffect} from 'react';

interface ProfileFormProps {
  form: FormInstance<ProfileFormValues>;
  profile: ProfileData | null;
  isSubmitting: boolean;
  onSubmit: (values: ProfileFormValues) => void;
}

export function ProfileForm({
  form,
  profile,
  isSubmitting,
  onSubmit,
}: ProfileFormProps) {
  const avatarFileList = Form.useWatch('avatarFileList', form);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    const file = avatarFileList?.[0];
    if (file) {
      if (file.url) {
        setPreviewUrl(file.url);
      } else if (file.originFileObj) {
        const objectUrl = URL.createObjectURL(file.originFileObj);
        setPreviewUrl(objectUrl);
        return () => URL.revokeObjectURL(objectUrl);
      }
    } else {
      setPreviewUrl(null);
    }
  }, [avatarFileList]);

  const uploadProps = {
    beforeUpload: () => false,
    maxCount: 1,
    showUploadList: false,
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onSubmit}
      requiredMark={false}
      className="w-full flex flex-col gap-8"
    >
      <div className="bg-[#6168FF] p-8 rounded-3xl shadow-lg border border-white/10">
        <h3 className="text-xl font-bold text-white mb-6 border-b border-white/20 pb-4">
          Basic Information
        </h3>

        <div className="flex flex-col md:flex-row gap-8 mb-8">
          <div className="flex flex-col items-center md:items-start gap-2">
            <Form.Item
              name="avatarFileList"
              valuePropName="fileList"
              getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
              className="mb-0"
            >
              <Upload {...uploadProps}>
                <div className="w-35 h-35 rounded-full border-2 border-dashed border-white/40 hover:border-white bg-white/5 overflow-hidden flex items-center justify-center transition-all cursor-pointer relative group">
                  {previewUrl ? (
                    <>
                      <img
                        src={previewUrl}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity text-white">
                        <UploadIcon size={24} className="mb-1" />
                        <span className="text-xs font-semibold">Change</span>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-white/80 group-hover:text-white transition-colors">
                      <UploadIcon size={24} className="mb-2" />
                      <div className="font-semibold text-sm">Upload</div>
                    </div>
                  )}
                </div>
              </Upload>
            </Form.Item>
            <p className="text-xs text-white/60">Max size 2MB (JPG/PNG)</p>
          </div>

          <div className="flex-1 space-y-4 w-full">
            <div>
              <label className="text-xs font-bold text-white/60 uppercase tracking-wider">
                Email Address
              </label>
              <Input
                value={profile?.email}
                disabled
                className="mt-1 h-11! rounded-xl! bg-white/10! text-white/80! border-transparent!"
              />
              <p className="text-[11px] text-white/50 mt-1">
                *Email cannot be changed.
              </p>
            </div>
            <div>
              <label className="text-xs font-bold text-white/60 uppercase tracking-wider">
                Current Role
              </label>
              <div className="mt-1">
                <span className="bg-[#293038] text-white px-4 py-2 rounded-lg font-bold text-sm uppercase tracking-wider shadow-sm inline-block">
                  {profile?.role}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Form.Item
            name="fullname"
            label={<span className="font-bold text-white">Full Name</span>}
            rules={[{required: true, message: 'Please input your full name!'}]}
          >
            <Input size="large" className="rounded-xl!" />
          </Form.Item>

          <Form.Item
            name="division"
            label={
              <span className="font-bold text-white">
                Division / Department
              </span>
            }
          >
            <Input
              size="large"
              placeholder="e.g. Engineering, IT Support"
              className="rounded-xl!"
            />
          </Form.Item>
        </div>
      </div>
      <div className="bg-[#293038] p-8 rounded-3xl shadow-lg border border-white/10">
        <h3 className="text-xl font-bold text-white mb-2">Security</h3>
        <p className="text-sm text-white/60 mb-6 pb-4 border-b border-white/10">
          Leave blank if you don't want to change your password.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Form.Item
            name="password"
            label={<span className="font-bold text-white">New Password</span>}
            rules={[
              {min: 6, message: 'Password must be at least 6 characters'},
            ]}
          >
            <Input.Password
              size="large"
              placeholder="Enter new password"
              className="rounded-xl!"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label={
              <span className="font-bold text-white">Confirm New Password</span>
            }
            dependencies={['password']}
            rules={[
              ({getFieldValue}) => ({
                validator(_, value) {
                  if (!value && !getFieldValue('password'))
                    return Promise.resolve();
                  if (value === getFieldValue('password'))
                    return Promise.resolve();
                  return Promise.reject(
                    new Error('The new passwords do not match!'),
                  );
                },
              }),
            ]}
          >
            <Input.Password
              size="large"
              placeholder="Confirm new password"
              className="rounded-xl!"
            />
          </Form.Item>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <Button
          type="primary"
          htmlType="submit"
          loading={isSubmitting}
          className="h-12! px-12 bg-[#1273D4]! hover:bg-[#0f62b5]! border-none! rounded-xl! font-bold text-base shadow-lg"
        >
          Save Profile Changes
        </Button>
      </div>
    </Form>
  );
}
