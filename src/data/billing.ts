import { useSyncExternalStore } from 'react'

export type Plan = {
  key: string
  name: string
  price: string
  period: string
  features: string[]
}

export const plans: Plan[] = [
  {
    key: 'starter',
    name: 'Starter',
    price: '500 000',
    period: '30 дней',
    features: [
      'До 100 документов/месяц',
      '5 пользователей',
      '1 интеграция (1C или Smartup)',
      'Базовая поддержка (email)',
    ],
  },
  {
    key: 'business',
    name: 'Business',
    price: '1 500 000',
    period: '30 дней',
    features: [
      'До 500 документов/месяц',
      '20 пользователей',
      '3 интеграции',
      'Приоритетная поддержка (email + Telegram)',
      'Базовая аналитика',
      'Telegram Bot',
    ],
  },
  {
    key: 'enterprise',
    name: 'Enterprise',
    price: '4 500 000',
    period: '30 дней',
    features: [
      'До 2000 документов/месяц',
      'Безлимит пользователей',
      'Все доступные интеграции',
      'Расширенная аналитика и отчеты',
      'Премиум поддержка (24/7, phone + email + Telegram)',
      'API доступ (для кастомных интеграций)',
      'Персональный менеджер',
      'SLA 99.9%',
    ],
  },
  {
    key: 'custom',
    name: 'Custom',
    price: 'По запросу',
    period: '30 дней',
    features: [
      'Безлимит документов',
      'Кастомные интеграции',
      'Выделенная инфраструктура (опционально)',
      'Индивидуальный SLA',
      'Обучение персонала',
      'Приоритетная разработка функций',
    ],
  },
]

export const currentSubscription = {
  planKey: 'starter',
  activeUntil: '12.05.2025',
  documentsUsed: 37,
  documentsLimit: 100,
  usersUsed: 3,
  usersLimit: 5,
  integration: '1C',
}

export const balance = '20 040 000 сум'
export const billingId = '523452345'

/**
 * Who a saved card belongs to — asked once, when the card is added. A corporate
 * card is tied to the company's ИНН and needs nothing more. A personal card
 * carries its owner's ПИНФЛ, because every top-up from it needs a three-party
 * agreement so the счёт-фактура can still go to the company.
 */
export type CardOwner = 'company' | 'personal'

export type SavedCard = {
  id: number
  brand: 'humo' | 'uzcard' | 'mastercard' | 'visa'
  masked: string
  exp: string
  owner: CardOwner
  /** Set for personal cards only. */
  holderPinfl?: string
  holderName?: string
}

const seedCards: SavedCard[] = [
  { id: 1, brand: 'humo', masked: '9443 47** **** 8532', exp: '12/25', owner: 'company' },
  {
    id: 2,
    brand: 'uzcard',
    masked: '9443 47** **** 8532',
    exp: '12/25',
    owner: 'personal',
    holderPinfl: '31204856730018',
    holderName: 'Азизбек Баходиров',
  },
  { id: 3, brand: 'mastercard', masked: '9443 47** **** 8532', exp: '12/25', owner: 'company' },
  {
    id: 4,
    brand: 'visa',
    masked: '9443 47** **** 8532',
    exp: '12/25',
    owner: 'personal',
    holderPinfl: '42508917640025',
    holderName: 'Muxlisa Xoliyorova',
  },
]

// Saved cards are shared by the cards tab, the add-card page and the top-up
// page, so they live in a small store rather than in one page's state.
let savedCards = seedCards
const cardListeners = new Set<() => void>()

function setSavedCards(next: SavedCard[]) {
  savedCards = next
  cardListeners.forEach((l) => l())
}

export function addSavedCard(card: Omit<SavedCard, 'id' | 'brand' | 'masked'> & { number: string }) {
  const { number, ...rest } = card
  const brand: SavedCard['brand'] = number.startsWith('9860')
    ? 'humo'
    : number.startsWith('4')
      ? 'visa'
      : number.startsWith('5')
        ? 'mastercard'
        : 'uzcard'
  const masked = `${number.slice(0, 4)} ${number.slice(4, 6)}** **** ${number.slice(-4)}`
  const id = Math.max(0, ...savedCards.map((c) => c.id)) + 1
  setSavedCards([...savedCards, { ...rest, id, brand, masked }])
}

export function removeSavedCard(id: number) {
  setSavedCards(savedCards.filter((c) => c.id !== id))
}

export function useSavedCards(): SavedCard[] {
  return useSyncExternalStore(
    (listener) => {
      cardListeners.add(listener)
      return () => cardListeners.delete(listener)
    },
    () => savedCards,
  )
}

export type PaymentHistory = {
  id: number
  date: string
  description: string
  amount: string
  status: 'success' | 'pending' | 'failed'
}

export const paymentHistory: PaymentHistory[] = [
  { id: 1, date: '12.04.2025', description: 'Оплата тарифа Starter', amount: '500 000 сум', status: 'success' },
  { id: 2, date: '15.03.2025', description: 'Пополнение баланса', amount: '5 000 000 сум', status: 'success' },
  { id: 3, date: '12.03.2025', description: 'Оплата тарифа Starter', amount: '500 000 сум', status: 'success' },
]

export type Invoice = {
  id: number
  number: string
  date: string
  amount: string
  status: 'paid' | 'unpaid'
}

export const invoices: Invoice[] = [
  { id: 1, number: 'INV-2025-041', date: '12.04.2025', amount: '500 000 сум', status: 'paid' },
  { id: 2, number: 'INV-2025-032', date: '12.03.2025', amount: '500 000 сум', status: 'paid' },
  { id: 3, number: 'INV-2025-021', date: '12.02.2025', amount: '500 000 сум', status: 'unpaid' },
]

/** The company this account belongs to — счета-фактуры for our services go to it. */
export const company = { name: 'Udevs MCHJ', inn: '397 308 543' }

const PINFL_NAMES = [
  'Каримов Азиз Рустамович',
  'Юсупова Малика Камоловна',
  'Абдуллаев Жасур Нодирович',
  'Рахимова Севара Отабековна',
  'Тошматов Бекзод Икромович',
]

/**
 * Resolves a card owner by ПИНФЛ. Mocked: any complete 14-digit ПИНФЛ returns a
 * stable name, standing in for the registry lookup the backend will do.
 */
export function lookupPinfl(pinfl: string): string | null {
  if (!/^\d{14}$/.test(pinfl)) return null
  const sum = [...pinfl].reduce((acc, d) => acc + Number(d), 0)
  return PINFL_NAMES[sum % PINFL_NAMES.length]
}
