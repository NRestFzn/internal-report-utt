import {TaskDetail} from '../types';

interface TaskInfoCardProps {
  taskDetail: TaskDetail | null;
}

export function TaskInfoCard({taskDetail}: TaskInfoCardProps) {
  return (
    <div className="bg-[#6168FF] rounded-3xl p-8 shadow-xl text-white mb-6">
      <h2 className="text-2xl font-bold mb-6 border-b border-white/20 pb-4">
        Task Information
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-6 gap-x-8">
        <div>
          <label className="text-white/70 text-xs uppercase tracking-wider font-semibold">
            Document Number
          </label>
          <p className="text-lg font-bold mt-1">{taskDetail?.docNumber}</p>
        </div>
        <div className="lg:col-span-2">
          <label className="text-white/70 text-xs uppercase tracking-wider font-semibold">
            Task / MOP Title
          </label>
          <p className="text-lg font-bold mt-1 line-clamp-2">
            {taskDetail?.mopTitle}
          </p>
        </div>
        <div>
          <label className="text-white/70 text-xs uppercase tracking-wider font-semibold">
            Scheduled Date
          </label>
          <p className="text-lg font-medium mt-1">
            {taskDetail?.scheduledDate}
          </p>
        </div>
      </div>
    </div>
  );
}
