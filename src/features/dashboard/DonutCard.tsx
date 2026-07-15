import { useState } from 'react'
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts'
import { donutTotal } from '@/data/mockCharts'
import { cn } from '@/lib/cn'

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

type TooltipPayload = { payload: Segment; value: number }

function DonutTooltip({ active, payload }: { active?: boolean; payload?: TooltipPayload[] }) {
  if (!active || !payload?.length) return null
  const seg = payload[0].payload
  return (
    <div className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm shadow-md">
      <div className="flex items-center gap-2">
        <span className="size-2.5 rounded-full" style={{ backgroundColor: seg.color }} />
        <span className="text-slate-600">{seg.name}</span>
      </div>
      <div className="mt-0.5 font-semibold text-slate-800">{formatSum(seg.value)}</div>
    </div>
  )
}

export function DonutCard({ title, data, hideFromLegend = [] }: DonutCardProps) {
  const legendItems = data.filter((d) => !hideFromLegend.includes(d.name))
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  return (
    <section className="rounded-2xl bg-white p-6 shadow-[0px_4px_12px_0px_rgba(0,0,0,0.08)]">
      <h2 className="mb-6 text-lg font-semibold text-slate-800">{title}</h2>
      <div className="flex items-center gap-8">
        <div className="relative size-44 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip content={<DonutTooltip />} />
              <Pie
                data={data}
                dataKey="value"
                innerRadius={60}
                outerRadius={82}
                paddingAngle={2}
                startAngle={90}
                endAngle={-270}
                stroke="none"
                onMouseEnter={(_, i) => setActiveIndex(i)}
                onMouseLeave={() => setActiveIndex(null)}
              >
                {data.map((seg, i) => (
                  <Cell
                    key={seg.name}
                    fill={seg.color}
                    fillOpacity={activeIndex === null || activeIndex === i ? 1 : 0.35}
                    className="cursor-pointer transition-opacity"
                  />
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
          {legendItems.map((seg) => {
            const idx = data.indexOf(seg)
            const dim = activeIndex !== null && activeIndex !== idx
            return (
              <li
                key={seg.name}
                onMouseEnter={() => setActiveIndex(idx)}
                onMouseLeave={() => setActiveIndex(null)}
                className={cn(
                  'flex cursor-pointer items-center gap-3 text-sm transition-opacity',
                  dim && 'opacity-40',
                )}
              >
                <span
                  className="size-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: seg.color }}
                />
                <span className="text-slate-600">{seg.name}</span>
                <span className="flex-1 border-b border-dashed border-gray-200" />
                <span className="font-medium text-slate-800">{formatSum(seg.value)}</span>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
