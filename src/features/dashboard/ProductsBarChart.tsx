import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'
import { groupedBarData } from '@/data/mockCharts'

const axisTick = { fontSize: 12, fill: '#64748b' }

export function ProductsBarChart() {
  return (
    <section className="rounded-md bg-white p-4 shadow-[0px_4px_12px_0px_rgba(0,0,0,0.08)]">
      <h2 className="mb-4 text-lg font-semibold text-slate-800">
        Входящие и исходящие товары по месяцам
      </h2>
      <ResponsiveContainer width="100%" height={340}>
        <BarChart data={groupedBarData} barCategoryGap="28%" barGap={4}>
          <CartesianGrid vertical={false} stroke="#eef1f4" />
          <XAxis dataKey="month" tickLine={false} axisLine={false} tick={axisTick} />
          <YAxis tickLine={false} axisLine={false} tick={axisTick} width={38} />
          <Tooltip
            cursor={{ fill: 'rgba(0,0,0,0.03)' }}
            contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 13 }}
          />
          <Legend iconType="circle" wrapperStyle={{ fontSize: 13, paddingTop: 12 }} />
          <Bar dataKey="incoming" name="Входящие продукты" fill="#1B9CD8" radius={[4, 4, 0, 0]} maxBarSize={18} />
          <Bar dataKey="outgoing" name="Исходящие продукты" fill="#43B02A" radius={[4, 4, 0, 0]} maxBarSize={18} />
        </BarChart>
      </ResponsiveContainer>
    </section>
  )
}
