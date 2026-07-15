import { useMemo, useState } from 'react'
import {
  Search,
  Plus,
  Trash2,
  Check,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { mockProducts, productCatalog } from '@/data/mockProducts'
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
  const [page, setPage] = useState(1)
  const [addOpen, setAddOpen] = useState(false)
  const [catalogQuery, setCatalogQuery] = useState('')
  const [addedIds, setAddedIds] = useState<Set<number>>(new Set())

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

  const catalogResults = useMemo(() => {
    const q = catalogQuery.trim().toLowerCase()
    if (!q) return productCatalog
    return productCatalog.filter(
      (p) => p.name.toLowerCase().includes(q) || p.code.toLowerCase().includes(q),
    )
  }, [catalogQuery])

  function addFromCatalog(item: Product) {
    const next: Product = { ...item, id: Math.max(0, ...products.map((p) => p.id)) + 1 }
    setProducts((p) => [next, ...p])
    setAddedIds((s) => new Set(s).add(item.id))
    setPage(1)
  }

  function openAdd() {
    setCatalogQuery('')
    setAddedIds(new Set())
    setAddOpen(true)
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
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
        <button
          onClick={openAdd}
          className="flex items-center gap-2 rounded-md bg-Smart-green px-4 py-2.5 text-sm font-medium text-white transition hover:brightness-105"
        >
          <Plus className="size-5" />
          Добавить
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

      {/* Add modal — search the catalog */}
      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Добавить товар/услугу" maxWidth="max-w-2xl">
        <div className="flex flex-col p-6">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3.5 top-3 size-5 text-gray-500" />
            {/* eslint-disable-next-line jsx-a11y/no-autofocus */}
            <input
              autoFocus
              value={catalogQuery}
              onChange={(e) => setCatalogQuery(e.target.value)}
              placeholder="Поиск по названию или коду"
              className={cn(input, 'pl-10')}
            />
          </div>

          <div className="mt-4 max-h-96 overflow-y-auto">
            {catalogResults.length === 0 ? (
              <div className="py-10 text-center text-sm text-gray-400">Ничего не найдено</div>
            ) : (
              <ul className="flex flex-col gap-1">
                {catalogResults.map((item) => {
                  const added = addedIds.has(item.id)
                  return (
                    <li key={item.id}>
                      <button
                        onClick={() => !added && addFromCatalog(item)}
                        disabled={added}
                        className="flex w-full items-center gap-3 rounded-lg border border-gray-100 px-4 py-3 text-left transition hover:bg-gray-50 disabled:cursor-default"
                      >
                        <div className="flex-1">
                          <div className="text-sm font-medium text-slate-800">{item.name}</div>
                          <div className="mt-0.5 text-xs text-gray-400">
                            {item.code} · {item.unit}
                          </div>
                        </div>
                        {added ? (
                          <span className="flex items-center gap-1 text-sm font-medium text-Smart-green">
                            <Check className="size-4" /> Добавлено
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-sm font-medium text-Smart-blue">
                            <Plus className="size-4" /> Добавить
                          </span>
                        )}
                      </button>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>

          <button
            onClick={() => setAddOpen(false)}
            className="mt-5 self-end rounded-lg bg-Smart-blue px-6 py-2.5 text-sm font-semibold text-white hover:brightness-105"
          >
            Готово
          </button>
        </div>
      </Modal>
    </div>
  )
}
