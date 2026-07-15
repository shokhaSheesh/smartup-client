import type { DocumentRow, VatCategory } from '@/types/document'
import { RU_MONTHS } from '@/lib/date'

export type Segment = { name: string; value: number; color: string }

const VAT_COLORS: Record<VatCategory, string> = {
  'С льгота': '#2DD4BF',
  'Без НДС': '#A78BFA',
  '0 ставка': '#FCD34D',
  '15 ставка': '#3B82F6',
}

function monthIndex(iso: string): number {
  return Number(iso.slice(5, 7)) - 1
}

/** Stacked bar: signed / pending / rejected counts per month. */
export function statusByMonth(docs: DocumentRow[]) {
  const rows = RU_MONTHS.map((month) => ({
    month,
    signed: 0,
    pending: 0,
    rejected: 0,
  }))
  for (const doc of docs) {
    const row = rows[monthIndex(doc.date)]
    if (doc.status === 'signed') row.signed++
    else if (doc.status === 'pending') row.pending++
    else row.rejected++
  }
  return rows
}

/** Grouped bar: incoming vs outgoing document counts per month. */
export function directionByMonth(docs: DocumentRow[]) {
  const rows = RU_MONTHS.map((month) => ({ month, incoming: 0, outgoing: 0 }))
  for (const doc of docs) {
    const row = rows[monthIndex(doc.date)]
    if (doc.direction === 'incoming') row.incoming++
    else row.outgoing++
  }
  return rows
}

/** Donut: accepted (signed) documents, summed by VAT category. */
export function acceptedByVat(docs: DocumentRow[]): Segment[] {
  const totals = new Map<VatCategory, number>()
  for (const doc of docs) {
    if (doc.status !== 'signed' || doc.amountValue === null) continue
    totals.set(doc.vatCategory, (totals.get(doc.vatCategory) ?? 0) + doc.amountValue)
  }
  return (Object.keys(VAT_COLORS) as VatCategory[])
    .map((cat) => ({ name: cat, value: totals.get(cat) ?? 0, color: VAT_COLORS[cat] }))
    .filter((s) => s.value > 0)
}

/** Donut: not-accepted documents (rejected + pending), summed by status. */
export function notAcceptedByStatus(docs: DocumentRow[]): Segment[] {
  let rejected = 0
  let pending = 0
  for (const doc of docs) {
    if (doc.amountValue === null) continue
    if (doc.status === 'canceled') rejected += doc.amountValue
    else if (doc.status === 'pending') pending += doc.amountValue
  }
  return [
    { name: 'Отказанные', value: rejected, color: '#F87171' },
    { name: 'Ожидающие', value: pending, color: '#FDE9B8' },
  ].filter((s) => s.value > 0)
}
