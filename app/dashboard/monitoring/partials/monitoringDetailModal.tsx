import {Button, Modal} from 'antd';
import Image from 'next/image';
import {UserReportData} from '../types';

interface MonitoringDetailModalProps {
  open: boolean;
  viewingReport: UserReportData | null;
  onClose: () => void;
}

export function MonitoringDetailModal({
  open,
  viewingReport,
  onClose,
}: MonitoringDetailModalProps) {
  return (
    <Modal
      title="My Report Detail"
      open={open}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          Close
        </Button>,
      ]}
      width={800}
      centered
    >
      {viewingReport && (
        <div className="space-y-6 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
            <div className="md:col-span-1">
              <label className="text-xs font-bold text-gray-500 uppercase">
                Task
              </label>
              <p className="text-sm font-semibold text-gray-800 line-clamp-2">
                {viewingReport.taskName}
              </p>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">
                Submitted Date
              </label>
              <p className="text-sm font-semibold text-gray-800">
                {viewingReport.displayDate}
              </p>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">
                Status
              </label>
              <p className="text-sm font-bold text-[#6168FF]">
                {viewingReport.status}
              </p>
            </div>
          </div>

          {viewingReport.status === 'Revisi' && viewingReport.notes && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
              <p className="text-xs font-bold text-red-700 uppercase mb-1">
                Admin Revision Notes:
              </p>
              <p className="text-sm text-red-900 font-medium">
                {viewingReport.notes}
              </p>
            </div>
          )}

          <div>
            <h3 className="font-bold text-lg mb-4 text-gray-800">
              Uploaded Evidence
            </h3>

            <div className="space-y-6 max-h-100 overflow-y-auto pr-2 scrollbar-hide">
              {!viewingReport.evidences ||
              viewingReport.evidences.length === 0 ? (
                <p className="text-sm text-gray-500 italic bg-gray-50 p-6 rounded-xl text-center border border-dashed border-gray-200">
                  No evidence attached.
                </p>
              ) : (
                viewingReport.evidences.map((evidence, index) => (
                  <div
                    key={evidence.id}
                    className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm"
                  >
                    <h4 className="font-bold text-[#6168FF] mb-4">
                      Action Item #{index + 1}
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div>
                          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                            Action
                          </span>
                          <p className="font-medium text-sm text-gray-800">
                            {evidence.actionTitle}
                          </p>
                        </div>
                        {evidence.actionImageUrl ? (
                          <a
                            href={evidence.actionImageUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block relative w-full h-40 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 hover:opacity-90"
                          >
                            <Image
                              src={evidence.actionImageUrl}
                              alt="Action"
                              fill
                              className="object-cover"
                            />
                          </a>
                        ) : (
                          <div className="w-full h-40 bg-gray-50 rounded-lg flex items-center justify-center border border-dashed text-gray-400 text-sm">
                            No Photo
                          </div>
                        )}
                        <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100 italic">
                          "{evidence.actionDesc}"
                        </p>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                            Expected Outcome
                          </span>
                          <p className="font-medium text-sm text-gray-800">
                            {evidence.outcomeTitle}
                          </p>
                        </div>
                        {evidence.outcomeImageUrl ? (
                          <a
                            href={evidence.outcomeImageUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block relative w-full h-40 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 hover:opacity-90"
                          >
                            <Image
                              src={evidence.outcomeImageUrl}
                              alt="Outcome"
                              fill
                              className="object-cover"
                            />
                          </a>
                        ) : (
                          <div className="w-full h-40 bg-gray-50 rounded-lg flex items-center justify-center border border-dashed text-gray-400 text-sm">
                            No Photo
                          </div>
                        )}
                        <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100 italic">
                          "{evidence.outcomeDesc}"
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}
