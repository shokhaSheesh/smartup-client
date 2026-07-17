import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, ChevronDown, Plus, Trash2, Check, Save } from 'lucide-react'
import { PillSelect } from '@/components/ui/PillSelect'
import { DOC_TYPES } from '@/data/docTypes'
import { cn } from '@/lib/cn'

const VARIANTS = ['Стандартный', 'Дополнительный', 'Исправленный']
const UNITS = ['Штук', 'кг', 'литр', 'метр', 'услуга']
const VAT_RATES = [0, 12, 15]

type LineItem = {
  id: number
  ikpu: string
  description: string
  barcode: string
  marking: string
  lot: string
  lgota: string
  unit: string
  qty: number
  price: number
  excise: number
  vat: number
}

let nextId = 3
function emptyItem(): LineItem {
  return { id: nextId++, ikpu: '', description: '', barcode: '', marking: '', lot: '', lgota: '', unit: 'Штук', qty: 0, price: 0, excise: 0, vat: 15 }
}

const field =
  'w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none placeholder:text-gray-400 focus:border-Smart-blue'

function CheckBox({
  checked,
  onChange,
  children,
}: {
  checked: boolean
  onChange: () => void
  children: React.ReactNode
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-500" onClick={onChange}>
      <span
        className={cn(
          'flex size-4 items-center justify-center rounded-sm border',
          checked ? 'border-Smart-green bg-gray-50 text-Smart-green' : 'border-gray-300 bg-gray-50',
        )}
      >
        {checked && <Check className="size-3" strokeWidth={3} />}
      </span>
      {children}
    </label>
  )
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-4 rounded-md bg-white p-6 shadow-[0px_1px_2px_0px_rgba(16,24,40,0.06)]">
      <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
      {children}
    </div>
  )
}

function num(v: string): number {
  const n = Number(v.replace(/\s/g, '').replace(',', '.'))
  return Number.isFinite(n) ? n : 0
}

