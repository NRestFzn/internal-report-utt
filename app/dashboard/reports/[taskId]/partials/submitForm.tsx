import {Button, Form, Input, Upload, Modal} from 'antd';
import {FormInstance} from 'antd/es/form';
import {PlusOutlined, MinusCircleOutlined} from '@ant-design/icons';
import {Inbox} from 'lucide-react';
import {ReportFormValues} from '../types';

const {Dragger} = Upload;

interface SubmitFormProps {
  form: FormInstance<ReportFormValues>;
  isSubmitting: boolean;
  onFinish: (values: ReportFormValues) => void;
}

export function SubmitForm({form, isSubmitting, onFinish}: SubmitFormProps) {
  const [modal, modalContextHolder] = Modal.useModal();

  const uploadProps = {
    beforeUpload: () => false,
    maxCount: 1,
    className: 'custom-dragger',
  };

  const handleConfirmSubmit = (values: ReportFormValues) => {
    modal.confirm({
      title: 'Submit Report?',
      content:
        'Please ensure all evidence photos and descriptions are correct. Submitted reports will be sent to the Admin for approval.',
      okText: 'Yes, Submit',
      cancelText: 'Check Again',
      centered: true,
      onOk: () => {
        onFinish(values);
      },
    });
  };

  return (
    <div className="bg-[#A4A9FF] rounded-4xl p-8 md:p-10 shadow-xl relative">
      {modalContextHolder}
      <Form
        form={form}
        layout="vertical"
        onFinish={handleConfirmSubmit}
        requiredMark={false}
      >
        <Form.Item
          name="supervisorName"
          label={
            <span className="font-bold text-white text-lg">
              Supervisor Name
            </span>
          }
          rules={[{required: true, message: 'Please input supervisor name!'}]}
          className="mb-8 max-w-md"
        >
          <Input
            size="large"
            placeholder="E.g., Budi Santoso"
            className="rounded-xl! h-12!"
          />
        </Form.Item>

        <div className="border-t border-white/20 pt-8 mb-4">
          <h3 className="text-2xl font-bold text-white mb-2">
            Execution & Evidence
          </h3>
          <p className="text-white/80 mb-6">
            Fill in the actions taken and the expected outcomes based on the
            MOP.
          </p>
        </div>

        <Form.List name="evidences">
          {(fields, {add, remove}) => (
            <div className="space-y-8">
              {fields.map(({key, name, ...restField}, index) => (
                <div
                  key={key}
                  className="relative bg-[#6168FF] rounded-3xl p-6 md:p-8 shadow-lg"
                >
                  <div className="flex justify-between items-center mb-6 border-b border-white/20 pb-4">
                    <h4 className="font-bold text-xl text-white">
                      Action Item #{index + 1}
                    </h4>
                    {fields.length > 1 && (
                      <Button
                        type="text"
                        danger
                        className="text-white hover:bg-red-500/20! hover:text-red-200!"
                        onClick={() => remove(name)}
                        icon={<MinusCircleOutlined />}
                      >
                        Remove Item
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                    <div className="flex flex-col gap-4">
                      <Form.Item
                        {...restField}
                        name={[name, 'actionTitle']}
                        label={
                          <span className="font-bold text-white text-lg">
                            Action
                          </span>
                        }
                        rules={[
                          {required: true, message: 'Action is required'},
                        ]}
                      >
                        <Input.TextArea
                          rows={2}
                          placeholder="e.g. Check for unsafe actions..."
                          className="rounded-xl!"
                        />
                      </Form.Item>

                      <Form.Item
                        {...restField}
                        name={[name, 'actionFileList']}
                        valuePropName="fileList"
                        getValueFromEvent={(e) =>
                          Array.isArray(e) ? e : e?.fileList
                        }
                        rules={[
                          {required: true, message: 'Action photo is required'},
                        ]}
                        className="upload-wrapper"
                      >
                        <Dragger {...uploadProps}>
                          <p className="ant-upload-drag-icon flex justify-center text-white/80">
                            <Inbox size={40} />
                          </p>
                          <p className="text-white font-medium">
                            Drag and drop files here, or
                          </p>
                          <Button className="mt-2 bg-[#293038]! border-none! text-white! hover:bg-[#1a1f24]!">
                            Select File
                          </Button>
                        </Dragger>
                      </Form.Item>

                      <Form.Item
                        {...restField}
                        name={[name, 'actionDesc']}
                        label={
                          <span className="font-semibold text-white">
                            Photo Description{' '}
                            <span className="text-red-400">*</span>
                          </span>
                        }
                        rules={[
                          {required: true, message: 'Description is required'},
                        ]}
                      >
                        <Input.TextArea
                          rows={3}
                          placeholder="Describe the action taken..."
                          className="rounded-xl!"
                        />
                      </Form.Item>
                    </div>

                    <div className="flex flex-col gap-4">
                      <Form.Item
                        {...restField}
                        name={[name, 'outcomeTitle']}
                        label={
                          <span className="font-bold text-white text-lg">
                            Expected Outcome
                          </span>
                        }
                        rules={[
                          {
                            required: true,
                            message: 'Expected outcome is required',
                          },
                        ]}
                      >
                        <Input.TextArea
                          rows={2}
                          placeholder="e.g. No unsafe conditions identified..."
                          className="rounded-xl!"
                        />
                      </Form.Item>

                      <Form.Item
                        {...restField}
                        name={[name, 'outcomeFileList']}
                        valuePropName="fileList"
                        getValueFromEvent={(e) =>
                          Array.isArray(e) ? e : e?.fileList
                        }
                        rules={[
                          {
                            required: true,
                            message: 'Outcome photo is required',
                          },
                        ]}
                        className="upload-wrapper"
                      >
                        <Dragger {...uploadProps}>
                          <p className="ant-upload-drag-icon flex justify-center text-white/80">
                            <Inbox size={40} />
                          </p>
                          <p className="text-white font-medium">
                            Drag and drop files here, or
                          </p>
                          <Button className="mt-2 bg-[#293038]! border-none! text-white! hover:bg-[#1a1f24]!">
                            Select File
                          </Button>
                        </Dragger>
                      </Form.Item>

                      <Form.Item
                        {...restField}
                        name={[name, 'outcomeDesc']}
                        label={
                          <span className="font-semibold text-white">
                            Photo Description{' '}
                            <span className="text-red-400">*</span>
                          </span>
                        }
                        rules={[
                          {required: true, message: 'Description is required'},
                        ]}
                      >
                        <Input.TextArea
                          rows={3}
                          placeholder="Describe the outcome..."
                          className="rounded-xl!"
                        />
                      </Form.Item>
                    </div>
                  </div>
                </div>
              ))}

              <div className="flex justify-center mt-6">
                <Button
                  type="dashed"
                  onClick={() => add()}
                  icon={<PlusOutlined />}
                  className="h-12! px-8! rounded-xl! border-2! border-dashed! border-white/50! hover:border-white! bg-white/10! hover:bg-white/20! font-bold text-white shadow-sm"
                >
                  Add Another Item
                </Button>
              </div>
            </div>
          )}
        </Form.List>

        <div className="mt-12 flex justify-end">
          <Button
            type="primary"
            htmlType="submit"
            loading={isSubmitting}
            className="bg-[#1273D4]! hover:bg-[#0f62b5]! h-12! px-12 rounded-xl! font-bold text-lg shadow-xl border-none"
          >
            Submit Report
          </Button>
        </div>
      </Form>
    </div>
  );
}
