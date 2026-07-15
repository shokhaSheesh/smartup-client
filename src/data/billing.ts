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

export type SavedCard = {
  id: number
  brand: 'humo' | 'uzcard' | 'mastercard' | 'visa'
  masked: string
  exp: string
}

export const savedCards: SavedCard[] = [
  { id: 1, brand: 'humo', masked: '9443 47** **** 8532', exp: '12/25' },
  { id: 2, brand: 'uzcard', masked: '9443 47** **** 8532', exp: '12/25' },
  { id: 3, brand: 'mastercard', masked: '9443 47** **** 8532', exp: '12/25' },
  { id: 4, brand: 'visa', masked: '9443 47** **** 8532', exp: '12/25' },
]

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
