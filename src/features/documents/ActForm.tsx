import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Trash2 } from 'lucide-react'
import { PillSelect } from '@/components/ui/PillSelect'
import { DOC_TYPES } from '@/data/docTypes'
import { cn } from '@/lib/cn'

const UNITS = ['Штук', 'кг', 'литр', 'метр', 'услуга']
const VAT_RATES = [-1, 0, 12, 15]
const vatLabel = (r: number) => (r < 0 ? 'Без НДС' : `${r}%`)
const ACT_TEXT =
  'Мы, нижеподписавшиеся, ""UDEVS" MCHJ" именуемое в дальнейшем Исполнитель, с одной стороны и "________" именуемое в дальнейшем Заказчик, с другой стороны составили настоящий Акт о том, что работы выполнены в соответствии с условиями Заказчика в полном объеме.'

const cellInput = 'bg-transparent outline-none'
function num(v: string): number {
  const n = Number(v.replace(/\s/g, '').replace(',', '.'))
  return Number.isFinite(n) ? n : 0
}
function money(n: number): string {
  return n.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function LF({ label, required, value }: { label: string; required?: boolean; value?: string }) {
  const [v, setV] = useState(value ?? '')
  return (
    <div className="flex flex-col rounded-lg border border-gray-300 bg-white px-3.5 py-1.5">
      <span className="text-xs text-gray-500">{label}{required && <span className="text-red-500"> *</span>}</span>
      <input value={v} onChange={(e) => setV(e.target.value)} className="w-full bg-transparent text-sm text-slate-800 outline-none" />
    </div>
  )
}

function Card({ title, children }: { title?: string; children: React.ReactNode }) {
  return <div className="rounded-md bg-white p-6 shadow-[0px_1px_2px_0px_rgba(16,24,40,0.06)]">{title && <h3 className="mb-4 text-lg font-semibold text-slate-800">{title}</h3>}{children}</div>
}

type Item = { id: number; ikpu: string; description: string; unit: string; qty: number; price: number; vat: number }
let nextId = 2
const emptyItem = (): Item => ({ id: nextId++, ikpu: '', description: '', unit: 'Штук', qty: 0, price: 0, vat: -1 })

export default function ActForm({ docType, onDocType }: { docType: string; onDocType: (v: string) => void }) {
  const navigate = useNavigate()
  const [items, setItems] = useState<Item[]>([emptyItem()])

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
  const th = 'border-b border-r border-gray-200 px-3 py-3 text-center align-middle text-sm font-semibold text-zinc-900 last:border-r-0'

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <Card>
        <div className="mb-6 flex items-center gap-4">
          <span className="text-lg font-semibold text-black/80">Тип документа:</span>
          <PillSelect options={[...DOC_TYPES]} value={docType} onChange={onDocType} />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:max-w-2xl">
          <LF label="Акт №" required />
          <LF label="Дата документа" required />
          <LF label="Номер контракта" required />
          <LF label="Дата контракта" required />
        </div>
      </Card>

      {/* Parties */}
      <Card>
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 lg:grid-cols-2">
          <div><h4 className="mb-3 text-lg font-semibold text-slate-800">Ваши сведения</h4><LF label="ИНН/ПИНФЛ" required value="307205394" /></div>
          <div><h4 className="mb-3 text-lg font-semibold text-slate-800">Сведения о партнере</h4><LF label="ИНН/ПИНФЛ" required /></div>
          <div><h4 className="mb-3 text-lg font-semibold text-slate-800">Компания партнера</h4><LF label="Наименование компании" required value='"UDEVS" MCHJ' /></div>
          <div><h4 className="mb-3 text-lg font-semibold text-slate-800">Компания</h4><LF label="Наименование компании" required /></div>
        </div>
      </Card>

      {/* Акт text */}
      <Card title="Акт">
        <textarea defaultValue={ACT_TEXT} rows={5} className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm leading-6 text-slate-800 outline-none focus:border-Smart-blue" />
      </Card>

      {/* Items */}
      <div className="rounded-md bg-white p-6 shadow-[0px_1px_2px_0px_rgba(16,24,40,0.06)]">
        <div className="mb-3 flex justify-end"><button className="text-sm font-semibold text-Smart-blue">Коды ИКПУ</button></div>
        <div className="overflow-x-auto rounded-md border border-gray-200">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-white">
                {['№', 'ИКПУ и наименование товаров', 'Описание товаров *', 'Ед. изм. *', 'Кол-во *', 'Цена *', 'Стоимость поставки *', 'НДС, %', 'Сумма НДС *', 'Всего *', ''].map((h, i) => <th key={i} className={th}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {items.map((it, idx) => (
                <tr key={it.id}>
                  <td className={cn(cellCls, 'text-center text-zinc-700')}>{idx + 1}</td>
                  <td className={cellCls}><select value={it.ikpu} onChange={(e) => updateItem(it.id, { ikpu: e.target.value })} className={cn(cellInput, 'w-40')}><option value="">—</option><option>ИКПУ 001</option><option>ИКПУ 002</option></select></td>
                  <td className={cellCls}><input value={it.description} onChange={(e) => updateItem(it.id, { description: e.target.value })} className={cn(cellInput, 'w-40')} /></td>
                  <td className={cellCls}><select value={it.unit} onChange={(e) => updateItem(it.id, { unit: e.target.value })} className={cellInput}>{UNITS.map((u) => <option key={u}>{u}</option>)}</select></td>
                  <td className={cellCls}><input value={it.qty || ''} onChange={(e) => updateItem(it.id, { qty: num(e.target.value) })} className={cn(cellInput, 'w-16 text-right')} /></td>
                  <td className={cellCls}><input value={it.price || ''} onChange={(e) => updateItem(it.id, { price: num(e.target.value) })} className={cn(cellInput, 'w-24 text-right')} /></td>
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
                <td colSpan={6} className="px-3 py-3 text-right text-sm text-slate-700">Итого:</td>
                <td className="border-r border-gray-200 px-3 py-3 text-right text-sm text-slate-800">{money(totalSupply)}</td>
                <td className="border-r border-gray-200" />
                <td className="border-r border-gray-200 px-3 py-3 text-right text-sm text-slate-800">{money(totalVat)}</td>
                <td className="border-r border-gray-200 px-3 py-3 text-right text-sm text-slate-800">{money(totalAll)}</td>
                <td />
              </tr>
            </tbody>
          </table>
        </div>
      </div>

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
