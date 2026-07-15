import { useState, useRef, useEffect } from 'react'
import { ChevronDown, X } from 'lucide-react'
import { DateRangePicker } from './DateRangePicker'
import { formatDate } from '@/types/document'
import { toIso } from '@/lib/date'
import type { DateRange } from '@/lib/date'
import { cn } from '@/lib/cn'

type DateRangeFilterProps = {
  value: DateRange
  onChange: (range: DateRange) => void
}

export function DateRangeFilter({ value, onChange }: DateRangeFilterProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const hasRange = Boolean(value.start)

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  const label = hasRange
    ? value.end
      ? `${formatDate(toIso(value.start!))} – ${formatDate(toIso(value.end))}`
      : formatDate(toIso(value.start!))
    : 'Дата'

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'flex h-11 items-center gap-1 rounded-[46px] border pl-4 pr-2.5 text-sm font-medium transition',
          hasRange
            ? 'border-Smart-blue bg-Smart-blue/5 text-Smart-blue'
            : 'border-gray-200 bg-gray-50 text-slate-700',
        )}
      >
        {label}
        {hasRange ? (
          <X
            className="size-4 text-Smart-blue"
            onClick={(e) => {
              e.stopPropagation()
              onChange({ start: null, end: null })
            }}
          />
        ) : (
          <ChevronDown className={cn('size-5 text-gray-500 transition', open && 'rotate-180')} />
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-30 mt-2">
          <DateRangePicker value={value} onChange={onChange} />
        </div>
      )}
    </div>
  )
}
