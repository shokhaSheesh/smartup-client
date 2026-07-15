export type DocDirection = 'incoming' | 'outgoing'
export type DocStatus = 'signed' | 'pending' | 'canceled'
export type VatCategory = 'С льгота' | 'Без НДС' | '0 ставка' | '15 ставка'

export type DocumentRow = {
  id: number
  direction: DocDirection
  status: DocStatus
  type: string
  counterparty: { name: string; inn: string }
  /** ISO date (YYYY-MM-DD) used for filtering and monthly grouping. */
  date: string
  /** Document number shown in the "Номер и дата" column. */
  number: number
  /** Amount in сум; null when the document has no monetary value. */
  amountValue: number | null
  vatCategory: VatCategory
  creator: string
}

export const directionLabel: Record<DocDirection, string> = {
  incoming: 'Входящий',
  outgoing: 'Исходящий',
}

export const statusLabel: Record<DocStatus, string> = {
  signed: 'Подписан',
  pending: 'Ожидает',
  canceled: 'Отменено',
}

/** Formats an ISO date as DD.MM.YYYY. */
export function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-')
  return `${d}.${m}.${y}`
}

/** "Номер и дата" cell text, e.g. "2 от 29.05.2022". */
export function numberDate(doc: Pick<DocumentRow, 'number' | 'date'>): string {
  return `${doc.number} от ${formatDate(doc.date)}`
}

/** Formats an amount with spaces as thousands separators, or "-" when null. */
export function formatAmount(value: number | null): string {
  if (value === null) return '-'
  return value.toLocaleString('ru-RU').replace(/,/g, ' ')
}
