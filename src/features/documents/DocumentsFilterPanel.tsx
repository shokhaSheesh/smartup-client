import { useState } from 'react'
import { X, Search, ChevronDown } from 'lucide-react'
import { DOC_TYPES } from '@/data/docTypes'
import { cn } from '@/lib/cn'

export type DocFilters = {
  dateMode: 'created' | 'updated'
  dateFrom: string
  dateTo: string
  type: string
  number: string
  amountFrom: string
  amountTo: string
  hasLgota: boolean
  // Visual-only flags (no backing data in the prototype):
  komissioner: boolean
  odnostoronniy: boolean
  markirovan: boolean
  dogovorNumber: string
  dogovorDate: string
}

export const EMPTY_FILTERS: DocFilters = {
  dateMode: 'created',
  dateFrom: '',
  dateTo: '',
  type: 'all',
  number: '',
  amountFrom: '',
  amountTo: '',
  hasLgota: false,
  komissioner: false,
  odnostoronniy: false,
  markirovan: false,
  dogovorNumber: '',
  dogovorDate: '',
}

const fieldClass =
  'w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none placeholder:text-gray-400 focus:border-Smart-blue'

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-gray-500">{label}</span>
      {children}
    </label>
  )
}

function Check({
  checked,
  onChange,
  children,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  children: React.ReactNode
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="size-4 rounded border-gray-300 accent-[#1b9cd8]"
      />
      {children}
    </label>
  )
}

type Props = {
  initial: DocFilters
  onApply: (f: DocFilters) => void
  onReset: () => void
}

export function DocumentsFilterPanel({ initial, onApply, onReset }: Props) {
  const [draft, setDraft] = useState<DocFilters>(initial)
  const set = <K extends keyof DocFilters>(key: K, value: DocFilters[K]) =>
    setDraft((d) => ({ ...d, [key]: value }))

  return (
    <div className="rounded-2xl border border-gray-200 bg-white">
      <h3 className="border-b border-gray-100 px-6 py-4 text-lg font-semibold text-slate-800">
        Фильтр
      </h3>

      <div className="p-6">
        {/* Date mode toggles */}
        <div className="mb-5 flex items-center gap-8">
          <Check
            checked={draft.dateMode === 'created'}
            onChange={() => set('dateMode', 'created')}
          >
            По дате создания
          </Check>
          <Check
            checked={draft.dateMode === 'updated'}
            onChange={() => set('dateMode', 'updated')}
          >
            По дате обновления
          </Check>
        </div>

        <div className="grid grid-cols-1 gap-x-6 gap-y-4 lg:grid-cols-3">
          {/* Column 1 — Дата */}
          <div className="flex flex-col gap-4">
            <Field label="Дата">
              <input
                type="date"
                value={draft.dateFrom}
                onChange={(e) => set('dateFrom', e.target.value)}
                placeholder="С"
                className={fieldClass}
              />
            </Field>
            <input
              type="date"
              value={draft.dateTo}
              onChange={(e) => set('dateTo', e.target.value)}
              placeholder="По"
              className={fieldClass}
            />
          </div>

          {/* Column 2 — Документ */}
          <div className="flex flex-col gap-4">
            <Field label="Документ">
              <div className="relative">
                <select
                  value={draft.type}
                  onChange={(e) => set('type', e.target.value)}
                  className={cn(fieldClass, 'appearance-none pr-9')}
                >
                  <option value="all">Все типы</option>
                  {DOC_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
              </div>
            </Field>
            <input
              value={draft.number}
              onChange={(e) => set('number', e.target.value)}
              placeholder="Номер документа"
              className={fieldClass}
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                value={draft.amountFrom}
                onChange={(e) => set('amountFrom', e.target.value)}
                placeholder="Сумма с"
                className={fieldClass}
              />
              <input
                type="number"
                value={draft.amountTo}
                onChange={(e) => set('amountTo', e.target.value)}
                placeholder="Сумма по"
                className={fieldClass}
              />
            </div>
          </div>

          {/* Column 3 — Договор */}
          <div className="flex flex-col gap-4">
            <Field label="Договор">
              <input
                value={draft.dogovorNumber}
                onChange={(e) => set('dogovorNumber', e.target.value)}
                placeholder="Номер"
                className={fieldClass}
              />
            </Field>
            <input
              type="date"
              value={draft.dogovorDate}
              onChange={(e) => set('dogovorDate', e.target.value)}
              className={fieldClass}
            />
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              <Check checked={draft.komissioner} onChange={(v) => set('komissioner', v)}>
                Комиссионер
              </Check>
              <Check checked={draft.odnostoronniy} onChange={(v) => set('odnostoronniy', v)}>
                Односторонний
              </Check>
              <Check checked={draft.hasLgota} onChange={(v) => set('hasLgota', v)}>
                Есть льгота
              </Check>
              <Check checked={draft.markirovan} onChange={(v) => set('markirovan', v)}>
                Маркирован
              </Check>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            onClick={() => {
              setDraft(EMPTY_FILTERS)
              onReset()
            }}
            className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-gray-50"
          >
            <X className="size-4" />
            Сбросить
          </button>
          <button
            onClick={() => onApply(draft)}
            className="flex items-center gap-2 rounded-lg bg-Smart-blue px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-105"
          >
            <Search className="size-4" />
            Применить
          </button>
        </div>
      </div>
    </div>
  )
}
