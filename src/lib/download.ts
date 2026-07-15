import type { DocumentRow } from '@/types/document'
import { directionLabel, statusLabel, numberDate, formatAmount } from '@/types/document'

/** Triggers a client-side download of the given documents as a CSV file. */
export function downloadDocumentsCsv(docs: DocumentRow[]) {
  const headers = ['№', 'Документы', 'Статус', 'Тип документа', 'Контрагент', 'ИНН', 'Номер и дата', 'Сумма', 'Создатель']
  const rows = docs.map((d) => [
    d.id,
    directionLabel[d.direction],
    statusLabel[d.status],
    d.type,
    d.counterparty.name,
    d.counterparty.inn,
    numberDate(d),
    formatAmount(d.amountValue),
    d.creator,
  ])

  const escape = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`
  const csv = [headers, ...rows].map((r) => r.map(escape).join(';')).join('\r\n')

  // BOM so Excel reads UTF-8 (Cyrillic) correctly.
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `documents-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}
