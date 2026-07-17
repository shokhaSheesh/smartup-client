import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronDown, Plus, Minus, ArrowUpRight } from 'lucide-react'
import { PillSelect } from '@/components/ui/PillSelect'
import { DOC_TYPES } from '@/data/docTypes'
import { cn } from '@/lib/cn'

const UNITS = ['Штук', 'кг', 'тонна', 'литр', 'метр']
const STATIONS = ['Ташкент-Товарная', 'Чукурсай', 'Хамид Олимжон', 'Сергели']
const METHODS = ['Взвешивание', 'Обмер', 'По счёту', 'Расчётный']

const field =
  'w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none placeholder:text-gray-400 focus:border-Smart-blue'
const cellInput = 'bg-transparent outline-none'

function num(v: string): number {
  const n = Number(v.replace(/\s/g, '').replace(',', '.'))
  return Number.isFinite(n) ? n : 0
}
function money(n: number): string {
  return n.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function Radio({ checked, onChange, children }: { checked: boolean; onChange: () => void; children: React.ReactNode }) {
  return (
    <label className="flex cursor-pointer items-start gap-2 text-sm text-slate-600" onClick={onChange}>
      <span className={cn('mt-0.5 size-4 shrink-0 rounded-full border', checked ? 'border-Smart-blue bg-Smart-blue' : 'border-gray-300 bg-white')} />
      {children}
    </label>
  )
}

function Card({ children }: { children: React.ReactNode }) {
  return <div className="rounded-md bg-white p-6 shadow-[0px_1px_2px_0px_rgba(16,24,40,0.06)]">{children}</div>
}

function DateInput({ placeholder }: { placeholder: string }) {
  return <input type="date" className={field} placeholder={placeholder} />
}

function Select({ placeholder, options }: { placeholder: string; options: string[] }) {
  return (
    <div className="relative">
      <select defaultValue="" className={cn(field, 'appearance-none pr-9 text-gray-500')}>
        <option value="" disabled>{placeholder}</option>
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-3 size-5 text-gray-400" />
    </div>
  )
}

type TtnItem = {
  id: number
  ikpu: string
  name: string
  unit: string
  unitPrice: number
  qty: number
  autoCost: number
  docs: string
  method: string
  cargoClass: string
  gross: number
  net: number
}
let nextId = 2
function emptyItem(): TtnItem {
  return { id: nextId++, ikpu: '', name: '', unit: 'Штук', unitPrice: 0, qty: 0, autoCost: 0, docs: '', method: '', cargoClass: '', gross: 0, net: 0 }
}

export default function TtnForm({ docType, onDocType }: { docType: string; onDocType: (v: string) => void }) {
  const navigate = useNavigate()
  const [shipment, setShipment] = useState<'warehouse' | 'seller'>('seller')
  const [transport, setTransport] = useState<'auto' | 'rail'>('auto')
  const [trailer, setTrailer] = useState<'trailer' | 'semi' | null>(null)
  const [summary, setSummary] = useState(false)
  const [items, setItems] = useState<TtnItem[]>([emptyItem()])

  const isAuto = transport === 'auto'

  function updateItem(id: number, patch: Partial<TtnItem>) {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, ...patch } : it)))
  }
  const rowTotal = (it: TtnItem) => it.unitPrice * it.qty
  const totalCargo = items.reduce((s, it) => s + rowTotal(it), 0)
  const totalAuto = items.reduce((s, it) => s + it.autoCost, 0)
  const totalGross = items.reduce((s, it) => s + it.gross, 0)
  const totalNet = items.reduce((s, it) => s + it.net, 0)

  const cellCls = 'border-b border-r border-gray-200 px-3 py-2 text-sm'
  const headers = [
    '№', 'Идентификационный код и название товаров (услуг)', 'Наименование товаров *', 'Ед. измер. *',
    'Стоимость за единицу товара', 'Кол-во', 'Общая стоимость груза', 'Стоимость автоперевозки',
    'С грузом следуют документы', 'Способ определения груза', 'Класс груза', 'Масса брутто, тн', 'Масса нетто, тн', '',
  ]

  return (
    <div className="flex flex-col gap-4">
      {/* Type header */}
      <Card>
        <div className="mb-6 flex items-center gap-4">
          <span className="text-lg font-semibold text-black/80">Тип документа:</span>
          <PillSelect options={[...DOC_TYPES]} value={docType} onChange={onDocType} />
        </div>

        <div className="grid grid-cols-2 gap-4 sm:max-w-md">
          <input className={field} placeholder="ТТН № *" />
          <DateInput placeholder="От *" />
        </div>

        {/* Тип перевозки */}
        <h3 className="mt-6 text-base font-semibold text-slate-800">Тип перевозки</h3>
        <div className="mt-3 flex items-center gap-8">
          <Radio checked={shipment === 'warehouse'} onChange={() => setShipment('warehouse')}>Со склада на склад</Radio>
          <Radio checked={shipment === 'seller'} onChange={() => setShipment('seller')}>От продавца к покупателю</Radio>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4 sm:max-w-md">
          <input className={field} placeholder="К договору № *" />
          <DateInput placeholder="От *" />
          <input className={field} placeholder="К путевому листу №" />
          <DateInput placeholder="От *" />
        </div>

        {/* Тип транспорта */}
        <h3 className="mt-6 text-base font-semibold text-slate-800">Тип транспорта</h3>
        <div className="mt-3 flex items-center gap-8">
          <Radio checked={isAuto} onChange={() => setTransport('auto')}>Перевозка автомобильным транспортом</Radio>
          <Radio checked={!isAuto} onChange={() => setTransport('rail')}>Перевозка по железной дороге</Radio>
        </div>

        {isAuto ? (
          <div className="mt-4 flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4 sm:max-w-md">
              <input className={field} placeholder="Гос. номер авто" />
              <input className={field} placeholder="Модель" />
              <input className={field} placeholder="Гос. номер" />
              <input className={field} placeholder="Модель" />
            </div>
            <div className="flex items-center gap-8">
              <Radio checked={trailer === 'trailer'} onChange={() => setTrailer(trailer === 'trailer' ? null : 'trailer')}>Прицеп</Radio>
              <Radio checked={trailer === 'semi'} onChange={() => setTrailer(trailer === 'semi' ? null : 'semi')}>Полуприцеп</Radio>
            </div>
            <div className="flex items-center gap-6">
              <input className={cn(field, 'sm:max-w-xs')} placeholder="ФИО водителя" />
              <Radio checked={summary} onChange={() => setSummary(!summary)}>Сводная на всю смену</Radio>
            </div>
            {summary && <input className={cn(field, 'sm:max-w-xs')} placeholder="Количество ездок" />}
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-2 gap-4 sm:max-w-md">
            <input className={field} placeholder="Номер вагона" />
            <input className={field} placeholder="Тип вагона" />
          </div>
        )}
      </Card>

      {/* Заказчик / Грузоотправитель */}
      <Card>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-semibold text-slate-800">Заказчик</h3>
            <input className={field} placeholder="ИНН/ПИНФЛ *" />
            <input className={field} placeholder="Название *" />
            <input className={field} placeholder="ИНН/ПИНФЛ *" />
            <input className={field} placeholder="Грузоотправитель" />
            {isAuto ? (
              <>
                <input className={field} placeholder="Пункт погрузки 1" />
                <input className={field} placeholder="Пункт погрузки 2" />
              </>
            ) : (
              <>
                <Select placeholder="Загрузочная станция 1" options={STATIONS} />
                <Select placeholder="Загрузочная станция 2" options={STATIONS} />
              </>
            )}
            <input className={field} placeholder="Переадресовка" />
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-semibold text-slate-800">Грузоотправитель/Перевозчик</h3>
            <input className={field} defaultValue="307205394" placeholder="ИНН/ПИНФЛ" />
            <input className={field} defaultValue='"UDEVS" MCHJ' placeholder="Название *" />
            <input className={field} placeholder="ИНН/ПИНФЛ *" />
            <input className={field} placeholder="Грузополучатель" />
            {isAuto ? (
              <>
                <input className={field} placeholder="Пункт разгрузки 1" />
                <input className={field} placeholder="Пункт разгрузки 2" />
              </>
            ) : (
              <>
                <Select placeholder="Разгрузочная станция 1" options={STATIONS} />
                <Select placeholder="Разгрузочная станция 2" options={STATIONS} />
              </>
            )}
            <input className={field} placeholder="Переадресовка" />
          </div>
        </div>
      </Card>

      {/* Особые отметки */}
      <Card>
        <input className={field} placeholder="Особые отметки" />
      </Card>

      {/* Сдал / Принял / расстояние */}
      <Card>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <input className={field} placeholder="Сдал" />
          <div className="flex flex-col gap-4">
            <input className={field} placeholder="Сдал вод./эксп" />
            <input className={field} placeholder="Принял" />
            <div className="grid grid-cols-2 gap-4">
              <input className={field} placeholder="Расстояние всего" />
              <input className={field} placeholder="Расстояние в городе" />
            </div>
          </div>
        </div>
      </Card>

      {/* Items */}
      <div className="rounded-md border border-gray-200 bg-white">
        <div className="flex items-center justify-end border-b border-gray-200 px-6 py-3">
          <button className="flex items-center gap-1.5 text-sm font-medium text-Smart-blue">Коды ИКПУ <ArrowUpRight className="size-4" /></button>
        </div>
        <div className="overflow-x-auto p-4">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                {headers.map((h, i) => (
                  <th key={i} className="border-b border-r border-gray-200 px-3 py-3 text-left align-top text-sm font-semibold text-zinc-900 last:border-r-0">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((it, idx) => (
                <tr key={it.id}>
                  <td className={cn(cellCls, 'text-center text-zinc-700')}>{idx + 1}</td>
                  <td className={cellCls}><input value={it.ikpu} onChange={(e) => updateItem(it.id, { ikpu: e.target.value })} placeholder="ИКПУ" className={cn(cellInput, 'w-48')} /></td>
                  <td className={cellCls}><input value={it.name} onChange={(e) => updateItem(it.id, { name: e.target.value })} placeholder="Наименование" className={cn(cellInput, 'w-40')} /></td>
                  <td className={cellCls}><select value={it.unit} onChange={(e) => updateItem(it.id, { unit: e.target.value })} className={cellInput}>{UNITS.map((u) => <option key={u}>{u}</option>)}</select></td>
                  <td className={cellCls}><input value={it.unitPrice || ''} onChange={(e) => updateItem(it.id, { unitPrice: num(e.target.value) })} className={cn(cellInput, 'w-24 text-right')} /></td>
                  <td className={cellCls}><input value={it.qty || ''} onChange={(e) => updateItem(it.id, { qty: num(e.target.value) })} className={cn(cellInput, 'w-14 text-right')} /></td>
                  <td className={cn(cellCls, 'text-right text-zinc-700')}>{money(rowTotal(it))}</td>
                  <td className={cellCls}><input value={it.autoCost || ''} onChange={(e) => updateItem(it.id, { autoCost: num(e.target.value) })} className={cn(cellInput, 'w-24 text-right')} /></td>
                  <td className={cellCls}><input value={it.docs} onChange={(e) => updateItem(it.id, { docs: e.target.value })} placeholder="—" className={cn(cellInput, 'w-28')} /></td>
                  <td className={cellCls}><select value={it.method} onChange={(e) => updateItem(it.id, { method: e.target.value })} className={cn(cellInput, 'w-32', !it.method && 'text-gray-400')}><option value="">Выберите</option>{METHODS.map((m) => <option key={m}>{m}</option>)}</select></td>
                  <td className={cellCls}><input value={it.cargoClass} onChange={(e) => updateItem(it.id, { cargoClass: e.target.value })} placeholder="—" className={cn(cellInput, 'w-20')} /></td>
                  <td className={cellCls}><input value={it.gross || ''} onChange={(e) => updateItem(it.id, { gross: num(e.target.value) })} className={cn(cellInput, 'w-20 text-right')} /></td>
                  <td className={cellCls}><input value={it.net || ''} onChange={(e) => updateItem(it.id, { net: num(e.target.value) })} className={cn(cellInput, 'w-20 text-right')} /></td>
                  <td className={cn(cellCls, 'text-center')}>
                    <div className="flex items-center justify-center gap-1">
                      <button onClick={() => setItems((p) => p.filter((x) => x.id !== it.id))} className="flex size-7 items-center justify-center rounded-full border border-red-200 text-red-500 hover:bg-red-50"><Minus className="size-4" /></button>
                      <button onClick={() => setItems((p) => [...p, emptyItem()])} className="flex size-7 items-center justify-center rounded-full border border-green-200 text-Smart-green hover:bg-green-50"><Plus className="size-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              <tr className="font-semibold text-slate-800">
                <td colSpan={6} className="px-3 py-3 text-right text-sm">Итого:</td>
                <td className="px-3 py-3 text-right text-sm">{money(totalCargo)}</td>
                <td className="px-3 py-3 text-right text-sm">{money(totalAuto)}</td>
                <td colSpan={3} />
                <td className="px-3 py-3 text-right text-sm">{money(totalGross)}</td>
                <td className="px-3 py-3 text-right text-sm">{money(totalNet)}</td>
                <td />
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="text-lg font-bold text-slate-800">Итого: {money(totalCargo)}</div>

      {/* Bottom */}
      <div className="flex flex-col items-center gap-4 pt-2">
        <button className="text-sm font-semibold text-Smart-blue hover:underline">Показать документ</button>
        <div className="flex items-center gap-3">
          <button className="rounded-lg bg-Smart-blue px-6 py-2.5 text-sm font-semibold text-white transition hover:brightness-105">Сохранить</button>
          <button onClick={() => navigate('/documents/outgoing')} className="rounded-lg bg-Smart-green px-6 py-2.5 text-sm font-semibold text-white transition hover:brightness-105">Подписать</button>
          <button onClick={() => navigate(-1)} className="rounded-lg border border-red-300 px-6 py-2.5 text-sm font-semibold text-red-500 transition hover:bg-red-50">Отмена</button>
        </div>
      </div>
    </div>
  )
}
