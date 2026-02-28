import {Button, Modal} from 'antd';
import Image from 'next/image';
import {ReportData} from '../types';

interface MonitoringDetailModalProps {
  open: boolean;
  viewingReport: ReportData | null;
  onClose: () => void;
}

export function MonitoringDetailModal({
  open,
  viewingReport,
  onClose,
}: MonitoringDetailModalProps) {
  return (
    <Modal
      title="Report Details"
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
          <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
            <div className="col-span-2 md:col-span-1">
              <label className="text-xs font-bold text-gray-500 uppercase">
                Task
              </label>
              <p className="text-sm font-semibold text-gray-800">
                {viewingReport.taskName}
              </p>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">
                PIC
              </label>
              <p className="text-sm font-semibold text-gray-800">
                {viewingReport.picName}
              </p>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">
                Date
              </label>
              <p className="text-sm font-semibold text-gray-800">
                {viewingReport.submittedDate}
              </p>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">
                Status
              </label>
              <p className="text-sm font-semibold text-[#6168FF]">
                {viewingReport.status}
              </p>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4 text-gray-800">
              Checklist & Evidence
            </h3>

            <div className="space-y-6 max-h-125 overflow-y-auto pr-2 scrollbar-hide">
              {(!viewingReport.evidences ||
                viewingReport.evidences.length === 0) && (
                <p className="text-sm text-gray-500 italic bg-gray-50 p-6 rounded-xl text-center border border-dashed border-gray-200">
                  No evidence attached for this report.
                </p>
              )}

              {viewingReport.evidences?.map((evidence, index) => (
                <div
                  key={evidence.id}
                  className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm"
                >
                  <h4 className="font-bold text-[#6168FF] mb-4">
                    Item #{index + 1}
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
                          className="block relative w-full h-40 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 hover:opacity-90 transition-opacity"
                        >
                          <Image
                            src={evidence.actionImageUrl}
                            alt="Action"
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className="object-cover"
                          />
                        </a>
                      ) : (
                        <div className="w-full h-40 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-200 border-dashed text-gray-400 text-sm">
                          No Photo
                        </div>
                      )}

                      <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100 italic">
                        "{evidence.actionDesc ?? 'No description provided.'}"
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
                          className="block relative w-full h-40 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 hover:opacity-90 transition-opacity"
                        >
                          <Image
                            src={evidence.outcomeImageUrl}
                            alt="Outcome"
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className="object-cover"
                          />
                        </a>
                      ) : (
                        <div className="w-full h-40 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-200 border-dashed text-gray-400 text-sm">
                          No Photo
                        </div>
                      )}

                      <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100 italic">
                        "{evidence.outcomeDesc ?? 'No description provided.'}"
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {viewingReport.notes && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-4">
                  <p className="text-xs font-bold text-amber-700 uppercase">
                    Revision Notes from Admin
                  </p>
                  <p className="text-sm text-amber-900 mt-1 font-medium">
                    {viewingReport.notes}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}
