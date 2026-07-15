import type { DocStatus } from '@/types/document'
import { statusLabel } from '@/types/document'
import { cn } from '@/lib/cn'

const styles: Record<DocStatus, string> = {
  signed: 'bg-green-100 text-emerald-600',
  pending: 'bg-amber-50 text-amber-400',
  canceled: 'bg-red-100 text-red-600',
}

export function StatusBadge({ status }: { status: DocStatus }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md px-3 py-1 text-sm font-medium',
        styles[status],
      )}
    >
      {statusLabel[status]}
    </span>
  )
}
