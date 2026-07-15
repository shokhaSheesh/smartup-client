import { LayoutGrid, CheckCircle2, Clock, XCircle, Ban } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { docStats } from '@/data/mockDocuments'
import { cn } from '@/lib/cn'

const icons: Record<string, { Icon: LucideIcon; color: string }> = {
  all: { Icon: LayoutGrid, color: 'text-Smart-blue' },
  signed: { Icon: CheckCircle2, color: 'text-emerald-600' },
  pending: { Icon: Clock, color: 'text-yellow-500' },
  canceled: { Icon: XCircle, color: 'text-red-600' },
  rejected: { Icon: Ban, color: 'text-gray-400' },
}

export function StatCards() {
  return (
    <div className="flex gap-4">
      {docStats.map((stat) => {
        const { Icon, color } = icons[stat.key]
        return (
          <div
            key={stat.key}
            className="flex flex-1 items-center gap-6 rounded-xl border border-gray-200 bg-white px-6 py-4 shadow-[0px_4px_12px_0px_rgba(0,0,0,0.08)]"
          >
            <div className="flex flex-col gap-1">
              <span className={cn('text-2xl font-bold leading-8', stat.valueColor)}>
                {stat.value}
              </span>
              <span className="text-base font-semibold text-slate-800">
                {stat.label}
              </span>
            </div>
            <div
              className={cn(
                'ml-auto flex size-14 items-center justify-center rounded-xl',
                stat.iconBg,
              )}
            >
              <Icon className={cn('size-6', color)} strokeWidth={1.8} />
            </div>
          </div>
        )
      })}
    </div>
  )
}
