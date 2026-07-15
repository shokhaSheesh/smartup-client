import type { DocumentRow } from '@/types/document'

const co = { name: 'OOO "UDEVS"', inn: '123456789' }

export const mockDocuments: DocumentRow[] = [
  { id: 1, direction: 'incoming', status: 'canceled', type: 'Акт', counterparty: co, numberDate: '2 от 29.05.2022', amount: '100 000 000', creator: 'Азизбек Баходиров' },
  { id: 2, direction: 'outgoing', status: 'signed', type: 'Доверенность', counterparty: co, numberDate: '2 от 29.05.2022', amount: null, creator: 'Kristin Watson' },
  { id: 3, direction: 'incoming', status: 'pending', type: 'Договор', counterparty: co, numberDate: '2 от 29.05.2022', amount: '100 000 000', creator: 'Jacob Jones' },
  { id: 4, direction: 'outgoing', status: 'signed', type: 'Счет-фактура(ФАРМ)', counterparty: co, numberDate: '2 от 29.05.2022', amount: '100 000 000', creator: 'Kristin Watson' },
  { id: 5, direction: 'incoming', status: 'signed', type: 'Доверенность', counterparty: co, numberDate: '2 от 29.05.2022', amount: '100 000 000', creator: 'Jacob Jones' },
  { id: 6, direction: 'outgoing', status: 'pending', type: 'Акт', counterparty: co, numberDate: '2 от 29.05.2022', amount: '100 000 000', creator: 'Kristin Watson' },
  { id: 7, direction: 'incoming', status: 'signed', type: 'Доверенность', counterparty: co, numberDate: '2 от 29.05.2022', amount: '100 000 000', creator: 'Jacob Jones' },
  { id: 8, direction: 'outgoing', status: 'pending', type: 'Акт', counterparty: co, numberDate: '2 от 29.05.2022', amount: '100 000 000', creator: 'Kristin Watson' },
  { id: 9, direction: 'incoming', status: 'signed', type: 'Доверенность', counterparty: co, numberDate: '2 от 29.05.2022', amount: null, creator: 'Jacob Jones' },
  { id: 10, direction: 'outgoing', status: 'canceled', type: 'Акт', counterparty: co, numberDate: '2 от 29.05.2022', amount: null, creator: 'Азизбек Баходиров' },
]

export const docStats = [
  { key: 'all', label: 'Все', value: 2603, valueColor: 'text-Smart-green', iconBg: 'bg-slate-50' },
  { key: 'signed', label: 'Подписанные', value: 1321, valueColor: 'text-Smart-blue', iconBg: 'bg-emerald-50' },
  { key: 'pending', label: 'Ожидающие', value: 648, valueColor: 'text-Smart-blue', iconBg: 'bg-amber-50' },
  { key: 'canceled', label: 'Отменённые', value: 514, valueColor: 'text-Smart-blue', iconBg: 'bg-red-50' },
  { key: 'rejected', label: 'Отменённые', value: 120, valueColor: 'text-Smart-blue', iconBg: 'bg-gray-100' },
] as const
