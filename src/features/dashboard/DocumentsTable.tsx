import { Copy, PenLine, Download, X } from 'lucide-react'
import type { DocumentRow } from '@/types/document'
import { directionLabel, numberDate, formatAmount } from '@/types/document'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { downloadDocumentsCsv } from '@/lib/download'

const headers = ['№', 'Документы', 'Статус', 'Тип документа', 'Контрагент', 'Номер и дата', 'Сумма', 'Создатель']

type DocumentsTableProps = {
  documents: DocumentRow[]
  selected: Set<number>
  onToggle: (id: number) => void
  onToggleAll: () => void
  onClear: () => void
  onSign: () => void
}

export function DocumentsTable({
  documents,
  selected,
  onToggle,
  onToggleAll,
  onClear,
  onSign,
}: DocumentsTableProps) {
  const allSelected = documents.length > 0 && documents.every((d) => selected.has(d.id))
  const selectedDocs = documents.filter((d) => selected.has(d.id))
  const signableCount = selectedDocs.filter((d) => d.status === 'pending').length

  return (
    <section className="rounded-md bg-white py-2 shadow-[0px_4px_12px_0px_rgba(0,0,0,0.08)]">
      <div className="flex items-center justify-between gap-4 px-6 py-2">
        {selected.size > 0 ? (
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-slate-800">
              Выбрано: {selected.size}
            </span>
            <button
              onClick={onSign}
              disabled={signableCount === 0}
              className="flex h-9 items-center gap-2 rounded-lg bg-Smart-blue px-3.5 text-sm font-semibold text-white transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50"
              title={signableCount === 0 ? 'Нет документов со статусом «Ожидает»' : undefined}
            >
              <PenLine className="size-4" />
              Подписать{signableCount > 0 ? ` (${signableCount})` : ''}
            </button>
            <button
              onClick={() => downloadDocumentsCsv(selectedDocs)}
              className="flex h-9 items-center gap-2 rounded-lg border border-gray-200 bg-white px-3.5 text-sm font-semibold text-slate-700 transition hover:bg-gray-50"
            >
              <Download className="size-4" />
              Скачать
            </button>
            <button
              onClick={onClear}
              className="flex h-9 items-center gap-1 rounded-lg px-2 text-sm font-medium text-gray-500 transition hover:bg-gray-50"
            >
              <X className="size-4" />
              Отменить
            </button>
          </div>
        ) : (
          <span className="text-sm text-gray-400">
            Выберите документы для подписания или скачивания
          </span>
        )}

        <div className="flex items-center gap-2.5">
          <span className="text-base font-medium text-slate-800">Выбрать все</span>
          <input
            type="checkbox"
            checked={allSelected}
            onChange={onToggleAll}
            className="size-5 rounded border-gray-300 accent-[#1b9cd8]"
          />
        </div>
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
              {documents.length === 0 && (
                <tr>
                  <td
                    colSpan={headers.length + 1}
                    className="border-b border-gray-200 px-4 py-10 text-center text-gray-400"
                  >
                    Документы не найдены
                  </td>
                </tr>
              )}
              {documents.map((doc) => (
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
                    {numberDate(doc)}
                  </td>
                  <td className="border-b border-r border-gray-200 px-4 py-3 text-zinc-700">
                    {formatAmount(doc.amountValue)}
                  </td>
                  <td className="border-b border-r border-gray-200 px-4 py-3 text-zinc-700">
                    {doc.creator}
                  </td>
                  <td className="border-b border-gray-200 px-4 py-3 text-center">
                    <input
                      type="checkbox"
                      checked={selected.has(doc.id)}
                      onChange={() => onToggle(doc.id)}
                      className="size-5 rounded border-gray-300 accent-[#1b9cd8]"
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
