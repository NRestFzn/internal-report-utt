import {Button, Form, Input, Modal, Select, Upload} from 'antd';
import {FormInstance} from 'antd/es/form';
import {Upload as UploadIcon} from 'lucide-react';
import {CategoryOption} from '../services/mopService';
import {MopData} from '../types';

interface MopFormModalProps {
  open: boolean;
  editingMop: MopData | null;
  form: FormInstance;
  categoryOptions: CategoryOption[];
  onSubmit: () => void;
  onClose: () => void;
}

export function MopFormModal({
  open,
  editingMop,
  form,
  categoryOptions,
  onSubmit,
  onClose,
}: MopFormModalProps) {
  return (
    <Modal
      title={editingMop ? 'Edit Document' : 'Upload New MOP'}
      open={open}
      onOk={onSubmit}
      onCancel={onClose}
      okText={editingMop ? 'Save Changes' : 'Upload'}
      okButtonProps={{className: '!bg-[#6168FF] hover:!bg-[#4b51d1]'}}
      centered
    >
      <Form form={form} layout="vertical" className="mt-4">
        <Form.Item
          name="docNumber"
          label="Document Number"
          rules={[{required: true, message: 'Please input document number!'}]}
        >
          <Input placeholder="e.g. MOP-001" className="h-10! rounded-lg!" />
        </Form.Item>

        <Form.Item
          name="title"
          label="Document Title"
          rules={[{required: true, message: 'Please input title!'}]}
        >
          <Input
            placeholder="e.g. MOP - Server Maintenance"
            className="h-10! rounded-lg!"
          />
        </Form.Item>

        <Form.Item
          name="categoryId"
          label="Category"
          rules={[{required: true, message: 'Please select category!'}]}
        >
          <Select
            placeholder="Select Category"
            className="h-10!"
            options={categoryOptions}
          />
        </Form.Item>

        <Form.Item
          name="file"
          label="File Document"
          valuePropName="fileList"
          getValueFromEvent={(event) => event?.fileList}
        >
          <Upload beforeUpload={() => false} maxCount={1} accept=".pdf">
            <Button
              icon={<UploadIcon size={16} />}
              className="w-full h-10 rounded-lg"
            >
              Click to Upload PDF
            </Button>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
}
