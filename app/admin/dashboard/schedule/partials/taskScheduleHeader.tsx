import {Button} from 'antd';
import {Plus} from 'lucide-react';

interface TaskScheduleHeaderProps {
  onCreate: () => void;
}

export function TaskScheduleHeader({onCreate}: TaskScheduleHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
      <div>
        <h1 className="text-white text-3xl font-bold mb-2">Task Schedule</h1>
        <p className="text-white/70 text-lg">
          Assign maintenance tasks to PICs
        </p>
      </div>

      <Button
        type="primary"
        icon={<Plus size={18} />}
        onClick={onCreate}
        className="bg-[#293038]! hover:bg-[#1a1f24]! border-none h-10.5 px-6 rounded-xl font-semibold text-base shadow-lg"
      >
        Create Schedule
      </Button>
    </div>
  );
}
