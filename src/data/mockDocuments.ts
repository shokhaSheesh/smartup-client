import type { DocumentRow, DocDirection, DocStatus, VatCategory } from '@/types/document'
import { DOC_TYPES } from './docTypes'

const co = { name: 'OOO "UDEVS"', inn: '123456789' }
const creators = ['Азизбек Баходиров', 'Kristin Watson', 'Jacob Jones', 'Дилшод Каримов']
const directions: DocDirection[] = ['incoming', 'outgoing']
const statuses: DocStatus[] = ['signed', 'signed', 'signed', 'pending', 'pending', 'canceled']
const vatCats: VatCategory[] = ['С льгота', 'Без НДС', '0 ставка', '15 ставка']

/** Deterministic pseudo-random so the dataset is stable across reloads. */
function makeRng(seed: number) {
  let s = seed
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296
    return s / 4294967296
  }
}

function pick<T>(arr: T[], r: number): T {
  return arr[Math.floor(r * arr.length)]
}

function generate(): DocumentRow[] {
  const rng = makeRng(20220101)
  const docs: DocumentRow[] = []
  let id = 1

  for (let month = 0; month < 12; month++) {
    const count = 8 + Math.floor(rng() * 8) // 8–15 docs per month
    for (let k = 0; k < count; k++) {
      const day = 1 + Math.floor(rng() * 27)
      const status = pick(statuses, rng())
      const hasAmount = rng() > 0.15
      docs.push({
        id: id++,
        direction: pick(directions, rng()),
        status,
        type: pick([...DOC_TYPES], rng()),
        counterparty: co,
        date: `2022-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
        number: 1 + Math.floor(rng() * 900),
        amountValue: hasAmount ? (1 + Math.floor(rng() * 200)) * 1_000_000 : null,
        vatCategory: pick(vatCats, rng()),
        creator: pick(creators, rng()),
      })
    }
  }
  return docs
}

export const mockDocuments: DocumentRow[] = generate()

/** Overall totals shown in the stat cards (design values, not filtered). */
export const docStats = [
  { key: 'all', label: 'Все', value: 2603, valueColor: 'text-Smart-green', iconBg: 'bg-slate-50' },
  { key: 'signed', label: 'Подписанные', value: 1321, valueColor: 'text-Smart-blue', iconBg: 'bg-emerald-50' },
  { key: 'pending', label: 'Ожидающие', value: 648, valueColor: 'text-Smart-blue', iconBg: 'bg-amber-50' },
  { key: 'canceled', label: 'Отменённые', value: 514, valueColor: 'text-Smart-blue', iconBg: 'bg-red-50' },
  { key: 'rejected', label: 'Отменённые', value: 120, valueColor: 'text-Smart-blue', iconBg: 'bg-gray-100' },
] as const
