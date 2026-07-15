import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search,
  Printer,
  Download,
  SlidersHorizontal,
  Plus,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  PenLine,
  XCircle,
} from 'lucide-react'
import { mockDocuments } from '@/data/mockDocuments'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { RowMenu } from '@/components/ui/RowMenu'
import {
  DocumentsFilterPanel,
  EMPTY_FILTERS,
} from '@/features/documents/DocumentsFilterPanel'
import type { DocFilters } from '@/features/documents/DocumentsFilterPanel'
import { downloadDocumentsCsv } from '@/lib/download'
import { formatDate, formatAmount } from '@/types/document'
import type { DocDirection, DocStatus } from '@/types/document'
import { cn } from '@/lib/cn'

type StatusTab = 'all' | DocStatus

const STATUS_TABS: { value: StatusTab; label: string; pill: string }[] = [
  { value: 'all', label: 'Все статусы', pill: 'bg-gray-300' },
  { value: 'pending', label: 'Ожидает', pill: 'bg-amber-300' },
  { value: 'signed', label: 'Подписан', pill: 'bg-green-400' },
  { value: 'canceled', label: 'Отменено', pill: 'bg-red-500' },
]

const PAGE_SIZES = [20, 50, 100]

const columns = [
  'Статус',
  'Тип документа',
  'Дата обновления',
  'Контрагент',
  'ИНН/ПИНФЛ',
  'Номер и дата документа',
  'Стоимость (сум)',
]

type DocumentsListPageProps = {
  direction: DocDirection
}

function IconButton({
  icon,
  onClick,
  label,
}: {
  icon: React.ReactNode
  onClick?: () => void
  label: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex size-11 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 transition hover:bg-gray-50"
    >
      {icon}
    </button>
  )
}

