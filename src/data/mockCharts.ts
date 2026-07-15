const MONTHS = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабр',
]

// Stacked bar: signed / pending / rejected per month
export const stackedBarData = MONTHS.map((month, i) => {
  const signed = [50, 32, 32, 47, 35, 35, 35, 35, 35, 35, 12, 24][i]
  const rejected = [35, 62, 55, 65, 45, 45, 45, 45, 45, 45, 68, 30][i]
  const pending = [28, 36, 30, 20, 50, 50, 50, 50, 50, 50, 25, 30][i]
  return { month, signed, pending, rejected }
})

// Grouped bar: incoming vs outgoing products per month
export const groupedBarData = MONTHS.map((month, i) => ({
  month,
  incoming: [890, 980, 720, 110, 110, 390, 110, 590, 110, 110, 500, 1080][i],
  outgoing: [760, 1010, 750, 240, 240, 870, 240, 990, 240, 310, 780, 1190][i],
}))

// Donut: accepted documents
export const acceptedDonut = [
  { name: 'С льгота', value: 520000, color: '#2DD4BF' },
  { name: 'Без НДС', value: 400000, color: '#A78BFA' },
  { name: '0 ставка', value: 200000, color: '#FCD34D' },
  { name: '15 ставка', value: 190000, color: '#3B82F6' },
]

// Donut: not-accepted documents (with gray remainder)
export const notAcceptedDonut = [
  { name: 'Отказанные', value: 400000, color: '#F87171' },
  { name: 'Ожидающие', value: 200000, color: '#FDE9B8' },
  { name: 'Подписанные', value: 190000, color: '#43B02A' },
  { name: 'Прочие', value: 490000, color: '#E5E7EB' },
]

export const donutTotal = '1 280 000 сум'
