import {DatePicker, Form, Input, Modal, Select} from 'antd';
import {FormInstance} from 'antd/es/form';
import {SelectOption} from '../services/taskService';
import {TaskData} from '../types';

interface TaskScheduleFormModalProps {
  open: boolean;
  editingTask: TaskData | null;
  form: FormInstance;
  mopOptions: SelectOption[];
  picOptions: SelectOption[];
  onSubmit: () => void;
  onClose: () => void;
}

export function TaskScheduleFormModal({
  open,
  editingTask,
  form,
  mopOptions,
  picOptions,
  onSubmit,
  onClose,
}: TaskScheduleFormModalProps) {
  return (
    <Modal
      title={editingTask ? 'Reschedule Task' : 'Assign New Task'}
      open={open}
      onOk={onSubmit}
      onCancel={onClose}
      okText="Assign"
      okButtonProps={{className: '!bg-[#6168FF] hover:!bg-[#4b51d1]'}}
      centered
    >
      <Form form={form} layout="vertical" className="mt-4">
        <Form.Item
          name="mopId"
          label="Select MOP"
          rules={[{required: true, message: 'Please select MOP!'}]}
        >
          <Select
            placeholder="Select SOP Document"
            className="h-10!"
            options={mopOptions}
          />
        </Form.Item>

        <Form.Item
          name="picId"
          label="Assign To (PIC)"
          rules={[{required: true, message: 'Please select PIC!'}]}
        >
          <Select
            placeholder="Select Engineer"
            className="h-10!"
            options={picOptions}
          />
        </Form.Item>

        <Form.Item
          name="scheduledDate"
          label="Schedule Date"
          rules={[{required: true, message: 'Please pick a date!'}]}
        >
          <DatePicker className="w-full h-10! rounded-lg!" />
        </Form.Item>

        <Form.Item name="notes" label="Notes (Optional)">
          <Input.TextArea
            rows={3}
            placeholder="Special instructions for PIC..."
            className="rounded-lg!"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
