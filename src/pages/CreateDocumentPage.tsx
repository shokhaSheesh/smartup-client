import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, ChevronDown, Plus, Trash2, Check, ArrowUpRight } from 'lucide-react'
import { PillSelect } from '@/components/ui/PillSelect'
import { DOC_TYPES } from '@/data/docTypes'
import { cn } from '@/lib/cn'

const VARIANTS = ['Стандартный', 'Дополнительный', 'Исправленный']
const UNITS = ['Штук', 'кг', 'литр', 'метр', 'услуга']
const VAT_RATES = [0, 12, 15]
const LOT_TYPES = ['Лот тип 1', 'Лот тип 2', 'Лот тип 3']

type LineItem = {
  id: number
  ikpu: string
  description: string
  barcode: string
  marking: string
  unit: string
  qty: number
  price: number
  exciseRate: number
  vat: number
  lgota: string
  warehouse: string
}

let nextId = 2
function emptyItem(): LineItem {
  return { id: nextId++, ikpu: '', description: '', barcode: '', marking: '', unit: 'Штук', qty: 0, price: 0, exciseRate: 0, vat: 12, lgota: '', warehouse: '' }
}

const field =
  'w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none placeholder:text-gray-400 focus:border-Smart-blue'
const cellInput = 'bg-transparent outline-none'

/** Floating-label field (matches Didox's filled look). */
function Fld({ label, value, required, dropdown, date }: { label: string; value?: string; required?: boolean; dropdown?: boolean; date?: boolean }) {
  return (
    <div className="relative flex flex-col rounded-lg border border-gray-300 bg-white px-3.5 py-1.5">
      <span className="text-xs text-gray-500">
        {required && <span className="text-red-500">*</span>}
        {label}
      </span>
      <input defaultValue={value} type={date ? 'date' : 'text'} className="w-full bg-transparent text-sm text-slate-800 outline-none" />
      {dropdown && <ChevronDown className="pointer-events-none absolute right-3 top-4 size-4 text-gray-400" />}
    </div>
  )
}

function CheckBox({ checked, onChange, children }: { checked: boolean; onChange: () => void; children: React.ReactNode }) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600" onClick={onChange}>
      <span className={cn('flex size-4 items-center justify-center rounded-full border', checked ? 'border-Smart-blue bg-Smart-blue text-white' : 'border-gray-300 bg-white')}>
        {checked && <Check className="size-3" strokeWidth={3} />}
      </span>
      {children}
    </label>
  )
}

