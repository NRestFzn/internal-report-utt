import {createClient} from '@/lib/supabase/client';
import {TablesUpdate} from '@/lib/types/supabase';
import dayjs from 'dayjs';
import {ReportData, ReportStatus} from '../types';

const supabase = createClient();

const toReportStatus = (status: string | null): ReportStatus => {
  if (status === 'Approved' || status === 'Revisi') {
    return status;
  }
  return 'Pending';
};

export async function getMonitoringReports(): Promise<ReportData[]> {
  const [
    {data: reports, error: reportError},
    {data: tasks, error: taskError},
    {data: evidences, error: evidenceError},
  ] = await Promise.all([
    supabase
      .from('reports')
      .select('id, task_id, submitted_at, status, rejection_notes')
      .order('created_at', {ascending: false}),
    supabase.from('tasks').select('id, mops(title), profiles(fullname)'),
    supabase
      .from('report_evidences')
      .select(
        'id, report_id, action_title, action_image_url, action_description, outcome_title, outcome_image_url, outcome_description',
      )
      .order('id', {ascending: true}),
  ]);

  if (reportError) throw new Error(reportError.message);
  if (taskError) throw new Error(taskError.message);
  if (evidenceError) throw new Error(evidenceError.message);

  const taskById = new Map(
    (tasks ?? []).map((task) => {
      const mopRelation = Array.isArray(task.mops) ? task.mops[0] : task.mops;
      const profileRelation = Array.isArray(task.profiles)
        ? task.profiles[0]
        : task.profiles;
      return [
        task.id,
        {
          taskName: mopRelation?.title ?? '-',
          picName: profileRelation?.fullname ?? '-',
        },
      ];
    }),
  );

  const evidenceByReport = (evidences ?? []).reduce<Record<number, any[]>>(
    (acc, item) => {
      if (!acc[item.report_id]) {
        acc[item.report_id] = [];
      }

      acc[item.report_id].push({
        id: item.id,
        actionTitle: item.action_title,
        actionImageUrl: item.action_image_url,
        actionDesc: item.action_description,
        outcomeTitle: item.outcome_title,
        outcomeImageUrl: item.outcome_image_url,
        outcomeDesc: item.outcome_description,
      });

      return acc;
    },
    {},
  );

  return (reports ?? []).map((report, index) => {
    const taskInfo = taskById.get(report.task_id);
    return {
      key: String(report.id),
      id: index + 1,
      reportId: report.id,
      taskName: taskInfo?.taskName ?? '-',
      picName: taskInfo?.picName ?? '-',
      submittedDate: report.submitted_at
        ? dayjs(report.submitted_at).format('YYYY-MM-DD')
        : '-',
      status: toReportStatus(report.status),
      notes: report.rejection_notes ?? undefined,
      evidences: evidenceByReport[report.id] ?? [],
    };
  });
}

export async function approveReport(reportId: number) {
  const payload: TablesUpdate<'reports'> = {
    status: 'Approved',
    rejection_notes: null,
  };

  const {error} = await supabase
    .from('reports')
    .update(payload)
    .eq('id', reportId);
  if (error) throw new Error(error.message);
}

export async function rejectReport(reportId: number, notes: string) {
  const payload: TablesUpdate<'reports'> = {
    status: 'Revisi',
    rejection_notes: notes.trim(),
  };

  const {error} = await supabase
    .from('reports')
    .update(payload)
    .eq('id', reportId);
  if (error) throw new Error(error.message);
}

