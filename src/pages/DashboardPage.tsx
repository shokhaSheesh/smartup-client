import { useMemo, useState } from 'react'
import { AlertTriangle, Plus, Search } from 'lucide-react'
import { StatCards } from '@/features/dashboard/StatCards'
import { DocumentsTable } from '@/features/dashboard/DocumentsTable'
import { DocumentsBarChart } from '@/features/dashboard/DocumentsBarChart'
import { ProductsBarChart } from '@/features/dashboard/ProductsBarChart'
import { DonutCard } from '@/features/dashboard/DonutCard'
import { FilterMenu } from '@/components/ui/FilterMenu'
import type { FilterOption } from '@/components/ui/FilterMenu'
import { DateRangeFilter } from '@/components/ui/DateRangeFilter'
import { acceptedDonut, notAcceptedDonut } from '@/data/mockCharts'
import { mockDocuments } from '@/data/mockDocuments'
import { DOC_TYPES } from '@/data/docTypes'
import { directionLabel, statusLabel, numberDate } from '@/types/document'
import type { DocDirection, DocStatus } from '@/types/document'
import { atMidnight } from '@/lib/date'
import type { DateRange } from '@/lib/date'
import { cn } from '@/lib/cn'

const quickCreate = [
  'Счет-фактура без акта',
  'Счет-фактура (ФАРМ)',
  'Акт',
  'Доверенность',
  'Договор (ГНК)',
  'Акт сверки',
]

type Tab = 'all' | DocDirection
const tabs: { value: Tab; label: string }[] = [
  { value: 'all', label: 'Все документы' },
  { value: 'incoming', label: 'Входящий' },
  { value: 'outgoing', label: 'Исходящий' },
]

const statusOptions: FilterOption[] = [
  { value: 'all', label: 'Все статусы' },
  { value: 'signed', label: statusLabel.signed },
  { value: 'pending', label: statusLabel.pending },
  { value: 'canceled', label: statusLabel.canceled },
]

const typeOptions: FilterOption[] = [
  { value: 'all', label: 'Все типы' },
  ...DOC_TYPES.map((t) => ({ value: t, label: t })),
]

function WarningBanner() {
  return (
    <div className="flex items-center gap-4 rounded-2xl bg-amber-50 p-4 shadow-[0px_4px_12px_0px_rgba(0,0,0,0.08)]">
      <div className="flex items-center justify-center rounded-3xl bg-amber-100 p-3">
        <AlertTriangle className="size-6 text-amber-400" />
      </div>
      <div className="flex flex-col gap-0.5">
        <h2 className="text-xl font-medium text-gray-900">Предупреждение</h2>
        <p className="text-base text-gray-500">
          У вас есть непроверенный <span className="font-medium text-Smart-blue">7 документ</span>.
          Пожалуйста, примите меры в течение 3 дней.
        </p>
      </div>
    </div>
  )
}

function QuickCreateBar() {
  return (
    <div className="flex flex-wrap gap-3">
      {quickCreate.map((label) => (
        <button
          key={label}
          className="flex h-10 items-center gap-2 rounded-2xl bg-gray-100 px-4 text-sm font-medium text-slate-800 transition hover:bg-gray-200"
        >
          <Plus className="size-5" />
          {label}
        </button>
      ))}
    </div>
  )
}

export default function DashboardPage() {
  const [tab, setTab] = useState<Tab>('all')
  const [dateRange, setDateRange] = useState<DateRange>({ start: null, end: null })
  const [type, setType] = useState('all')
  const [status, setStatus] = useState('all')
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const from = dateRange.start ? atMidnight(dateRange.start).getTime() : null
    const to = dateRange.end
      ? atMidnight(dateRange.end).getTime()
      : dateRange.start
        ? atMidnight(dateRange.start).getTime()
        : null

    return mockDocuments.filter((doc) => {
      if (tab !== 'all' && doc.direction !== tab) return false
      if (type !== 'all' && doc.type !== type) return false
      if (status !== 'all' && doc.status !== (status as DocStatus)) return false
      if (from !== null && to !== null) {
        const t = atMidnight(new Date(doc.date)).getTime()
        if (t < from || t > to) return false
      }
      if (q) {
        const haystack = [
          directionLabel[doc.direction],
          statusLabel[doc.status],
          doc.type,
          doc.counterparty.name,
          doc.counterparty.inn,
          numberDate(doc),
          doc.creator,
          doc.amount ?? '',
        ]
          .join(' ')
          .toLowerCase()
        if (!haystack.includes(q)) return false
      }
      return true
    })
  }, [tab, dateRange, type, status, query])

  return (
    <div className="flex flex-col gap-4">
      <WarningBanner />
      <QuickCreateBar />

      <div className="rounded-md bg-white shadow-[0px_4px_12px_0px_rgba(0,0,0,0.08)]">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 px-4 py-3">
          <div className="flex items-center gap-2.5">
            {tabs.map((t) => {
              const active = t.value === tab
              return (
                <button
                  key={t.value}
                  onClick={() => setTab(t.value)}
                  className={cn(
                    'flex h-10 items-center rounded-[32px] px-4 text-base font-medium transition',
                    active
                      ? 'bg-Smart-blue text-white shadow-[1px_2px_12px_0px_rgba(0,0,0,0.12)]'
                      : 'bg-gray-50 text-Smart-blue hover:bg-gray-100',
                  )}
                >
                  {t.label}
                </button>
              )
            })}
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <DateRangeFilter value={dateRange} onChange={setDateRange} />
            <FilterMenu label="Тип документа" options={typeOptions} value={type} onChange={setType} />
            <FilterMenu label="Статус" options={statusOptions} value={status} onChange={setStatus} />
            <div className="flex w-80 items-center gap-2 rounded-[46px] border border-gray-200 bg-white px-4 py-2.5 shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]">
              <Search className="size-5 text-gray-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Поиск"
                className="flex-1 bg-transparent text-base text-gray-700 outline-none placeholder:text-gray-400"
              />
            </div>
          </div>
        </div>

        <div className="p-4">
          <StatCards />
        </div>
      </div>

      <DocumentsTable documents={filtered} />
      <DocumentsBarChart />
      <ProductsBarChart />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <DonutCard title="Принятые документы" data={acceptedDonut} />
        <DonutCard
          title="Непринятые документы"
          data={notAcceptedDonut}
          hideFromLegend={['Прочие']}
        />
      </div>
    </div>
  )
}
