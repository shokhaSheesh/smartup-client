import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronDown, Plus, Trash2 } from 'lucide-react'
import { PillSelect } from '@/components/ui/PillSelect'
import { DOC_TYPES } from '@/data/docTypes'
import { cn } from '@/lib/cn'

const UNITS = ['штук', 'кг', 'литр', 'метр', 'услуга']
const cellInput = 'bg-transparent outline-none'
function num(v: string): number {
  const n = Number(v.replace(/\s/g, '').replace(',', '.'))
  return Number.isFinite(n) ? n : 0
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

function Card({ title, children }: { title?: string; children: React.ReactNode }) {
  return <div className="rounded-md bg-white p-6 shadow-[0px_1px_2px_0px_rgba(16,24,40,0.06)]">{title && <h3 className="mb-4 text-lg font-semibold text-slate-800">{title}</h3>}{children}</div>
}

/** One party column: identity + director (+ optional chief accountant for own side). */
function Party({ own }: { own: boolean }) {
  return (
    <div className="flex flex-col gap-3">
      <LF label="ИНН/ПИНФЛ" required value={own ? '307205394' : undefined} />
      <LF label="Наименование компании" required value={own ? '"UDEVS" MCHJ' : undefined} />
      <LF label="Адрес" required value={own ? 'ТОШКЕНТ ШАҲАР ОЛМАЗОР ТУМАНИ Yangi Olmazor ko\'chasi' : undefined} />
      <h4 className="mt-1 text-base font-semibold text-slate-800">Директор</h4>
      <div className="grid grid-cols-2 gap-3">
        <LF label="ИНН/ПИНФЛ" required value={own ? '31107950530099' : undefined} />
        <LF label="ФИО" />
      </div>
      {own && (
        <>
          <h4 className="mt-1 text-base font-semibold text-slate-800">Глав. бух. компании</h4>
          <div className="grid grid-cols-2 gap-3">
            <LF label="ИНН/ПИНФЛ" required />
            <LF label="ФИО" />
          </div>
        </>
      )}
    </div>
  )
}

type Item = { id: number; ikpu: string; description: string; unit: string; qty: number }
let nextId = 2
const emptyItem = (): Item => ({ id: nextId++, ikpu: '', description: '', unit: 'штук', qty: 0 })

export default function DoverennostNewForm({ docType, onDocType }: { docType: string; onDocType: (v: string) => void }) {
  const navigate = useNavigate()
  const [items, setItems] = useState<Item[]>([emptyItem()])
  function updateItem(id: number, patch: Partial<Item>) {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, ...patch } : it)))
  }
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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:max-w-4xl">
          <LF label="Номер доверенности" />
          <LF label="Дата выдачи" required date />
          <LF label="Действителен до" required date />
          <LF label="Номер контракта" required />
          <LF label="Дата контракта" required date />
        </div>
      </Card>

      {/* Parties */}
      <Card>
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 lg:grid-cols-2">
          <div><h4 className="mb-3 text-lg font-semibold text-slate-800">Ваши сведения</h4><Party own /></div>
          <div><h4 className="mb-3 text-lg font-semibold text-slate-800">Сведения о партнере</h4><Party own={false} /></div>
        </div>
      </Card>

      {/* Доверенное лицо */}
      <Card title="Доверенное лицо">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:max-w-2xl">
          <LF label="ИНН/ПИНФЛ" required />
          <LF label="ФИО" />
        </div>
      </Card>

      {/* Items */}
      <div className="rounded-md bg-white p-6 shadow-[0px_1px_2px_0px_rgba(16,24,40,0.06)]">
        <div className="mb-3 flex justify-end"><button className="text-sm font-semibold text-Smart-blue">Коды ИКПУ</button></div>
        <div className="overflow-x-auto rounded-md border border-gray-200">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-white">
                {['№', 'ИКПУ и наименование товаров', 'Описание товаров *', 'Ед. изм. *', 'Кол-во *', ''].map((h, i) => <th key={i} className={th}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {items.map((it, idx) => (
                <tr key={it.id}>
                  <td className={cn(cellCls, 'text-center text-zinc-700')}>{idx + 1}</td>
                  <td className={cellCls}><select value={it.ikpu} onChange={(e) => updateItem(it.id, { ikpu: e.target.value })} className={cn(cellInput, 'w-64')}><option value="">—</option><option>ИКПУ 001</option><option>ИКПУ 002</option></select></td>
                  <td className={cellCls}><input value={it.description} onChange={(e) => updateItem(it.id, { description: e.target.value })} className={cn(cellInput, 'w-48')} /></td>
                  <td className={cellCls}><select value={it.unit} onChange={(e) => updateItem(it.id, { unit: e.target.value })} className={cellInput}>{UNITS.map((u) => <option key={u}>{u}</option>)}</select></td>
                  <td className={cellCls}><input value={it.qty || ''} onChange={(e) => updateItem(it.id, { qty: num(e.target.value) })} className={cn(cellInput, 'w-24 text-right')} /></td>
                  <td className={cn(cellCls, 'text-center')}>
                    <div className="flex items-center justify-center gap-1">
                      <button onClick={() => setItems((p) => p.filter((x) => x.id !== it.id))} className="flex size-7 items-center justify-center rounded-md border border-gray-200 text-red-500 hover:bg-red-50"><Trash2 className="size-4" /></button>
                      <button onClick={() => setItems((p) => [...p, emptyItem()])} className="flex size-7 items-center justify-center rounded-md border border-green-200 text-Smart-green hover:bg-green-50"><Plus className="size-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
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