export default function DocumentsListPage({ direction }: DocumentsListPageProps) {
  const navigate = useNavigate()
  const [docs, setDocs] = useState(mockDocuments)
  const [tab, setTab] = useState<StatusTab>('all')
  const [innQuery, setInnQuery] = useState('')
  const [pageSize, setPageSize] = useState(20)
  const [page, setPage] = useState(1)
  const [showFilter, setShowFilter] = useState(false)
  const [filters, setFilters] = useState<DocFilters>(EMPTY_FILTERS)

  const scoped = useMemo(
    () => docs.filter((d) => d.direction === direction),
    [docs, direction],
  )

  const counts = useMemo(() => {
    const c = { all: scoped.length, signed: 0, pending: 0, canceled: 0 }
    for (const d of scoped) c[d.status]++
    return c
  }, [scoped])

  const filtered = useMemo(() => {
    const amountFrom = filters.amountFrom ? Number(filters.amountFrom) : null
    const amountTo = filters.amountTo ? Number(filters.amountTo) : null
    return scoped.filter((d) => {
      if (tab !== 'all' && d.status !== tab) return false
      if (innQuery.trim() && !d.counterparty.inn.includes(innQuery.trim())) return false
      if (filters.dateFrom && d.date < filters.dateFrom) return false
      if (filters.dateTo && d.date > filters.dateTo) return false
      if (filters.type !== 'all' && d.type !== filters.type) return false
      if (filters.number && !String(d.number).includes(filters.number.trim())) return false
      if (amountFrom !== null && (d.amountValue ?? 0) < amountFrom) return false
      if (amountTo !== null && (d.amountValue ?? 0) > amountTo) return false
      if (filters.hasLgota && d.vatCategory !== 'С льгота') return false
      return true
    })
  }, [scoped, tab, innQuery, filters])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const pageRows = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  function setStatus(id: number, status: DocStatus) {
    setDocs((prev) => prev.map((d) => (d.id === id ? { ...d, status } : d)))
  }

  return (
    <div className="rounded-md bg-white p-6 shadow-[0px_4px_12px_0px_rgba(0,0,0,0.08)]">
      {/* Toolbar */}
      <div className="flex items-center gap-3">
        <div className="flex flex-1 items-center gap-2 rounded-lg border border-gray-200 bg-white px-3.5 py-2.5">
          <Search className="size-5 text-gray-400" />
          <input
            value={innQuery}
            onChange={(e) => {
              setInnQuery(e.target.value)
              setPage(1)
            }}
            placeholder="Поиск по ИНН"
            className="flex-1 bg-transparent text-base text-gray-700 outline-none placeholder:text-gray-500"
          />
        </div>
        <IconButton label="Печать" icon={<Printer className="size-5" />} onClick={() => window.print()} />
        <IconButton
          label="Скачать"
          icon={<Download className="size-5" />}
          onClick={() => downloadDocumentsCsv(filtered)}
        />
        <button
          type="button"
          onClick={() => setShowFilter((v) => !v)}
          aria-label="Фильтр"
          className={cn(
            'flex size-11 items-center justify-center rounded-lg border transition',
            showFilter
              ? 'border-Smart-blue bg-Smart-blue/5 text-Smart-blue'
              : 'border-gray-200 bg-white text-gray-500 hover:bg-gray-50',
          )}
        >
          <SlidersHorizontal className="size-5" />
        </button>
        {direction === 'outgoing' && (
          <button
            onClick={() => navigate('/documents/create')}
            className="flex items-center gap-2 rounded-lg bg-Smart-green px-4 py-2.5 text-base font-semibold text-white shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] transition hover:brightness-105"
          >
            <Plus className="size-5" />
            Создать документ
          </button>
        )}
      </div>

      {showFilter && (
        <div className="mt-4">
          <DocumentsFilterPanel
            initial={filters}
            onApply={(f) => {
              setFilters(f)
              setPage(1)
            }}
            onReset={() => {
              setFilters(EMPTY_FILTERS)
              setPage(1)
            }}
          />
        </div>
      )}

      {/* Status tabs */}
      <div className="mt-6 flex items-center gap-6 border-b border-gray-200">
        {STATUS_TABS.map((t) => {
          const active = t.value === tab
          return (
            <button
              key={t.value}
              onClick={() => {
                setTab(t.value)
                setPage(1)
              }}
              className={cn(
                'flex h-12 items-center gap-3 border-b-2 px-3.5 text-sm font-medium transition',
                active
                  ? 'border-Smart-blue text-slate-800'
                  : 'border-transparent text-gray-400 hover:text-slate-600',
              )}
            >
              {t.label}
              <span
                className={cn(
                  'flex min-w-6 items-center justify-center rounded-2xl px-2 py-0.5 text-xs text-white',
                  t.pill,
                )}
              >
                {counts[t.value]}
              </span>
            </button>
          )
        })}
      </div>

      {/* Pagination header */}
      <div className="mt-4 flex items-center gap-3">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className="flex size-9 items-center justify-center rounded-full border border-gray-200 bg-white text-slate-700 transition hover:bg-gray-50 disabled:opacity-40"
        >
          <ChevronLeft className="size-4" />
        </button>
        <div className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-semibold text-slate-700">
          {currentPage}/{totalPages}
        </div>
        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
          className="flex size-9 items-center justify-center rounded-full border border-gray-200 bg-white text-slate-700 transition hover:bg-gray-50 disabled:opacity-40"
        >
          <ChevronRight className="size-4" />
        </button>

        <span className="ml-2 text-base text-gray-500">Показать по:</span>
        <div className="relative">
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value))
              setPage(1)
            }}
            className="appearance-none rounded-lg border border-gray-200 bg-white py-2.5 pl-4 pr-9 text-sm font-semibold text-slate-700 outline-none"
          >
            {PAGE_SIZES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
        </div>

        <div className="ml-auto flex items-center gap-2">
          <span className="text-base font-medium text-slate-600">Итог по количеству:</span>
          <span className="text-base font-bold text-slate-800">{filtered.length}</span>
        </div>
      </div>

      {/* Table */}
      <div className="mt-4 overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-50">
              {columns.map((c) => (
                <th
                  key={c}
                  className="border-b border-gray-200 px-4 py-3 text-left text-xs font-medium text-gray-900"
                >
                  {c}
                </th>
              ))}
              <th className="border-b border-gray-200 px-2 py-3" />
            </tr>
          </thead>
          <tbody>
            {pageRows.length === 0 && (
              <tr>
                <td colSpan={columns.length + 1} className="px-4 py-12 text-center text-gray-400">
                  Документы не найдены
                </td>
              </tr>
            )}
            {pageRows.map((doc) => (
              <tr key={doc.id} className="border-b border-gray-200 last:border-b-0">
                <td className="h-16 px-4">
                  <StatusBadge status={doc.status} />
                </td>
                <td className="h-16 px-4 text-gray-900">{doc.type}</td>
                <td className="h-16 px-4 text-gray-900">{formatDate(doc.date)}</td>
                <td className="h-16 px-4 text-gray-900">{doc.counterparty.name}</td>
                <td className="h-16 px-4 text-gray-900">{doc.counterparty.inn}</td>
                <td className="h-16 px-4 text-gray-900">
                  {doc.number} от {formatDate(doc.date)}
                </td>
                <td className="h-16 px-4 text-gray-900">{formatAmount(doc.amountValue)}</td>
                <td className="h-16 px-2 text-center">
                  <RowMenu
                    items={[
                      {
                        label: 'Подписать',
                        icon: <PenLine className="size-4" />,
                        disabled: doc.status !== 'pending',
                        onClick: () => setStatus(doc.id, 'signed'),
                      },
                      {
                        label: 'Скачать',
                        icon: <Download className="size-4" />,
                        onClick: () => downloadDocumentsCsv([doc]),
                      },
                      {
                        label: 'Отменить',
                        icon: <XCircle className="size-4" />,
                        danger: true,
                        disabled: doc.status === 'canceled',
                        onClick: () => setStatus(doc.id, 'canceled'),
                      },
                    ]}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination footer */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="flex size-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-slate-700 transition hover:bg-gray-50 disabled:opacity-40"
          >
            <ChevronLeft className="size-5" />
          </button>

          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={cn(
                  'flex size-10 items-center justify-center rounded-lg text-sm font-medium transition',
                  p === currentPage
                    ? 'bg-Smart-blue text-white'
                    : 'text-slate-600 hover:bg-gray-50',
                )}
              >
                {p}
              </button>
            ))}
          </div>

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="flex size-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-slate-700 transition hover:bg-gray-50 disabled:opacity-40"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>
      )}
    </div>
  )
}