function Card({ title, extra, children }: { title: string; extra?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-4 rounded-md bg-white p-6 shadow-[0px_1px_2px_0px_rgba(16,24,40,0.06)]">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
        {extra}
      </div>
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

/** Organization details block, reused for your org and the partner's. */
function OrgFields({ own }: { own: boolean }) {
  return (
    <>
      <Fld label="Наименование" required value={own ? '"UDEVS" MCHJ' : undefined} />
      <Fld label="Регистрационный код плательщика НДС" value={own ? '326090125584' : undefined} />
      <div className="grid grid-cols-2 gap-4">
        <Fld label="Расчётный счёт" dropdown value={own ? '20208000505191969001' : undefined} />
        <Fld label="МФО, SWIFT и др." dropdown value={own ? '01095' : undefined} />
      </div>
      <Fld label="Наименование банка" value={own ? 'ТОШКЕНТ Ш., "ASIA ALLIANCE BANK" АТ БАНКИ' : undefined} />
      <Fld label="Адрес" required value={own ? 'ТОШКЕНТ ШАҲАР ОЛМАЗОР ТУМАНИ Yangi Olmazor ko\'chasi' : undefined} />
      <div className="grid grid-cols-2 gap-4">
        <Fld label="Директор" value={own ? 'BAXODIROV AZIZBEK' : undefined} />
        <Fld label="Глав. бух." />
      </div>
    </>
  )
}

export default function CreateDocumentPage() {
  const navigate = useNavigate()
  const [docType, setDocType] = useState<string>('Счет-фактура без акта')
  const [variant, setVariant] = useState(VARIANTS[0])

  const [yourFlags, setYourFlags] = useState({ komissioner: false, lgota: false, akciz: false })
  const [cpFlags, setCpFlags] = useState({ odnostoronniy: false, lot: false })
  const [itemFlags, setItemFlags] = useState({ reverse: false, excise: false, marked: false, manual: false })

  const [items, setItems] = useState<LineItem[]>([emptyItem()])

  const showExcise = itemFlags.excise || yourFlags.akciz
  const showMarking = itemFlags.marked
  const showLgota = yourFlags.lgota

  function updateItem(id: number, patch: Partial<LineItem>) {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, ...patch } : it)))
  }
  function removeItem(id: number) {
    setItems((prev) => prev.filter((it) => it.id !== id))
  }

  const rowSupply = (it: LineItem) => it.qty * it.price
  const rowExcise = (it: LineItem) => (rowSupply(it) * it.exciseRate) / 100
  const rowVat = (it: LineItem) => (rowSupply(it) * it.vat) / 100
  const rowTotal = (it: LineItem) => rowSupply(it) + rowExcise(it) + rowVat(it)
  const totalSupply = items.reduce((s, it) => s + rowSupply(it), 0)
  const grandTotal = items.reduce((s, it) => s + rowTotal(it), 0)

  const cellCls = 'border-b border-r border-gray-200 px-3 py-2 text-sm'

  type Col = { key: string; header: string; show?: boolean; cls?: string; cell: (it: LineItem, i: number) => React.ReactNode }
  const cols: Col[] = (
    [
      { key: 'num', header: '№', cls: 'text-center text-zinc-700', cell: (_it, i) => i + 1 },
      { key: 'ikpu', header: 'ИКПУ и наименование товара/услуги *', cell: (it) => <input value={it.ikpu} onChange={(e) => updateItem(it.id, { ikpu: e.target.value })} placeholder="ИКПУ" className={cn(cellInput, 'w-56')} /> },
      { key: 'description', header: 'Описание товара/услуги *', cell: (it) => <input value={it.description} onChange={(e) => updateItem(it.id, { description: e.target.value })} placeholder="Описание" className={cn(cellInput, 'w-40')} /> },
      { key: 'barcode', header: 'Штрих код', cell: (it) => <input value={it.barcode} onChange={(e) => updateItem(it.id, { barcode: e.target.value })} placeholder="—" className={cn(cellInput, 'w-28')} /> },
      { key: 'marking', header: 'Маркировка', show: showMarking, cell: (it) => <input value={it.marking} onChange={(e) => updateItem(it.id, { marking: e.target.value })} placeholder="KIZ" className={cn(cellInput, 'w-32')} /> },
      { key: 'unit', header: 'Ед. изм. *', cell: (it) => <select value={it.unit} onChange={(e) => updateItem(it.id, { unit: e.target.value })} className={cellInput}>{UNITS.map((u) => <option key={u}>{u}</option>)}</select> },
      { key: 'qty', header: 'Кол-во', cell: (it) => <input value={it.qty || ''} onChange={(e) => updateItem(it.id, { qty: num(e.target.value) })} className={cn(cellInput, 'w-14 text-right')} /> },
      { key: 'price', header: 'Цена *', cell: (it) => <input value={it.price || ''} onChange={(e) => updateItem(it.id, { price: num(e.target.value) })} className={cn(cellInput, 'w-24 text-right')} /> },
      { key: 'exciseRate', header: 'Акциз, %', show: showExcise, cell: (it) => <input value={it.exciseRate || ''} onChange={(e) => updateItem(it.id, { exciseRate: num(e.target.value) })} placeholder="0" className={cn(cellInput, 'w-16 text-right')} /> },
      { key: 'exciseSum', header: 'Акциз, сумма', show: showExcise, cls: 'text-right text-zinc-700', cell: (it) => money(rowExcise(it)) },
      { key: 'supply', header: 'Стоимость поставки *', cls: 'text-right text-zinc-700', cell: (it) => money(rowSupply(it)) },
      { key: 'vat', header: 'НДС, %', cell: (it) => <select value={it.vat} onChange={(e) => updateItem(it.id, { vat: Number(e.target.value) })} className={cellInput}>{VAT_RATES.map((r) => <option key={r} value={r}>{r}%</option>)}</select> },
      { key: 'vatsum', header: 'НДС, сумма *', cls: 'text-right text-zinc-700', cell: (it) => money(rowVat(it)) },
      { key: 'lgota', header: 'Код льготы', show: showLgota, cell: (it) => <input value={it.lgota} onChange={(e) => updateItem(it.id, { lgota: e.target.value })} placeholder="Код" className={cn(cellInput, 'w-24')} /> },
      { key: 'total', header: 'Всего *', cls: 'text-right font-medium text-zinc-900', cell: (it) => money(rowTotal(it)) },
      { key: 'warehouse', header: 'Склад', cell: (it) => <input value={it.warehouse} onChange={(e) => updateItem(it.id, { warehouse: e.target.value })} placeholder="—" className={cn(cellInput, 'w-24')} /> },
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
            <input className={field} placeholder="Номер счёт-фактуры *" />
            <input className={field} placeholder="Номер контракта *" />
          </div>
          <div className="flex flex-col gap-4">
            <input type="date" className={field} placeholder="Дата документа *" />
            <input type="date" className={field} placeholder="Дата контракта *" />
          </div>
          <div className="flex flex-col gap-4">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3.5 top-3 size-5 text-gray-400" />
              <input className={cn(field, 'pl-10')} placeholder="ID договора" />
            </div>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3.5 top-3 size-5 text-gray-400" />
              <input className={cn(field, 'pl-10')} placeholder="ТТН ИД" />
            </div>
          </div>
        </div>
      </div>

      {/* Two columns of sections */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* LEFT */}
        <div className="flex flex-col gap-4">
          <Card title="Ваши сведения">
            <Fld label="ИНН / ПИНФЛ" value="307205394" />
            <div className="rounded-lg border border-Smart-green px-3.5 py-2.5 text-sm text-slate-700">
              Статус: Плательщик НДС+ (сертификат активный)
            </div>
            <div className="flex flex-wrap items-center gap-6">
              <CheckBox checked={yourFlags.komissioner} onChange={() => setYourFlags((f) => ({ ...f, komissioner: !f.komissioner }))}>Комиссионер (Доверенное лицо)</CheckBox>
              <CheckBox checked={yourFlags.lgota} onChange={() => setYourFlags((f) => ({ ...f, lgota: !f.lgota }))}>Есть льгота</CheckBox>
              <CheckBox checked={yourFlags.akciz} onChange={() => setYourFlags((f) => ({ ...f, akciz: !f.akciz }))}>Акциз</CheckBox>
            </div>
          </Card>

          {yourFlags.komissioner && (
            <Card title="Посредник (Комиссионер)">
              <div className="flex items-stretch">
                <input className={cn(field, 'rounded-r-none')} placeholder="ИНН / ПИНФЛ посредника" />
                <button className="flex items-center justify-center rounded-r-lg bg-Smart-blue px-3.5 text-white"><Search className="size-5" /></button>
              </div>
              <input className={field} placeholder="Наименование посредника" />
            </Card>
          )}

          <Card title="Организация">
            <OrgFields own />
          </Card>

          <Card title="Товар отпустил">
            <div className="grid grid-cols-2 gap-4">
              <input className={field} placeholder="ИНН / ПИНФЛ" />
              <input className={field} placeholder="ФИО" />
            </div>
          </Card>
        </div>

        {/* RIGHT */}
        <div className="flex flex-col gap-4">
          <Card title="Сведения партнёра">
            <div className="flex items-stretch">
              <input className={cn(field, 'rounded-r-none')} placeholder={cpFlags.odnostoronniy ? 'ИНН / ПИНФЛ (необязательно)' : 'ИНН / ПИНФЛ *'} />
              <button className="flex items-center justify-center rounded-r-lg bg-Smart-blue px-3.5 text-white"><Search className="size-5" /></button>
            </div>
            <div className="flex flex-wrap items-center gap-6">
              <CheckBox checked={cpFlags.odnostoronniy} onChange={() => setCpFlags((f) => ({ ...f, odnostoronniy: !f.odnostoronniy }))}>Односторонний документ</CheckBox>
              <CheckBox checked={cpFlags.lot} onChange={() => setCpFlags((f) => ({ ...f, lot: !f.lot }))}>Лот присутствует</CheckBox>
            </div>
            {cpFlags.odnostoronniy && (
              <div className="rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-700">
                Односторонний документ — подпись контрагента не требуется.
              </div>
            )}
            {cpFlags.lot && (
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-stretch">
                  <input className={cn(field, 'rounded-r-none')} placeholder="Лот № *" />
                  <button className="flex items-center justify-center rounded-r-lg bg-Smart-blue px-3.5 text-white"><Search className="size-5" /></button>
                </div>
                <div className="relative">
                  <select className={cn(field, 'appearance-none pr-9 text-gray-500')} defaultValue="">
                    <option value="" disabled>Лот типы *</option>
                    {LOT_TYPES.map((t) => <option key={t}>{t}</option>)}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-3 size-5 text-gray-400" />
                </div>
              </div>
            )}
          </Card>

          <Card title="Предприятие партнёра">
            <OrgFields own={false} />
          </Card>
        </div>
      </div>

      {/* Line items */}
      <div className="rounded-md border border-gray-200 bg-white">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 px-6 py-4">
          <div className="flex flex-wrap items-center gap-6">
            {[
              ['reverse', 'Обратный расчёт'],
              ['excise', 'Акциз'],
              ['marked', 'Товар маркирован'],
              ['manual', 'Ручное вычисление'],
            ].map(([key, label]) => {
              const checked = itemFlags[key as keyof typeof itemFlags]
              return (
                <CheckBox key={key} checked={checked} onChange={() => setItemFlags((f) => ({ ...f, [key]: !checked }))}>
                  {label}
                </CheckBox>
              )
            })}
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-1.5 text-sm font-medium text-Smart-blue">
              ИКПУ коды <ArrowUpRight className="size-4" />
            </button>
            <button onClick={() => setItems((prev) => [...prev, emptyItem()])} className="flex items-center gap-2 rounded-md bg-blue-800 px-3 py-1.5 text-sm font-medium text-white transition hover:brightness-110">
              <Plus className="size-5" /> Добавить
            </button>
          </div>
        </div>

        <div className="overflow-x-auto p-4">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-white">
                {cols.map((c) => (
                  <th key={c.key} className="border-b border-r border-gray-200 px-3 py-3 text-left text-sm font-semibold text-zinc-900 last:border-r-0">{c.header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((it, idx) => (
                <tr key={it.id}>
                  {cols.map((c) => (
                    <td key={c.key} className={cn(cellCls, c.cls)}>{c.cell(it, idx)}</td>
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

      <div className="text-lg font-bold text-slate-800">Итого: {money(grandTotal)}</div>

      {/* Empowerment */}
      <Card title="Доверенность">
        <div className="relative">
          <select className={cn(field, 'appearance-none pr-9 text-gray-500')} defaultValue="">
            <option value="">Выберите доверенность</option>
            <option>Доверенность №1</option>
            <option>Доверенность №2</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-3 size-5 text-gray-400" />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <input className={field} placeholder="Номер доверенности" />
          <input type="date" className={field} placeholder="Дата доверенности" />
          <input className={field} placeholder="ПИНФЛ доверенного лица" />
          <input className={field} placeholder="ФИО ответственного лица" />
        </div>
      </Card>

      {/* Additional field */}
      <Card title="Дополнительное поле">
        <input className={cn(field, 'max-w-sm')} placeholder="Номер заказа" />
      </Card>

      {/* Bottom */}
      <div className="flex flex-col items-center gap-4 pt-2">
        <button className="text-sm font-semibold text-Smart-blue hover:underline">Показать документ</button>
        <label className="flex items-center gap-2 text-sm text-slate-600">
          <span className="flex size-4 items-center justify-center rounded-full border border-gray-300" />
          Счёт-фактура с актом
        </label>
        <div className="flex items-center gap-3">
          <button className="rounded-lg bg-Smart-blue px-6 py-2.5 text-sm font-semibold text-white transition hover:brightness-105">Сохранить</button>
          <button onClick={() => navigate('/documents/outgoing')} className="rounded-lg bg-Smart-green px-6 py-2.5 text-sm font-semibold text-white transition hover:brightness-105">Подписать</button>
          <button onClick={() => navigate(-1)} className="rounded-lg border border-red-300 px-6 py-2.5 text-sm font-semibold text-red-500 transition hover:bg-red-50">Отмена</button>
        </div>
      </div>
    </div>
  )
}
