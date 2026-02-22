import {Form, Input, Modal} from 'antd';
import {FormInstance} from 'antd/es/form';
import {CategoryData} from '../types';

interface CategoryFormModalProps {
  open: boolean;
  editingCategory: CategoryData | null;
  form: FormInstance;
  onSubmit: () => void;
  onClose: () => void;
  onPrefixChange: (value: string) => void;
}

export function CategoryFormModal({
  open,
  editingCategory,
  form,
  onSubmit,
  onClose,
  onPrefixChange,
}: CategoryFormModalProps) {
  return (
    <Modal
      title={editingCategory ? 'Edit Category' : 'Add New Category'}
      open={open}
      onOk={onSubmit}
      onCancel={onClose}
      okText={editingCategory ? 'Save Changes' : 'Create Category'}
      okButtonProps={{className: '!bg-[#6168FF] hover:!bg-[#4b51d1]'}}
      centered
    >
      <Form form={form} layout="vertical" className="mt-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2">
            <Form.Item
              name="name"
              label="Category Name"
              rules={[{required: true, message: 'Please input name!'}]}
            >
              <Input
                placeholder="e.g. Mechanical"
                className="h-10! rounded-lg!"
              />
            </Form.Item>
          </div>

          <div>
            <Form.Item
              name="prefix"
              label="Prefix Code"
              rules={[
                {required: true, message: 'Required!'},
                {max: 3, message: 'Max 3 chars'},
              ]}
              tooltip="Used for document numbering (e.g. MEC)"
            >
              <Input
                placeholder="MEC"
                className="h-10! rounded-lg! uppercase"
                maxLength={3}
                onChange={(e) => onPrefixChange(e.target.value)}
              />
            </Form.Item>
          </div>
        </div>

        <Form.Item
          name="description"
          label="Description"
          rules={[{required: true, message: 'Please input description!'}]}
        >
          <Input.TextArea
            rows={3}
            placeholder="Describe what equipment falls under this category..."
            className="rounded-lg!"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
