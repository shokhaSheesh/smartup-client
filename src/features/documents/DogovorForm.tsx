import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronDown, Plus, Trash2 } from 'lucide-react'
import { PillSelect } from '@/components/ui/PillSelect'
import { DOC_TYPES } from '@/data/docTypes'
import { cn } from '@/lib/cn'

const UNITS = ['штук', 'кг', 'литр', 'метр', 'услуга']
const VAT_RATES = [-1, 0, 12, 15]
const vatLabel = (r: number) => (r < 0 ? 'Без НДС' : `${r}%`)
const cellInput = 'bg-transparent outline-none'
function num(v: string): number {
  const n = Number(v.replace(/\s/g, '').replace(',', '.'))
  return Number.isFinite(n) ? n : 0
}
function money(n: number): string {
  return n.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function LF({ label, required, value, dropdown, date }: { label: string; required?: boolean; value?: string; dropdown?: boolean; date?: boolean }) {
  const [v, setV] = useState(value ?? '')
  return (
    <div className="relative flex flex-col rounded-lg border border-gray-300 bg-white px-3.5 py-1.5">
      <span className="text-xs text-gray-500">{label}{required && <span className="text-red-500"> *</span>}</span>
      <input value={v} onChange={(e) => setV(e.target.value)} type={date ? 'date' : 'text'} className="w-full bg-transparent text-sm text-slate-800 outline-none" />
      {dropdown && <ChevronDown className="pointer-events-none absolute right-3 top-4 size-4 text-gray-400" />}
    </div>
  )
}

function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('rounded-md bg-white p-6 shadow-[0px_1px_2px_0px_rgba(16,24,40,0.06)]', className)}>{children}</div>
}

/** Party details column — identity, physical person, bank, contacts. */
function Party({ own }: { own: boolean }) {
  return (
    <div className="flex flex-col gap-3">
      <LF label="ИНН/ПИНФЛ" required value={own ? '307205394' : undefined} />
      <LF label="Название" required value={own ? '"UDEVS" MCHJ' : undefined} />
      <div className="grid grid-cols-2 gap-3">
        <LF label="ПИНФЛ физ. лица" required value={own ? '31107950530099' : undefined} />
        <LF label="ФИО" required value={own ? 'BAXODIROV AZIZBEK ULUG\'BEK' : undefined} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <LF label="МФО" dropdown value={own ? '01095' : undefined} />
        <LF label="Название банка" value={own ? 'ТОШКЕНТ Ш., "ASIA ALLIANCE BANK" АТ БАНКИ' : undefined} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <LF label="ОКЭД" value={own ? '62090' : undefined} />
        <LF label="Расчетный счет" dropdown value={own ? '20208000505191969001' : undefined} />
      </div>
      <LF label="Адрес" value={own ? 'ТОШКЕНТ ШАҲАР ОЛМАЗОР ТУМАНИ Yangi Olmazor ko\'chasi' : undefined} />
      <div className="grid grid-cols-2 gap-3">
        <LF label="Телефон" value={own ? '998338380110' : undefined} />
        <LF label="Номер мобильного телефона" value={own ? '998338380110' : undefined} />
      </div>
    </div>
  )
}

type Item = { id: number; name: string; ikpu: string; barcode: string; unit: string; qty: number; price: number; vat: number }
let nextId = 2
const emptyItem = (): Item => ({ id: nextId++, name: '', ikpu: '', barcode: '', unit: 'штук', qty: 0, price: 0, vat: -1 })

type Section = { id: number; title: string; text: string }
let nextSec = 2
const emptySection = (): Section => ({ id: nextSec++, title: '', text: '' })

