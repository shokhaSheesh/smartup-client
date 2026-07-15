export type DocDirection = 'incoming' | 'outgoing'
export type DocStatus = 'signed' | 'pending' | 'canceled'

export type DocumentRow = {
  id: number
  direction: DocDirection
  status: DocStatus
  type: string
  counterparty: { name: string; inn: string }
  numberDate: string
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
