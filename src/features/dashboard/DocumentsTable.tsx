import { useState } from 'react'
import { Copy } from 'lucide-react'
import { mockDocuments } from '@/data/mockDocuments'
import { directionLabel } from '@/types/document'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { cn } from '@/lib/cn'

const headers = ['№', 'Документы', 'Статус', 'Тип документа', 'Контрагент', 'Номер и дата', 'Сумма', 'Создатель']

export function DocumentsTable() {
  const [selected, setSelected] = useState<Set<number>>(new Set())
  const allSelected = selected.size === mockDocuments.length

  function toggleAll() {
    setSelected(allSelected ? new Set() : new Set(mockDocuments.map((d) => d.id)))
  }
  function toggleOne(id: number) {
    setSelected((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  return (
    <section className="rounded-md bg-white py-2 shadow-[0px_4px_12px_0px_rgba(0,0,0,0.08)]">
      <div className="flex items-center justify-end gap-2.5 px-6 py-2">
        <span className="text-base font-medium text-slate-800">Выбрать все</span>
        <input
          type="checkbox"
          checked={allSelected}
          onChange={toggleAll}
          className="size-5 rounded border-gray-300 accent-[#1b9cd8]"
        />
      </div>

      <div className="px-6 pb-2">
        <div className="overflow-x-auto rounded-md border border-gray-200">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-white">
                {headers.map((h) => (
                  <th
                    key={h}
                    className="border-b border-r border-gray-200 px-4 py-3 text-left font-semibold text-zinc-900 last:border-r-0"
                  >
                    {h}
                  </th>
                ))}
                <th className="border-b border-gray-200 px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {mockDocuments.map((doc) => (
                <tr key={doc.id} className="bg-gray-50">
                  <td className="border-b border-r border-gray-200 px-4 py-3 text-center text-zinc-700">
                    {doc.id}
                  </td>
                  <td className="border-b border-r border-gray-200 px-4 py-3 text-zinc-700">
                    {directionLabel[doc.direction]}
                  </td>
                  <td className="border-b border-r border-gray-200 px-4 py-3">
                    <StatusBadge status={doc.status} />
                  </td>
                  <td className="border-b border-r border-gray-200 px-4 py-3 text-zinc-700">
                    {doc.type}
                  </td>
                  <td className="border-b border-r border-gray-200 px-4 py-3">
                    <div className="flex flex-col">
                      <span className="text-zinc-700">{doc.counterparty.name}</span>
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        {doc.counterparty.inn}
                        <Copy className="size-3.5" />
                      </span>
                    </div>
                  </td>
                  <td className="border-b border-r border-gray-200 px-4 py-3 text-zinc-700">
                    {doc.numberDate}
                  </td>
                  <td className="border-b border-r border-gray-200 px-4 py-3 text-zinc-700">
                    {doc.amount ?? '-'}
                  </td>
                  <td className="border-b border-r border-gray-200 px-4 py-3 text-zinc-700">
                    {doc.creator}
                  </td>
                  <td className="border-b border-gray-200 px-4 py-3 text-center">
                    <input
                      type="checkbox"
                      checked={selected.has(doc.id)}
                      onChange={() => toggleOne(doc.id)}
                      className={cn('size-5 rounded border-gray-300 accent-[#1b9cd8]')}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
