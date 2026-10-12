import { lookupPinfl } from '@/data/billing'
import { cn } from '@/lib/cn'

const fieldClass =
  'w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-base text-slate-800 outline-none placeholder:text-gray-400 focus:border-Smart-blue'

export function RadioDot({ checked }: { checked: boolean }) {
  return (
    <span
      className={cn(
        'flex size-5 shrink-0 items-center justify-center rounded-full border',
        checked ? 'border-Smart-blue' : 'border-gray-300',
      )}
    >
      {checked && <span className="size-2.5 rounded-full bg-Smart-blue" />}
    </span>
  )
}

/**
 * ПИНФЛ of whoever pays with personal money. The name is never typed — it
 * resolves from the ПИНФЛ, so the agreement is drawn up for a real person.
 */
export function PinflFields({
  pinfl,
  onChange,
  placeholder = 'ПИНФЛ владельца карты',
}: {
  pinfl: string
  onChange: (pinfl: string) => void
  placeholder?: string
}) {
  return (
    <div className="flex flex-col gap-3">
      <input
        value={pinfl}
        onChange={(e) => onChange(e.target.value.replace(/\D/g, '').slice(0, 14))}
        inputMode="numeric"
        placeholder={placeholder}
        className={fieldClass}
      />
      <input
        value={lookupPinfl(pinfl) ?? ''}
        readOnly
        tabIndex={-1}
        placeholder="ФИО — заполнится по ПИНФЛ"
        className={cn(fieldClass, 'bg-gray-50 text-slate-600 focus:border-gray-200')}
      />
    </div>
  )
}
