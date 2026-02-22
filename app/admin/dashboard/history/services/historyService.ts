import {createClient} from '@/lib/supabase/client';
import dayjs from 'dayjs';
import {ChartData, HistoryData} from '../types';

const supabase = createClient();

export async function getHistoryData(): Promise<{
  rows: HistoryData[];
  chart: ChartData[];
}> {
  const [{data: reports, error: reportError}, {data: tasks, error: taskError}] =
    await Promise.all([
      supabase
        .from('reports')
        .select('id, task_id, submitted_at, status')
        .order('submitted_at', {ascending: false}),
      supabase
        .from('tasks')
        .select('id, scheduled_date, mops(title), profiles(fullname)'),
    ]);

  if (reportError) throw new Error(reportError.message);
  if (taskError) throw new Error(taskError.message);

  const approvedReports = (reports ?? []).filter(
    (report) => report.status === 'Approved',
  );

  const reportIds = approvedReports.map((report) => report.id);

  const {data: evidences, error: evidenceError} = await supabase
    .from('report_evidences')
    .select(
      'id, report_id, action_title, action_image_url, action_description, outcome_title, outcome_image_url, outcome_description',
    )
    .in('report_id', reportIds.length > 0 ? reportIds : [0])
    .order('id', {ascending: true});

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
          scheduledDate: task.scheduled_date,
        },
      ];
    }),
  );

  const evidenceByReport = (evidences ?? []).reduce<Record<number, any[]>>(
    (acc, item) => {
      if (!acc[item.report_id]) acc[item.report_id] = [];
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

  const rows = approvedReports.map((report, index) => {
    const taskInfo = taskById.get(report.task_id);
    const completedDate = report.submitted_at
      ? dayjs(report.submitted_at)
      : dayjs();
    const scheduledDate = taskInfo?.scheduledDate
      ? dayjs(taskInfo.scheduledDate)
      : null;

    return {
      key: String(report.id),
      id: index + 1,
      reportId: report.id,
      taskName: taskInfo?.taskName ?? '-',
      picName: taskInfo?.picName ?? '-',
      completedDate: completedDate.format('YYYY-MM-DD'),
      status:
        scheduledDate && completedDate.isAfter(scheduledDate, 'day')
          ? 'Late'
          : 'Completed',
      evidences: evidenceByReport[report.id] ?? [],
    } as HistoryData;
  });

  const chart: ChartData[] = [
    {month: 'Approved', total: approvedReports.length},
    {
      month: 'Not Approved',
      total: Math.max((reports ?? []).length - approvedReports.length, 0),
    },
  ];

  return {rows, chart};
}

export const exportToPDF = async (report: HistoryData) => {
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  container.style.top = '0';
  container.id = `pdf-render-${report.id}`;

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
            ${ev.actionImageUrl ? `<img src="${ev.actionImageUrl}" style="max-width: 100%; max-height: 250px; border-radius: 6px; border: 1px solid #eee;" crossorigin="anonymous" />` : '<div style="padding: 20px; background: #f9fafb; text-align: center; color: #9ca3af; font-style: italic; border-radius: 6px;">No Photo</div>'}
            <p style="font-style: italic; color: #4b5563; font-size: 13px; background: #f9fafb; padding: 8px; border-radius: 6px; margin-top: 8px;">"${ev.actionDesc || '-'}"</p>
          </td>
          <td style="width: 50%; vertical-align: top; padding-left: 12px;">
            <div style="font-size: 12px; font-weight: bold; color: #6b7280; text-transform: uppercase;">Expected Outcome</div>
            <div style="font-weight: 600; margin-bottom: 8px;">${ev.outcomeTitle || '-'}</div>
            ${ev.outcomeImageUrl ? `<img src="${ev.outcomeImageUrl}" style="max-width: 100%; max-height: 250px; border-radius: 6px; border: 1px solid #eee;" crossorigin="anonymous" />` : '<div style="padding: 20px; background: #f9fafb; text-align: center; color: #9ca3af; font-style: italic; border-radius: 6px;">No Photo</div>'}
            <p style="font-style: italic; color: #4b5563; font-size: 13px; background: #f9fafb; padding: 8px; border-radius: 6px; margin-top: 8px;">"${ev.outcomeDesc || '-'}"</p>
          </td>
        </tr>
      </table>
    </div>
  `,
      )
      .join('') ||
    '<p style="color: #6b7280; font-style: italic;">No evidence attached.</p>';

  const safeFileName = report.taskName.replace(/[^a-zA-Z0-9]/g, '_');

  container.innerHTML = `
    <div id="pdf-content-${report.id}" style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #1f2937; line-height: 1.5; background: white; width: 800px; padding: 40px;">
      <div style="text-align: center; border-bottom: 2px solid #1f2937; padding-bottom: 16px; margin-bottom: 32px;">
        <h2 style="margin: 0 0 8px 0; color: #111827;">Archived Maintenance Report</h2>
        <p style="margin: 0; color: #6b7280; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">United Transworld Trading</p>
      </div>
      <div style="display: flex; flex-wrap: wrap; gap: 24px; background: #f3f4f6; padding: 24px; margin-bottom: 32px; border-radius: 12px; border: 1px solid #e5e7eb;">
        <div style="flex: 1; min-width: 150px;"><div style="font-size: 11px; font-weight: bold; color: #6b7280; text-transform: uppercase; margin-bottom: 4px;">Task Name</div><div style="margin: 0; font-size: 16px; font-weight: 700; color: #111827;">${report.taskName}</div></div>
        <div style="flex: 1; min-width: 150px;"><div style="font-size: 11px; font-weight: bold; color: #6b7280; text-transform: uppercase; margin-bottom: 4px;">PIC / Engineer</div><div style="margin: 0; font-size: 16px; font-weight: 700; color: #111827;">${report.picName}</div></div>
        <div style="flex: 1; min-width: 150px;"><div style="font-size: 11px; font-weight: bold; color: #6b7280; text-transform: uppercase; margin-bottom: 4px;">Completed Date</div><div style="margin: 0; font-size: 16px; font-weight: 700; color: #111827;">${report.completedDate}</div></div>
        <div style="flex: 1; min-width: 150px;"><div style="font-size: 11px; font-weight: bold; color: #6b7280; text-transform: uppercase; margin-bottom: 4px;">Status</div><div style="margin: 0; font-size: 16px; font-weight: 700; color: ${report.status === 'Completed' ? '#16a34a' : '#dc2626'};">${report.status}</div></div>
      </div>
      <h3 style="border-bottom: 2px solid #e5e7eb; padding-bottom: 8px; margin-bottom: 24px; color: #374151;">Checklist & Evidence</h3>
      ${evidencesHtml}
      <div style="margin-top: 40px; text-align: center; color: #9ca3af; font-size: 12px;">Printed on ${new Date().toLocaleString()} - UTT Internal System</div>
    </div>
  `;

  document.body.appendChild(container);

  try {
    if (!(window as any).html2pdf) {
      await new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src =
          'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    }

    const element = document.getElementById(`pdf-content-${report.id}`);
    const opt = {
      margin: 0.5,
      filename: `UTT_Report_${safeFileName}.pdf`,
      image: {type: 'jpeg', quality: 0.98},
      html2canvas: {scale: 2, useCORS: true, logging: false},
      jsPDF: {unit: 'in', format: 'letter', orientation: 'portrait'},
    };

    await new Promise((res) => setTimeout(res, 500));

    await (window as any).html2pdf().set(opt).from(element).save();
  } catch (error) {
    console.error('PDF Generation Error:', error);
    throw new Error(
      'Gagal generate PDF. Pastikan internet stabil buat narik gambar.',
    );
  } finally {
    if (document.body.contains(container)) {
      document.body.removeChild(container);
    }
  }
};
