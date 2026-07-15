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

const axisTick = { fontSize: 12, fill: '#64748b' }

type Row = { month: string; signed: number; pending: number; rejected: number }

export function DocumentsBarChart({ data }: { data: Row[] }) {
  return (
    <section className="rounded-md bg-white p-4 shadow-[0px_4px_12px_0px_rgba(0,0,0,0.08)]">
      <h2 className="mb-4 text-lg font-semibold text-slate-800">
        Документы по статусам за год
      </h2>
      <ResponsiveContainer width="100%" height={340}>
        <BarChart data={data} barCategoryGap="30%">
          <CartesianGrid vertical={false} stroke="#eef1f4" />
          <XAxis dataKey="month" tickLine={false} axisLine={false} tick={axisTick} />
          <YAxis tickLine={false} axisLine={false} tick={axisTick} width={32} allowDecimals={false} />
          <Tooltip
            cursor={{ fill: 'rgba(0,0,0,0.03)' }}
            contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 13 }}
          />
          <Legend iconType="circle" wrapperStyle={{ fontSize: 13, paddingTop: 12 }} />
          <Bar dataKey="signed" name="Подписанные" stackId="a" fill="#34C77D" maxBarSize={26} />
          <Bar dataKey="rejected" name="Отказанные" stackId="a" fill="#F87171" maxBarSize={26} />
          <Bar dataKey="pending" name="Ожидающие" stackId="a" fill="#FDE9B8" radius={[4, 4, 0, 0]} maxBarSize={26} />
        </BarChart>
      </ResponsiveContainer>
    </section>
  )
}
