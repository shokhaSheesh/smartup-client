import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronDown, Search, Plus, Trash2 } from 'lucide-react'
import { PillSelect } from '@/components/ui/PillSelect'
import { DOC_TYPES } from '@/data/docTypes'
import { cn } from '@/lib/cn'

const SMR_VARIANTS = ['Стандартный', 'Дополнительный', 'Исправленный']
const UNITS = ['м²', 'м³', 'тонна', 'штук', 'комплект']
const SHIFR = ['ШНК 1.01', 'ШНК 2.03', 'ШНК 3.06']
const WORK_TYPES = ['Земляные работы', 'Бетонные работы', 'Монтажные работы', 'Отделочные работы']

const cellInput = 'w-full bg-transparent text-right outline-none'

function num(v: string): number {
  const n = Number(v.replace(/\s/g, '').replace(',', '.'))
  return Number.isFinite(n) ? n : 0
}
function money(n: number): string {
  return n.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

/** Floating-label field. */
function LF({ label, required, value, dropdown, date, disabled }: { label: string; required?: boolean; value?: string; dropdown?: boolean; date?: boolean; disabled?: boolean }) {
  const [v, setV] = useState(value ?? '')
  return (
    <div className={cn('relative flex flex-col rounded-lg border px-3.5 py-1.5', disabled ? 'border-gray-200 bg-gray-50' : 'border-gray-300 bg-white')}>
      <span className="text-xs text-gray-500">{label}{required && <span className="text-red-500"> *</span>}</span>
      <input value={v} onChange={(e) => setV(e.target.value)} type={date ? 'date' : 'text'} disabled={disabled} className={cn('w-full bg-transparent text-sm outline-none', disabled ? 'text-gray-400' : 'text-slate-800')} />
      {dropdown && <ChevronDown className="pointer-events-none absolute right-3 top-4 size-4 text-gray-400" />}
    </div>
  )
}

function Card({ title, children }: { title?: string; children: React.ReactNode }) {
  return <div className="rounded-md bg-white p-6 shadow-[0px_1px_2px_0px_rgba(16,24,40,0.06)]">{title && <h3 className="mb-4 text-lg font-semibold text-slate-800">{title}</h3>}{children}</div>
}

type Row = {
  id: number
  shifr: string; workType: string; ikpu: string; unit: string
  factTotal: number; factSchedule: number
  contractTotal: number; contractYear: number
  s10: number; s11: number; s12: number
  p13: number; p14: number; p15: number
  m16: number; m17: number; m18: number
}
let nextId = 2
function emptyRow(): Row {
  return { id: nextId++, shifr: '', workType: '', ikpu: '', unit: '', factTotal: 0, factSchedule: 0, contractTotal: 0, contractYear: 0, s10: 0, s11: 0, s12: 0, p13: 0, p14: 0, p15: 0, m16: 0, m17: 0, m18: 0 }
}

export default function SmrForm({ docType, onDocType }: { docType: string; onDocType: (v: string) => void }) {
  const navigate = useNavigate()
  const [variant, setVariant] = useState(SMR_VARIANTS[0])
  const [rows, setRows] = useState<Row[]>([emptyRow()])

  function update(id: number, patch: Partial<Row>) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)))
  }
  const sum = (k: keyof Row) => rows.reduce((s, r) => s + (r[k] as number), 0)

  const th = 'border border-gray-300 px-2 py-2 text-center align-middle text-sm font-semibold text-zinc-900'
  const td = 'border border-gray-300 px-1 py-1'

  // Numeric leaf columns (data-row keys), all editable. Column numbers 6..18.
  const numCols: (keyof Row)[] = ['factTotal', 'factSchedule', 'contractTotal', 'contractYear', 's10', 's11', 's12', 'p13', 'p14', 'p15', 'm16', 'm17', 'm18']
  // Monetary columns that get a total in the Итого/НДС/Всего rows.
  const TOTAL_COLS = new Set([8, 9, 12, 15, 18])

  return (
    <div className="flex flex-col gap-4">
      {/* Type header */}
      <Card>
        <div className="mb-6 flex flex-wrap items-center gap-4">
          <span className="text-lg font-semibold text-black/80">Тип документа:</span>
          <PillSelect options={[...DOC_TYPES]} value={docType} onChange={onDocType} />
          <PillSelect options={SMR_VARIANTS} value={variant} onChange={setVariant} />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:max-w-2xl">
          <LF label="Номер счёт-фактуры" />
          <LF label="Дата документа" required date />
          <LF label="Номер контракта" />
          <LF label="Дата контракта" required date />
        </div>
      </Card>

      {/* Подрядчик / Заказчик */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card title="Подрядчик">
          <div className="flex flex-col gap-3">
            <LF label="ИНН/ПИНФЛ" required value="307205394" />
            <LF label="Выберите филиал" dropdown />
            <LF label="Наименование подрядчика" required value='"UDEVS" MCHJ' />
            <LF label="Регистрационный код плательщика НДС" value="326090125584" />
            <div className="grid grid-cols-2 gap-3"><LF label="Расчётный счёт" required dropdown value="20208000505191969001" /><LF label="МФО, SWIFT и др." required value="01095" /></div>
            <LF label="Название банка" value='ТОШКЕНТ Ш., "ASIA ALLIANCE BANK" АТ БАНКИ' />
            <LF label="Адрес" required value="ТОШКЕНТ ШАҲАР ОЛМАЗОР ТУМАНИ" />
            <LF label="Директор" required value="BAXODIROV AZIZBEK ULUG'BEK O'G'LI" />
          </div>
        </Card>
        <Card title="Заказчик">
          <div className="flex flex-col gap-3">
            <LF label="ИНН/ПИНФЛ" required />
            <LF label="Наименование заказчика" required />
            <LF label="Регистрационный код плательщика НДС" />
            <div className="grid grid-cols-2 gap-3"><LF label="Расчётный счёт" required dropdown /><LF label="МФО, SWIFT и др." required /></div>
            <LF label="Название банка" />
            <LF label="Адрес" required />
            <LF label="Директор" required />
            <h4 className="pt-2 text-base font-semibold text-slate-800">Технический контролер заказчика</h4>
            <div className="grid grid-cols-2 gap-3"><LF label="ИНН/ПИНФЛ" required /><LF label="ФИО" required /></div>
          </div>
        </Card>
      </div>

      {/* Строительный объект */}
      <Card title="Строительный объект">
        <div className="flex flex-wrap items-stretch gap-3">
          <div className="min-w-64 flex-1"><LF label="Название объекта" required /></div>
          <div className="flex min-w-64 flex-1 items-stretch">
            <div className="flex-1"><LF label="ID объекта" required /></div>
            <button className="ml-2 flex items-center justify-center rounded-lg border border-gray-200 px-3.5 text-gray-500 hover:bg-gray-50"><Search className="size-5" /></button>
          </div>
          <div className="min-w-64 flex-1"><LF label="Номер лота" required /></div>
        </div>
      </Card>

      {/* Works table */}
      <div className="rounded-md border border-gray-200 bg-white p-4">
        <div className="overflow-x-auto">
          <table className="border-collapse text-xs">
            <thead>
              <tr>
                <th className={th} rowSpan={3}>№</th>
                <th className={th} rowSpan={3}>Номер нормативного шифра (согласно ШНК)</th>
                <th className={th} rowSpan={3}>Название типа работ *</th>
                <th className={th} rowSpan={3}>ИКПУ и наименование товаров *</th>
                <th className={th} rowSpan={3}>Ед. изм. *</th>
                <th className={th} colSpan={2}>Фактические показатели объема работ и расходов</th>
                <th className={th} colSpan={2}>Контрактная стоимость (цена)</th>
                <th className={th} colSpan={9}>Выполненные работы</th>
                <th className={th} rowSpan={3} />
              </tr>
              <tr>
                <th className={th} rowSpan={2}>Итого *</th>
                <th className={th} rowSpan={2}>из них согласно производственному графику на текущий год *</th>
                <th className={th} rowSpan={2}>Итого *</th>
                <th className={th} rowSpan={2}>из них в текущем году *</th>
                <th className={th} colSpan={3}>с момента начала работ</th>
                <th className={th} colSpan={3}>из них с начала отчетного периода текущего года</th>
                <th className={th} colSpan={3}>из них в текущем месяце</th>
              </tr>
              <tr>
                {[0, 1, 2].flatMap((g) => [
                  <th key={`${g}a`} className={th}>физические показатели *</th>,
                  <th key={`${g}b`} className={th}>итого по отношению ко всему объему работ, в % *</th>,
                  <th key={`${g}c`} className={th}>по контрактной цене *</th>,
                ])}
              </tr>
              <tr className="text-gray-400">
                {Array.from({ length: 19 }, (_, i) => <td key={i} className="border border-gray-300 px-2 py-1 text-center text-[10px]">{i + 1}</td>)}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, idx) => (
                <tr key={r.id}>
                  <td className={cn(td, 'text-center')}>{idx + 1}</td>
                  <td className={td}><select value={r.shifr} onChange={(e) => update(r.id, { shifr: e.target.value })} className="w-40 bg-transparent outline-none"><option value="">—</option>{SHIFR.map((s) => <option key={s}>{s}</option>)}</select></td>
                  <td className={td}><select value={r.workType} onChange={(e) => update(r.id, { workType: e.target.value })} className="w-40 bg-transparent outline-none"><option value="">—</option>{WORK_TYPES.map((s) => <option key={s}>{s}</option>)}</select></td>
                  <td className={td}><select value={r.ikpu} onChange={(e) => update(r.id, { ikpu: e.target.value })} className="w-40 bg-transparent outline-none"><option value="">—</option><option>ИКПУ 001</option><option>ИКПУ 002</option></select></td>
                  <td className={td}><select value={r.unit} onChange={(e) => update(r.id, { unit: e.target.value })} className="w-24 bg-transparent outline-none"><option value="">—</option>{UNITS.map((u) => <option key={u}>{u}</option>)}</select></td>
                  {numCols.map((k) => (
                    <td key={k} className={td}>
                      <input value={(r[k] as number) || ''} onChange={(e) => update(r.id, { [k]: num(e.target.value) } as Partial<Row>)} className={cn(cellInput, 'w-20')} />
                    </td>
                  ))}
                  <td className={cn(td, 'text-center')}>
                    <div className="flex items-center justify-center gap-1">
                      <button onClick={() => setRows((p) => p.filter((x) => x.id !== r.id))} className="flex size-7 items-center justify-center rounded-md border border-gray-200 text-red-500 hover:bg-red-50"><Trash2 className="size-4" /></button>
                      <button onClick={() => setRows((p) => [...p, emptyRow()])} className="flex size-7 items-center justify-center rounded-md border border-green-200 text-Smart-green hover:bg-green-50"><Plus className="size-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {([['Итого:', 1], ['Сумма НДС:', 0.12], ['Всего:', 1.12]] as [string, number][]).map(([label, factor]) => (
                <tr key={label} className="font-semibold">
                  <td className={cn(td, 'bg-gray-50 text-right')} colSpan={5}>{label}</td>
                  {numCols.map((k, i) => {
                    const colNum = i + 6
                    const isTotal = TOTAL_COLS.has(colNum)
                    return <td key={k} className={cn(td, 'bg-gray-50 text-right text-zinc-700')}>{isTotal ? money(sum(k) * factor) : ''}</td>
                  })}
                  <td className={cn(td, 'bg-gray-50')} />
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
