import { useMemo, useState } from 'react'
import {
  Search,
  Plus,
  RotateCcw,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
} from 'lucide-react'
import { mockProducts } from '@/data/mockProducts'
import type { Product } from '@/data/mockProducts'
import { Modal } from '@/components/ui/Modal'
import { cn } from '@/lib/cn'

const columns = [
  '#',
  'Классификатор коди',
  'Классификатор названия',
  'Единица измерения',
  'Товар/хизмат штрих коди',
]
const PAGE_SIZE = 9

const input =
  'w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-base text-slate-800 outline-none placeholder:text-gray-400 focus:border-Smart-blue'

export default function ProductsPage() {
  const [products, setProducts] = useState(mockProducts)
  const [query, setQuery] = useState('')
  const [addQuery, setAddQuery] = useState('')
  const [page, setPage] = useState(1)
  const [addOpen, setAddOpen] = useState(false)
  const [draft, setDraft] = useState({ code: '', name: '', unit: '', barcode: '' })

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return products
    return products.filter(
      (p) =>
        p.code.toLowerCase().includes(q) ||
        p.name.toLowerCase().includes(q) ||
        p.barcode.toLowerCase().includes(q),
    )
  }, [products, query])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const pageRows = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  function addProduct() {
    if (!draft.code && !draft.name) return
    const next: Product = {
      id: Math.max(0, ...products.map((p) => p.id)) + 1,
      code: draft.code || '—',
      name: draft.name || '—',
      unit: draft.unit || '—',
      barcode: draft.barcode || draft.code || '—',
    }
    setProducts((p) => [next, ...p])
    setDraft({ code: '', name: '', unit: '', barcode: '' })
    setAddOpen(false)
    setPage(1)
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-4">
          <div className="relative w-96">
            <Search className="pointer-events-none absolute left-3.5 top-3 size-5 text-gray-500" />
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                setPage(1)
              }}
              placeholder="Поиск по добавленным кодам"
              className={cn(input, 'pl-10')}
            />
          </div>
          <div className="flex flex-1 items-center gap-2">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3.5 top-3 size-5 text-gray-500" />
              <input
                value={addQuery}
                onChange={(e) => setAddQuery(e.target.value)}
                placeholder="Поиск"
                className={cn(input, 'pl-10 pr-9')}
              />
              <ChevronDown className="pointer-events-none absolute right-3 top-3 size-5 text-gray-400" />
            </div>
            <button
              onClick={() => setAddOpen(true)}
              className="flex items-center gap-2 rounded-md bg-Smart-green px-4 py-2.5 text-sm font-medium text-white transition hover:brightness-105"
            >
              <Plus className="size-5" />
              Добавить
            </button>
          </div>
        </div>
        <button
          onClick={() => {
            setQuery('')
            setAddQuery('')
            setPage(1)
          }}
          className="flex items-center gap-2 rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-Smart-blue transition hover:bg-gray-50"
        >
          <RotateCcw className="size-5" />
          Очистить
        </button>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-[0px_1px_2px_0px_rgba(16,24,40,0.06)]">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-50 text-left text-xs font-medium text-gray-900">
                {columns.map((c, i) => (
                  <th key={c} className={cn('px-6 py-3', i === 0 && 'text-slate-600')}>
                    {c}
                  </th>
                ))}
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody>
              {pageRows.length === 0 && (
                <tr>
                  <td colSpan={columns.length + 1} className="px-6 py-12 text-center text-gray-400">
                    Ничего не найдено
                  </td>
                </tr>
              )}
              {pageRows.map((p, idx) => (
                <tr key={p.id} className="border-b border-gray-200 last:border-b-0">
                  <td className="px-6 py-4 align-top text-slate-600">
                    {(currentPage - 1) * PAGE_SIZE + idx + 1}
                  </td>
                  <td className="px-6 py-4 align-top text-gray-900">{p.code}</td>
                  <td className="w-72 px-6 py-4 align-top text-gray-900">{p.name}</td>
                  <td className="w-96 px-6 py-4 align-top text-gray-900">{p.unit}</td>
                  <td className="px-6 py-4 align-top text-gray-900">{p.barcode}</td>
                  <td className="px-6 py-4 align-top text-right">
                    <button
                      onClick={() => setProducts((prev) => prev.filter((x) => x.id !== p.id))}
                      className="flex size-9 items-center justify-center rounded-lg text-slate-600 transition hover:bg-red-50 hover:text-red-500"
                      aria-label="Удалить"
                    >
                      <Trash2 className="size-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-gray-200 px-6 py-3">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="flex size-10 items-center justify-center rounded-lg border border-gray-300 bg-white text-slate-700 transition hover:bg-gray-50 disabled:opacity-40"
          >
            <ChevronLeft className="size-5" />
          </button>
          <div className="flex items-center gap-0.5">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={cn(
                  'flex size-10 items-center justify-center rounded-lg text-sm font-medium transition',
                  p === currentPage ? 'bg-gray-100 text-slate-800' : 'text-gray-900 hover:bg-gray-50',
                )}
              >
                {p}
              </button>
            ))}
          </div>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="flex size-10 items-center justify-center rounded-lg border border-gray-300 bg-white text-slate-700 transition hover:bg-gray-50 disabled:opacity-40"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>
      </div>

      {/* Add modal */}
      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Добавить товар/услугу">
        <div className="flex flex-col gap-4 p-6">
          <input className={input} placeholder="Классификатор коди" value={draft.code} onChange={(e) => setDraft((d) => ({ ...d, code: e.target.value }))} />
          <input className={input} placeholder="Классификатор названия" value={draft.name} onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))} />
          <input className={input} placeholder="Единица измерения" value={draft.unit} onChange={(e) => setDraft((d) => ({ ...d, unit: e.target.value }))} />
          <input className={input} placeholder="Товар/хизмат штрих коди" value={draft.barcode} onChange={(e) => setDraft((d) => ({ ...d, barcode: e.target.value }))} />
          <div className="flex gap-3">
            <button onClick={() => setAddOpen(false)} className="flex-1 rounded-lg border border-gray-200 py-2.5 text-sm font-semibold text-slate-700 hover:bg-gray-50">
              Отмена
            </button>
            <button onClick={addProduct} className="flex-1 rounded-lg bg-Smart-green py-2.5 text-sm font-semibold text-white hover:brightness-105">
              Добавить
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
