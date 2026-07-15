export type DocDirection = 'incoming' | 'outgoing'
export type DocStatus = 'signed' | 'pending' | 'canceled'

export type DocumentRow = {
  id: number
  direction: DocDirection
  status: DocStatus
  type: string
  counterparty: { name: string; inn: string }
  /** ISO date (YYYY-MM-DD) used for filtering. */
  date: string
  /** Document number shown in the "Номер и дата" column. */
  number: number
  amount: string | null
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