export const printReport = (report: ReportData) => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    throw new Error(
      'Pop-up terblokir oleh browser. Tolong izinkan pop-up untuk situs ini.',
    );
  }

  const evidencesHtml =
    report.evidences
      ?.map(
        (ev, i) => `
    <div style="margin-bottom: 24px; page-break-inside: avoid; border: 1px solid #e5e7eb; padding: 16px; border-radius: 8px;">
      <h4 style="margin-top: 0; color: #4f46e5; font-size: 16px;">Item #${i + 1}</h4>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="width: 50%; vertical-align: top; padding-right: 12px; border-right: 1px dashed #e5e7eb;">
            <div style="font-size: 12px; font-weight: bold; color: #6b7280; text-transform: uppercase;">Action</div>
            <div style="font-weight: 600; margin-bottom: 8px;">${ev.actionTitle || '-'}</div>
            ${ev.actionImageUrl ? `<img src="${ev.actionImageUrl}" style="max-width: 100%; max-height: 250px; border-radius: 6px; border: 1px solid #eee;" />` : '<div style="padding: 20px; background: #f9fafb; text-align: center; color: #9ca3af; font-style: italic; border-radius: 6px;">No Photo Attached</div>'}
            <p style="font-style: italic; color: #4b5563; font-size: 13px; background: #f9fafb; padding: 8px; border-radius: 6px; margin-top: 8px;">"${ev.actionDesc || '-'}"</p>
          </td>
          <td style="width: 50%; vertical-align: top; padding-left: 12px;">
            <div style="font-size: 12px; font-weight: bold; color: #6b7280; text-transform: uppercase;">Expected Outcome</div>
            <div style="font-weight: 600; margin-bottom: 8px;">${ev.outcomeTitle || '-'}</div>
            ${ev.outcomeImageUrl ? `<img src="${ev.outcomeImageUrl}" style="max-width: 100%; max-height: 250px; border-radius: 6px; border: 1px solid #eee;" />` : '<div style="padding: 20px; background: #f9fafb; text-align: center; color: #9ca3af; font-style: italic; border-radius: 6px;">No Photo Attached</div>'}
            <p style="font-style: italic; color: #4b5563; font-size: 13px; background: #f9fafb; padding: 8px; border-radius: 6px; margin-top: 8px;">"${ev.outcomeDesc || '-'}"</p>
          </td>
        </tr>
      </table>
    </div>
  `,
      )
      .join('') ||
    '<p style="color: #6b7280; font-style: italic;">No evidence attached to this report.</p>';

  const statusColor =
    report.status === 'Approved'
      ? '#16a34a'
      : report.status === 'Revisi'
        ? '#dc2626'
        : '#2563eb';

  const htmlContent = `
    <html>
      <head>
        <title>Report - ${report.taskName}</title>
        <style>
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 40px; color: #1f2937; line-height: 1.5; }
          @media print { body { padding: 0; } }
          .header { text-align: center; border-bottom: 2px solid #1f2937; padding-bottom: 16px; margin-bottom: 32px; }
          .header h2 { margin: 0 0 8px 0; color: #111827; }
          .header p { margin: 0; color: #6b7280; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; }
          .info-grid { display: flex; flex-wrap: wrap; gap: 24px; background: #f3f4f6; padding: 24px; margin-bottom: 32px; border-radius: 12px; border: 1px solid #e5e7eb; }
          .info-item { flex: 1; min-width: 200px; }
          .info-label { font-size: 11px; font-weight: bold; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
          .info-value { margin: 0; font-size: 16px; font-weight: 700; color: #111827; }
        </style>
      </head>
      <body>
        <div class="header">
          <h2>Maintenance Report Details</h2>
          <p>United Transworld Trading</p>
        </div>

        <div class="info-grid">
          <div class="info-item">
            <div class="info-label">Task Name</div>
            <div class="info-value">${report.taskName}</div>
          </div>
          <div class="info-item">
            <div class="info-label">PIC / Engineer</div>
            <div class="info-value">${report.picName}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Submitted Date</div>
            <div class="info-value">${report.submittedDate}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Final Status</div>
            <div class="info-value" style="color: ${statusColor};">${report.status}</div>
          </div>
        </div>

        ${
          report.notes && report.status === 'Revisi'
            ? `
          <div style="background: #fef2f2; border: 1px solid #f87171; padding: 16px; border-radius: 8px; margin-bottom: 32px;">
            <div style="font-size: 12px; font-weight: bold; color: #b91c1c; text-transform: uppercase; margin-bottom: 4px;">Admin Revision Notes</div>
            <div style="color: #7f1d1d; font-weight: 500;">${report.notes}</div>
          </div>
        `
            : ''
        }

        <h3 style="border-bottom: 2px solid #e5e7eb; padding-bottom: 8px; margin-bottom: 24px; color: #374151;">Checklist & Evidence</h3>
        ${evidencesHtml}
        
        <div style="margin-top: 40px; text-align: center; color: #9ca3af; font-size: 12px;">
          Printed on ${new Date().toLocaleString()} - UTT Internal System
        </div>

        <script>
          window.onload = () => {
            setTimeout(() => {
              window.print();
            }, 800);
          };
        </script>
      </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(htmlContent);
  printWindow.document.close();
};
