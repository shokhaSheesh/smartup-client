import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import {
  RU_WEEKDAYS,
  addMonths,
  atMidnight,
  daysInMonth,
  isSameDay,
  mondayIndex,
  monthLabel,
  startOfMonth,
} from '@/lib/date'
import type { DateRange } from '@/lib/date'
import { cn } from '@/lib/cn'

type DateRangePickerProps = {
  value: DateRange
  onChange: (range: DateRange) => void
}

type DayKind = 'start' | 'end' | 'in-range' | 'single' | 'normal'

function MonthGrid({
  month,
  range,
  onSelect,
}: {
  month: Date
  range: DateRange
  onSelect: (day: Date) => void
}) {
  const year = month.getFullYear()
  const m = month.getMonth()
  const total = daysInMonth(year, m)
  const lead = mondayIndex(new Date(year, m, 1))

  const cells: (Date | null)[] = [
    ...Array.from({ length: lead }, () => null),
    ...Array.from({ length: total }, (_, i) => new Date(year, m, i + 1)),
  ]
  while (cells.length % 7 !== 0) cells.push(null)

  function kindOf(day: Date): DayKind {
    const { start, end } = range
    if (start && end) {
      if (isSameDay(day, start)) return 'start'
      if (isSameDay(day, end)) return 'end'
      const t = atMidnight(day).getTime()
      if (t > atMidnight(start).getTime() && t < atMidnight(end).getTime())
        return 'in-range'
    } else if (start && isSameDay(day, start)) {
      return 'single'
    }
    return 'normal'
  }

  return (
    <div className="w-64">
      {/* Weekday header */}
      <div className="flex">
        {RU_WEEKDAYS.map((wd) => (
          <div
            key={wd}
            className="flex-1 border-b border-gray-100 pb-1 pt-1 text-center text-sm text-gray-400"
          >
            {wd}
          </div>
        ))}
      </div>

      {/* Weeks */}
      <div className="grid grid-cols-7">
        {cells.map((day, i) => {
          if (!day) return <div key={i} className="h-8" />
          const kind = kindOf(day)
          return (
            <button
              key={i}
              type="button"
              onClick={() => onSelect(day)}
              className={cn(
                'h-8 text-center text-sm leading-8 transition',
                kind === 'in-range' && 'bg-sky-50 text-slate-800',
                kind === 'start' && 'rounded-l-md bg-Smart-blue text-white',
                kind === 'end' && 'rounded-r-md bg-Smart-blue text-white',
                kind === 'single' && 'rounded-md bg-Smart-blue text-white',
                kind === 'normal' && 'rounded-md text-slate-800 hover:bg-gray-100',
              )}
            >
              {day.getDate()}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export function DateRangePicker({ value, onChange }: DateRangePickerProps) {
  const [viewMonth, setViewMonth] = useState<Date>(
    startOfMonth(value.start ?? new Date()),
  )

  function handleSelect(day: Date) {
    const { start, end } = value
    if (!start || (start && end)) {
      onChange({ start: day, end: null })
    } else if (day.getTime() < start.getTime()) {
      onChange({ start: day, end: start })
    } else {
      onChange({ start, end: day })
    }
  }

  const rightMonth = addMonths(viewMonth, 1)

  return (
    <div className="inline-flex gap-6 rounded-xl bg-white p-5 shadow-[0px_12px_24px_0px_rgba(91,104,113,0.24)]">
      {/* Left month */}
      <div>
        <div className="mb-1 flex h-8 items-center justify-between">
          <button
            type="button"
            onClick={() => setViewMonth(addMonths(viewMonth, -1))}
            className="flex size-6 items-center justify-center rounded-sm text-slate-800 hover:bg-gray-100"
          >
            <ChevronLeft className="size-5" />
          </button>
          <span className="text-sm font-semibold text-slate-800">
            {monthLabel(viewMonth)}
          </span>
          <span className="size-6" />
        </div>
        <MonthGrid month={viewMonth} range={value} onSelect={handleSelect} />
      </div>

      {/* Right month */}
      <div>
        <div className="mb-1 flex h-8 items-center justify-between">
          <span className="size-6" />
          <span className="text-sm font-semibold text-slate-800">
            {monthLabel(rightMonth)}
          </span>
          <button
            type="button"
            onClick={() => setViewMonth(addMonths(viewMonth, 1))}
            className="flex size-6 items-center justify-center rounded-sm text-slate-800 hover:bg-gray-100"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>
        <MonthGrid month={rightMonth} range={value} onSelect={handleSelect} />
      </div>
    </div>
  )
}
