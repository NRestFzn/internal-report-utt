import {
  Area,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {ChartData} from '../types';

interface HistoryChartSectionProps {
  chartData: ChartData[];
}

export function HistoryChartSection({chartData}: HistoryChartSectionProps) {
  return (
    <div className="bg-[#6168FF] rounded-4xl p-8 shadow-2xl h-87.5 text-white flex flex-col">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Report Status Trends</h2>
        <p className="text-white/70">Overview of Approved vs Not Approved</p>
      </div>

      <div className="flex-1 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <defs>
              <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F4D35E" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#F4D35E" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="rgba(255,255,255,0.35)"
            />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{fill: '#FFFFFF', fontSize: 14}}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{fill: '#FFFFFF', fontSize: 14}}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#FFFFFF',
                border: 'none',
                borderRadius: '8px',
              }}
              labelStyle={{color: '#374151'}}
              itemStyle={{color: '#111827', fontWeight: 600}}
              formatter={(value: number | undefined) => [`total : ${value ?? 0}`, '']}
            />

            <Area
              type="monotone"
              dataKey="total"
              stroke="none"
              fillOpacity={1}
              fill="url(#colorTotal)"
            />
            <Line
              type="monotone"
              dataKey="total"
              stroke="#F4D35E"
              strokeWidth={3}
              dot={{fill: '#F4D35E', r: 4}}
              activeDot={{r: 6}}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