export default function DogovorForm({ docType, onDocType }: { docType: string; onDocType: (v: string) => void }) {
  const navigate = useNavigate()
  const [partners, setPartners] = useState<number[]>([1])
  const [items, setItems] = useState<Item[]>([emptyItem()])
  const [sections, setSections] = useState<Section[]>([{ id: 1, title: '', text: '' }])

  function updateItem(id: number, patch: Partial<Item>) {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, ...patch } : it)))
  }
  const rowSupply = (it: Item) => it.qty * it.price
  const rowVat = (it: Item) => (it.vat > 0 ? (rowSupply(it) * it.vat) / 100 : 0)
  const rowTotal = (it: Item) => rowSupply(it) + rowVat(it)
  const totalSupply = items.reduce((s, it) => s + rowSupply(it), 0)
  const totalVat = items.reduce((s, it) => s + rowVat(it), 0)
  const totalAll = items.reduce((s, it) => s + rowTotal(it), 0)

  const cellCls = 'border-b border-r border-gray-200 px-3 py-2 text-sm'
  const th = 'border-b border-r border-gray-200 px-2 py-3 text-center align-middle text-xs font-semibold text-zinc-900 last:border-r-0'

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <Card>
        <div className="mb-6 flex items-center gap-4">
          <span className="text-lg font-semibold text-black/80">Тип документа:</span>
          <PillSelect options={[...DOC_TYPES]} value={docType} onChange={onDocType} />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:max-w-4xl">
          <LF label="Наименование" required />
          <LF label="Номер контракта" required />
          <LF label="Место заключения" required />
          <LF label="Дата заключения" required date />
          <LF label="Действителен до" required date />
        </div>
      </Card>

      {/* Parties */}
      <Card>
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 lg:grid-cols-2">
          <div><h4 className="mb-3 text-lg font-semibold text-slate-800">Ваши сведения</h4><Party own /></div>
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h4 className="text-lg font-semibold text-slate-800">Сведения о партнере</h4>
              <button onClick={() => setPartners((p) => [...p, (p.at(-1) ?? 0) + 1])} className="flex size-8 items-center justify-center rounded-md border border-gray-200 text-slate-500 hover:bg-gray-50"><Plus className="size-4" /></button>
            </div>
            <div className="flex flex-col gap-6">
              {partners.map((pid, i) => (
                <div key={pid} className="relative">
                  {i > 0 && <button onClick={() => setPartners((p) => p.filter((x) => x !== pid))} className="absolute -top-3 right-0 flex size-7 items-center justify-center rounded-md border border-gray-200 text-red-500 hover:bg-red-50"><Trash2 className="size-4" /></button>}
                  <Party own={false} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Items */}
      <Card>
        <div className="mb-3 flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700"><input type="checkbox" className="size-4 accent-Smart-blue" />Обратный расчет</label>
          <button className="text-sm font-semibold text-Smart-blue hover:underline">Коды ИКПУ</button>
        </div>
        <div className="overflow-x-auto rounded-md border border-gray-200">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-white">
                {['№', 'Наименование товаров (услуг) *', 'ИКПУ и наименование товаров', 'Штрих код товара/услуги', 'Ед. изм. *', 'Кол-во', 'Цена *', 'Стоимость поставки *', 'НДС, %', 'Сумма НДС *', 'Всего *', ''].map((h, i) => <th key={i} className={th}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {items.map((it, idx) => (
                <tr key={it.id}>
                  <td className={cn(cellCls, 'text-center text-zinc-700')}>{idx + 1}</td>
                  <td className={cellCls}><input value={it.name} onChange={(e) => updateItem(it.id, { name: e.target.value })} className={cn(cellInput, 'w-40')} /></td>
                  <td className={cellCls}><select value={it.ikpu} onChange={(e) => updateItem(it.id, { ikpu: e.target.value })} className={cn(cellInput, 'w-36')}><option value="">—</option><option>ИКПУ 001</option><option>ИКПУ 002</option></select></td>
                  <td className={cellCls}><input value={it.barcode} onChange={(e) => updateItem(it.id, { barcode: e.target.value })} className={cn(cellInput, 'w-24')} /></td>
                  <td className={cellCls}><select value={it.unit} onChange={(e) => updateItem(it.id, { unit: e.target.value })} className={cellInput}>{UNITS.map((u) => <option key={u}>{u}</option>)}</select></td>
                  <td className={cellCls}><input value={it.qty || ''} onChange={(e) => updateItem(it.id, { qty: num(e.target.value) })} className={cn(cellInput, 'w-14 text-right')} /></td>
                  <td className={cellCls}><input value={it.price || ''} onChange={(e) => updateItem(it.id, { price: num(e.target.value) })} className={cn(cellInput, 'w-20 text-right')} /></td>
                  <td className={cn(cellCls, 'text-right text-zinc-700')}>{money(rowSupply(it))}</td>
                  <td className={cellCls}><select value={it.vat} onChange={(e) => updateItem(it.id, { vat: Number(e.target.value) })} className={cellInput}>{VAT_RATES.map((r) => <option key={r} value={r}>{vatLabel(r)}</option>)}</select></td>
                  <td className={cn(cellCls, it.vat <= 0 && 'bg-gray-50', 'text-right text-zinc-700')}>{money(rowVat(it))}</td>
                  <td className={cn(cellCls, 'text-right font-medium text-zinc-900')}>{money(rowTotal(it))}</td>
                  <td className={cn(cellCls, 'text-center')}>
                    <div className="flex items-center justify-center gap-1">
                      <button onClick={() => setItems((p) => p.filter((x) => x.id !== it.id))} className="flex size-7 items-center justify-center rounded-md border border-gray-200 text-red-500 hover:bg-red-50"><Trash2 className="size-4" /></button>
                      <button onClick={() => setItems((p) => [...p, emptyItem()])} className="flex size-7 items-center justify-center rounded-md border border-green-200 text-Smart-green hover:bg-green-50"><Plus className="size-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              <tr className="bg-gray-50 font-semibold">
                <td colSpan={7} className="px-3 py-3 text-right text-sm text-slate-700">Итого:</td>
                <td className="border-r border-gray-200 px-3 py-3 text-right text-sm text-slate-800">{money(totalSupply)}</td>
                <td className="border-r border-gray-200" />
                <td className="border-r border-gray-200 px-3 py-3 text-right text-sm text-slate-800">{money(totalVat)}</td>
                <td className="border-r border-gray-200 px-3 py-3 text-right text-sm text-slate-800">{money(totalAll)}</td>
                <td />
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      {/* Содержание */}
      <Card>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-800">Содержание</h3>
          <button onClick={() => setSections((s) => [...s, emptySection()])} className="flex size-8 items-center justify-center rounded-md border border-gray-200 text-slate-500 hover:bg-gray-50"><Plus className="size-4" /></button>
        </div>
        <div className="flex flex-col gap-6">
          {sections.map((sec, i) => (
              <div key={sec.id} className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <div className="relative flex flex-1 flex-col rounded-lg border border-gray-300 bg-white px-3.5 py-1.5">
                    <span className="text-xs text-gray-500">Заголовок<span className="text-red-500"> *</span></span>
                    <input value={sec.title} onChange={(e) => setSections((p) => p.map((x) => (x.id === sec.id ? { ...x, title: e.target.value } : x)))} className="w-full bg-transparent text-sm text-slate-800 outline-none" />
                  </div>
                  {i > 0 && <button onClick={() => setSections((p) => p.filter((x) => x.id !== sec.id))} className="flex size-9 items-center justify-center rounded-md border border-gray-200 text-red-500 hover:bg-red-50"><Trash2 className="size-4" /></button>}
                </div>
                <div className="relative flex flex-col rounded-lg border border-gray-300 bg-white px-3.5 py-1.5">
                  <span className="text-xs text-gray-500">Текст<span className="text-red-500"> *</span></span>
                  <textarea value={sec.text} onChange={(e) => setSections((p) => p.map((x) => (x.id === sec.id ? { ...x, text: e.target.value } : x)))} rows={5} className="w-full resize-y bg-transparent text-sm text-slate-800 outline-none" />
                </div>
              </div>
          ))}
        </div>
      </Card>

      {/* Bottom */}
      <div className="flex flex-col items-center gap-4 pt-2">
        <button className="text-sm font-semibold text-Smart-blue hover:underline">Показать документ</button>
        <div className="flex items-center gap-3">
          <button className="rounded-lg bg-Smart-green px-6 py-2.5 text-sm font-semibold text-white transition hover:brightness-105">Сохранить шаблон</button>
          <button className="rounded-lg border border-Smart-blue px-6 py-2.5 text-sm font-semibold text-Smart-blue transition hover:bg-blue-50">Сохранить</button>
          <button onClick={() => navigate('/documents/outgoing')} className="rounded-lg bg-yellow-400 px-6 py-2.5 text-sm font-semibold text-slate-900 transition hover:brightness-105">Подписать</button>
          <button onClick={() => navigate(-1)} className="rounded-lg border border-red-300 px-6 py-2.5 text-sm font-semibold text-red-500 transition hover:bg-red-50">Отменить</button>
        </div>
      </div>
    </div>
  )
}
