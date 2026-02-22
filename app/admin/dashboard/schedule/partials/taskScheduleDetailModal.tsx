import {Button, Modal} from 'antd';
import {TaskData} from '../types';

interface TaskScheduleDetailModalProps {
  open: boolean;
  viewingTask: TaskData | null;
  onClose: () => void;
}

export function TaskScheduleDetailModal({
  open,
  viewingTask,
  onClose,
}: TaskScheduleDetailModalProps) {
  return (
    <Modal
      title="Task Details"
      open={open}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          Close
        </Button>,
      ]}
      centered
    >
      {viewingTask && (
        <div className="space-y-4 mt-4">
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase">
              MOP Document
            </label>
            <p className="text-base font-medium text-gray-800">
              {viewingTask.mopTitle}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">
                Assigned To
              </label>
              <p className="text-base text-gray-800">{viewingTask.picName}</p>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">
                Status
              </label>
              <p className="text-base font-medium text-[#6168FF]">
                {viewingTask.status}
              </p>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500 uppercase">
              Scheduled Date
            </label>
            <p className="text-base text-gray-800">
              {viewingTask.scheduledDate}
            </p>
          </div>

          <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
            <label className="text-xs font-bold text-gray-500 uppercase">
              Notes
            </label>
            <p className="text-sm text-gray-600 mt-1">
              {viewingTask.notes || 'No special notes provided.'}
            </p>
          </div>
        </div>
      )}
    </Modal>
  );
}