function money(n: number): string {
  return n.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export default function CreateDocumentPage() {
  const navigate = useNavigate()
  const [docType, setDocType] = useState<string>('Счет-фактура без акта')
  const [variant, setVariant] = useState(VARIANTS[0])
  const [flags, setFlags] = useState({
    reverse: true,
    excise: false,
    marked: false,
    manual: false,
    farm: false,
  })
  const [yourFlags, setYourFlags] = useState({ komissioner: false, lgota: false, akciz: false })
  const [partnerFlags, setPartnerFlags] = useState({ odnostoronniy: false, poruchitel: false, lot: false })
  const [items, setItems] = useState<LineItem[]>([
    { id: 1, ikpu: '123456789009876 - Услуга в сфере', description: 'Услуга', barcode: '1234987', marking: '', lot: '', lgota: '', unit: 'Штук', qty: 12, price: 24000, excise: 0, vat: 15 },
    { id: 2, ikpu: '123456789009876 - Услуга в сфере', description: 'Услуга', barcode: '1234987', marking: '', lot: '', lgota: '', unit: 'Штук', qty: 32, price: 12000, excise: 0, vat: 15 },
  ])

  function updateItem(id: number, patch: Partial<LineItem>) {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, ...patch } : it)))
  }
  function removeItem(id: number) {
    setItems((prev) => prev.filter((it) => it.id !== id))
  }

  const rowSupply = (it: LineItem) => it.qty * it.price
  const rowVat = (it: LineItem) => (rowSupply(it) * it.vat) / 100
  const rowTotal = (it: LineItem) => rowSupply(it) + rowVat(it) + it.excise
  const totalSupply = items.reduce((s, it) => s + rowSupply(it), 0)
  const grandTotal = items.reduce((s, it) => s + rowTotal(it), 0)

  const cellCls = 'border-b border-r border-gray-200 px-3 py-2 text-sm'
  const cellInput = 'bg-transparent outline-none'

  // Conditional item-table columns driven by the toggles (like Didox).
  const showExcise = flags.excise || yourFlags.akciz
  const showMarking = flags.marked
  const showLot = partnerFlags.lot
  const showLgota = yourFlags.lgota

  type Col = { key: string; header: string; show?: boolean; cls?: string; cell: (it: LineItem, i: number) => React.ReactNode }
  const cols: Col[] = (
    [
      { key: 'num', header: '№', cls: 'text-center text-zinc-700', cell: (_it, i) => i + 1 },
      { key: 'ikpu', header: 'ИКПУ и наименование товаров (услуг)', cell: (it) => <input value={it.ikpu} onChange={(e) => updateItem(it.id, { ikpu: e.target.value })} placeholder="ИКПУ" className={cn(cellInput, 'w-56')} /> },
      { key: 'description', header: 'Описание товаров (услуг)', cell: (it) => <input value={it.description} onChange={(e) => updateItem(it.id, { description: e.target.value })} placeholder="Описание" className={cn(cellInput, 'w-40')} /> },
      { key: 'barcode', header: 'Штрих код', cell: (it) => <input value={it.barcode} onChange={(e) => updateItem(it.id, { barcode: e.target.value })} placeholder="—" className={cn(cellInput, 'w-28')} /> },
      { key: 'marking', header: 'Маркировка (KIZ)', show: showMarking, cell: (it) => <input value={it.marking} onChange={(e) => updateItem(it.id, { marking: e.target.value })} placeholder="KIZ" className={cn(cellInput, 'w-32')} /> },
      { key: 'lot', header: 'Номер лота', show: showLot, cell: (it) => <input value={it.lot} onChange={(e) => updateItem(it.id, { lot: e.target.value })} placeholder="Лот" className={cn(cellInput, 'w-24')} /> },
      { key: 'unit', header: 'Ед. измер.', cell: (it) => <select value={it.unit} onChange={(e) => updateItem(it.id, { unit: e.target.value })} className={cellInput}>{UNITS.map((u) => <option key={u}>{u}</option>)}</select> },
      { key: 'qty', header: 'Кол-во', cell: (it) => <input value={it.qty || ''} onChange={(e) => updateItem(it.id, { qty: num(e.target.value) })} className={cn(cellInput, 'w-14 text-right')} /> },
      { key: 'price', header: 'Цена', cell: (it) => <input value={it.price || ''} onChange={(e) => updateItem(it.id, { price: num(e.target.value) })} className={cn(cellInput, 'w-24 text-right')} /> },
      { key: 'excise', header: 'Акциз сумма', show: showExcise, cell: (it) => <input value={it.excise || ''} onChange={(e) => updateItem(it.id, { excise: num(e.target.value) })} placeholder="0" className={cn(cellInput, 'w-24 text-right')} /> },
      { key: 'lgota', header: 'Код льготы', show: showLgota, cls: 'text-right', cell: (it) => <input value={it.lgota} onChange={(e) => updateItem(it.id, { lgota: e.target.value })} placeholder="Код" className={cn(cellInput, 'w-24')} /> },
      { key: 'supply', header: 'Стоимость поставки', cls: 'text-right text-zinc-700', cell: (it) => money(rowSupply(it)) },
      { key: 'vat', header: 'НДС, %', cell: (it) => <select value={it.vat} onChange={(e) => updateItem(it.id, { vat: Number(e.target.value) })} className={cellInput}>{VAT_RATES.map((r) => <option key={r} value={r}>{r}%</option>)}</select> },
      { key: 'vatsum', header: 'НДС сумма', cls: 'text-right text-zinc-700', cell: (it) => money(rowVat(it)) },
      { key: 'total', header: '* Всего', cls: 'text-right font-medium text-zinc-900', cell: (it) => money(rowTotal(it)) },
      { key: 'actions', header: '', cls: 'text-center', cell: (it) => (
        <button onClick={() => removeItem(it.id)} className="flex size-7 items-center justify-center rounded-md border border-gray-200 text-red-500 transition hover:bg-red-50" aria-label="Удалить">
          <Trash2 className="size-4" />
        </button>
      ) },
    ] as Col[]
  ).filter((c) => c.show !== false)
  const supplyIdx = cols.findIndex((c) => c.key === 'supply')

  return (
    <div className="flex flex-col gap-4">
      {/* Type + header */}
      <div className="rounded-md border border-gray-200 bg-white shadow-[0px_4px_12px_0px_rgba(0,0,0,0.08)]">
        <div className="flex items-center gap-4 border-b border-black/10 px-6 py-4">
          <span className="text-lg font-semibold text-black/80">Тип документа:</span>
          <PillSelect options={[...DOC_TYPES]} value={docType} onChange={setDocType} />
          <PillSelect options={VARIANTS} value={variant} onChange={setVariant} />
        </div>
        <div className="grid grid-cols-1 gap-4 p-6 lg:grid-cols-3">
          <div className="flex flex-col gap-4">
            <input className={field} placeholder="Номер счет-фактуры" />
            <input className={field} placeholder="Номер контракта" />
          </div>
          <div className="flex flex-col gap-4">
            <input type="date" className={field} placeholder="Дата документа" />
            <input type="date" className={field} placeholder="Дата контракта" />
          </div>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3.5 top-3 size-5 text-gray-400" />
            <input className={cn(field, 'pl-10')} placeholder="ID договора" />
          </div>
        </div>
      </div>

      {/* Details columns */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="flex flex-col gap-4">
          <Card title="Ваши сведения">
            <label className="flex flex-col rounded-md border border-gray-300 px-3.5 py-1.5">
              <span className="text-xs text-gray-500">ИНН / ПИНФЛ</span>
              <input defaultValue="123456789" className="bg-transparent text-sm text-zinc-700 outline-none" />
            </label>
            <div className="rounded-lg border border-Smart-green px-3.5 py-2.5 text-sm text-slate-700">
              Статус: Плательщик НДС (сертификат временно неактивный)
            </div>
            <div className="flex items-center gap-6">
              <CheckBox checked={yourFlags.komissioner} onChange={() => setYourFlags((f) => ({ ...f, komissioner: !f.komissioner }))}>
                Комиссионер
              </CheckBox>
              <CheckBox checked={yourFlags.lgota} onChange={() => setYourFlags((f) => ({ ...f, lgota: !f.lgota }))}>
                Есть льгота
              </CheckBox>
              <CheckBox checked={yourFlags.akciz} onChange={() => setYourFlags((f) => ({ ...f, akciz: !f.akciz }))}>
                Акциз
              </CheckBox>
            </div>
            <div className="relative">
              <input className={field} placeholder="Название" />
              <ChevronDown className="pointer-events-none absolute right-3 top-3 size-5 text-gray-400" />
            </div>
            <button className="flex items-center justify-center gap-2 rounded-md bg-slate-50 px-4 py-2.5 text-sm font-medium text-zinc-700 transition hover:bg-slate-100">
              Детали <ChevronDown className="size-4" />
            </button>
          </Card>

          {yourFlags.komissioner && (
            <Card title="Посредник (Комиссионер)">
              <div className="flex items-stretch">
                <input className={cn(field, 'rounded-r-none')} placeholder="ИНН / ПИНФЛ посредника" />
                <button className="flex items-center justify-center rounded-r-lg bg-Smart-blue px-3.5 text-white">
                  <Search className="size-5" />
                </button>
              </div>
              <input className={field} placeholder="Наименование посредника" />
              <input className={field} placeholder="Номер договора комиссии" />
            </Card>
          )}

          <Card title="Доверенность">
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <input className={field} placeholder="Тип" />
                <ChevronDown className="pointer-events-none absolute right-3 top-3 size-5 text-gray-400" />
              </div>
              <input className={field} placeholder="Номер" />
              <input className={field} placeholder="ПИНФЛ доверенного лица" />
              <input className={field} placeholder="ФИО отв. лицо" />
            </div>
          </Card>
        </div>

        <Card title="Сведения партнера">
          <div className="flex items-stretch">
            <input className={cn(field, 'rounded-r-none')} placeholder="ИНН / ПИНФЛ" />
            <button className="flex items-center justify-center rounded-r-lg bg-Smart-blue px-3.5 text-white">
              <Search className="size-5" />
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <CheckBox checked={partnerFlags.odnostoronniy} onChange={() => setPartnerFlags((f) => ({ ...f, odnostoronniy: !f.odnostoronniy }))}>
              Односторонний документ
            </CheckBox>
            <CheckBox checked={partnerFlags.poruchitel} onChange={() => setPartnerFlags((f) => ({ ...f, poruchitel: !f.poruchitel }))}>
              Поручитель
            </CheckBox>
            <CheckBox checked={partnerFlags.lot} onChange={() => setPartnerFlags((f) => ({ ...f, lot: !f.lot }))}>
              Лот присутствует
            </CheckBox>
          </div>
          <input className={field} placeholder="Название" />
          <input className={field} placeholder="Регистрационный код плательщика НДС" />
          <div className="flex gap-3">
            <input className={field} placeholder="Коэффициент разрыва при уплате НДС (по всей цепочке)" />
            <input className="w-20 rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-Smart-blue" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <input className={field} placeholder="Расчетный счет" />
            <input className={field} placeholder="МФО, SWIFT и др." />
            <input className={field} placeholder="Директор" />
            <input className={field} placeholder="Глав. бух." />
          </div>
          <input className={field} placeholder="Адрес" />
        </Card>
      </div>

      {/* Line items */}
      <div className="rounded-md border border-gray-200 bg-white">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 px-6 py-4">
          <div className="flex flex-wrap items-center gap-6">
            {[
              ['reverse', 'Обратный расчет'],
              ['excise', 'Акциз'],
              ['marked', 'Товар маркирован'],
              ['manual', 'Ручное вычесление'],
              ['farm', 'ФАРМ'],
            ].map(([key, label]) => {
              const checked = flags[key as keyof typeof flags]
              return (
                <label key={key} className="flex cursor-pointer items-center gap-2 text-sm text-gray-500">
                  <span
                    onClick={() => setFlags((f) => ({ ...f, [key]: !checked }))}
                    className={cn(
                      'flex size-4 items-center justify-center rounded-sm border',
                      checked ? 'border-Smart-green bg-gray-50 text-Smart-green' : 'border-gray-300 bg-gray-50',
                    )}
                  >
                    {checked && <Check className="size-3" strokeWidth={3} />}
                  </span>
                  {label}
                </label>
              )
            })}
          </div>
          <button
            onClick={() => setItems((prev) => [...prev, emptyItem()])}
            className="flex items-center gap-2 rounded-md bg-blue-800 px-3 py-1.5 text-sm font-medium text-white transition hover:brightness-110"
          >
            <Plus className="size-5" />
            Добавить
          </button>
        </div>

        <div className="overflow-x-auto p-4">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-white">
                {cols.map((c) => (
                  <th key={c.key} className="border-b border-r border-gray-200 px-3 py-3 text-left text-sm font-semibold text-zinc-900 last:border-r-0">
                    {c.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((it, idx) => (
                <tr key={it.id}>
                  {cols.map((c) => (
                    <td key={c.key} className={cn(cellCls, c.cls)}>
                      {c.cell(it, idx)}
                    </td>
                  ))}
                </tr>
              ))}
              <tr>
                <td colSpan={supplyIdx} className="px-3 py-3 text-right text-sm font-semibold text-slate-700">Итого:</td>
                <td className="px-3 py-3 text-right text-sm font-semibold text-slate-800">{money(totalSupply)}</td>
                <td colSpan={cols.length - supplyIdx - 1} />
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Grand total */}
      <div className="text-lg font-bold text-slate-800">Итого: {money(grandTotal)}</div>

      {/* Actions */}
      <div className="flex items-center justify-center gap-3 pt-2">
        <button className="flex items-center gap-2 rounded-lg bg-Smart-blue px-6 py-2.5 text-sm font-semibold text-white transition hover:brightness-105">
          <Save className="size-5" />
          Сохранить
          <ChevronDown className="size-4" />
        </button>
        <button
          onClick={() => navigate('/documents/outgoing')}
          className="flex items-center gap-2 rounded-lg bg-Smart-green px-6 py-2.5 text-sm font-semibold text-white transition hover:brightness-105"
        >
          <Check className="size-5" />
          Подписать
        </button>
      </div>
    </div>
  )
}
