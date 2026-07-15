import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check } from 'lucide-react'
import { cn } from '@/lib/cn'

export type FilterOption = { value: string; label: string }

type FilterMenuProps = {
  /** Shown when the current value is the default/"all" option. */
  label: string
  options: FilterOption[]
  value: string
  onChange: (value: string) => void
}

export function FilterMenu({ label, options, value, onChange }: FilterMenuProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const selected = options.find((o) => o.value === value)
  const isDefault = value === options[0]?.value

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'flex h-11 items-center gap-1 rounded-[46px] border pl-4 pr-2.5 text-sm font-medium transition',
          isDefault
            ? 'border-gray-200 bg-gray-50 text-slate-700'
            : 'border-Smart-blue bg-Smart-blue/5 text-Smart-blue',
        )}
      >
        {isDefault ? label : selected?.label}
        <ChevronDown className={cn('size-5 text-gray-500 transition', open && 'rotate-180')} />
      </button>

      {open && (
        <div className="absolute right-0 z-20 mt-2 max-h-64 w-56 overflow-auto rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onChange(opt.value)
                setOpen(false)
              }}
              className="flex w-full items-center justify-between gap-2 px-3.5 py-2 text-left text-sm text-slate-700 hover:bg-gray-50"
            >
              <span>{opt.label}</span>
              {opt.value === value && <Check className="size-4 text-Smart-blue" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
