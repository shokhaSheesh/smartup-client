import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { donutTotal } from '@/data/mockCharts'

type Segment = { name: string; value: number; color: string }

type DonutCardProps = {
  title: string
  data: Segment[]
  /** Segments to hide from the legend (e.g. the gray remainder). */
  hideFromLegend?: string[]
}

function formatSum(n: number): string {
  return `${n.toLocaleString('ru-RU').replace(/,/g, ' ')} сум`
}

export function DonutCard({ title, data, hideFromLegend = [] }: DonutCardProps) {
  const legendItems = data.filter((d) => !hideFromLegend.includes(d.name))

  return (
    <section className="rounded-2xl bg-white p-6 shadow-[0px_4px_12px_0px_rgba(0,0,0,0.08)]">
      <h2 className="mb-6 text-lg font-semibold text-slate-800">{title}</h2>
      <div className="flex items-center gap-8">
        <div className="relative size-44 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                innerRadius={60}
                outerRadius={82}
                paddingAngle={2}
                startAngle={90}
                endAngle={-270}
                stroke="none"
              >
                {data.map((seg) => (
                  <Cell key={seg.name} fill={seg.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-base font-bold text-slate-800">{donutTotal}</span>
            <span className="text-xs text-gray-400">Общая сумма</span>
          </div>
        </div>

        <ul className="flex flex-1 flex-col gap-4">
          {legendItems.map((seg) => (
            <li key={seg.name} className="flex items-center gap-3 text-sm">
              <span
                className="size-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: seg.color }}
              />
              <span className="text-slate-600">{seg.name}</span>
              <span className="flex-1 border-b border-dashed border-gray-200" />
              <span className="font-medium text-slate-800">{formatSum(seg.value)}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
