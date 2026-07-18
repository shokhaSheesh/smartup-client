import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Trash2 } from 'lucide-react'
import { PillSelect } from '@/components/ui/PillSelect'
import { DOC_TYPES } from '@/data/docTypes'
import { cn } from '@/lib/cn'

const DESC_TEXT =
  'Мы, нижеподписавшиеся, BAXODIROV AZIZBEK ULUG\'BEK O\'G\'LI от имени "UDEVS" MCHJ, с одной стороны, и ____________ от имени ____________, с другой стороны, составили настоящий акт сверки о том, что состояние взаимных расчётов по данным учёта следующее:'

function LF({ label, required, value, disabled, date }: { label: string; required?: boolean; value?: string; disabled?: boolean; date?: boolean }) {
  const [v, setV] = useState(value ?? '')
  return (
    <div className={cn('relative flex flex-col rounded-lg border px-3.5 py-1.5', disabled ? 'border-gray-200 bg-gray-50' : 'border-gray-300 bg-white')}>
      <span className="text-xs text-gray-500">{required && <span className="text-red-500">*</span>}{label}</span>
      <input value={v} onChange={(e) => setV(e.target.value)} type={date ? 'date' : 'text'} disabled={disabled} className={cn('w-full bg-transparent text-sm outline-none', disabled ? 'text-gray-500' : 'text-slate-800')} />
    </div>
  )
}

function Card({ title, children }: { title?: string; children: React.ReactNode }) {
  return <div className="rounded-md bg-white p-6 shadow-[0px_1px_2px_0px_rgba(16,24,40,0.06)]">{title && <h3 className="mb-4 text-lg font-semibold text-slate-800">{title}</h3>}{children}</div>
}

const cellInput = 'w-full bg-transparent text-sm text-slate-800 outline-none'
const bd = 'border border-gray-300'
const grey = 'bg-gray-100'

/** One reconciliation block: transaction rows + saldo/totals, own vs контрагент. */
function ReconTable({ own, onRemove, removable }: { own: string; onRemove: () => void; removable: boolean }) {
  const [rows, setRows] = useState<number[]>([1])

  // 8-col grid: [Дата, Документ, Дебет, Кредит] × (own | контрагент)
  const Head = () => (
    <>
      <tr>
        <th colSpan={4} className={cn(bd, grey, 'px-3 py-2 text-center text-sm font-semibold text-zinc-900')}>По данным {own}, сум</th>
        <th colSpan={4} className={cn(bd, grey, 'px-3 py-2 text-center text-sm font-semibold text-zinc-900')}>По данным контрагента, сум</th>
      </tr>
      <tr>
        {['Дата', 'Документ', 'Дебет', 'Кредит', 'Дата', 'Документ', 'Дебет', 'Кредит'].map((h, i) => (
          <th key={i} className={cn(bd, 'px-3 py-2 text-center text-sm font-semibold text-zinc-900')}>{h}</th>
        ))}
      </tr>
    </>
  )

  return (
    <div className="flex flex-col gap-3">
      {removable && (
        <div className="flex justify-end">
          <button onClick={onRemove} className="flex items-center gap-1 text-sm font-medium text-red-500 hover:underline"><Trash2 className="size-4" />Удалить таблицу</button>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead><Head /></thead>
          <tbody>
            {/* transaction rows: own date+doc editable, amounts + контрагент mirrored (grey) */}
            {rows.map((rid) => (
              <tr key={rid}>
                <td className={cn(bd, 'px-2 py-1')}><input type="date" className={cellInput} /></td>
                <td className={cn(bd, 'px-2 py-1')}><input placeholder="№" className={cellInput} /></td>
                <td colSpan={6} className={cn(bd, grey)} />
              </tr>
            ))}
            {/* Сальдо начальное по договору */}
            <tr>
              <td colSpan={2} className={cn(bd, 'px-3 py-2 font-medium text-slate-700')}>Сальдо начальное по договору</td>
              <td className={cn(bd, 'px-2 py-1')}><input className={cellInput} /></td>
              <td className={cn(bd, 'px-2 py-1')}><input className={cellInput} /></td>
              <td colSpan={2} className={cn(bd, 'px-3 py-2 font-medium text-slate-700')}>Сальдо начальное по договору</td>
              <td className={cn(bd, grey)} />
              <td className={cn(bd, grey)} />
            </tr>
            <tr>
              <td colSpan={2} className={cn(bd, 'px-2 py-1')}><input type="date" className={cellInput} /></td>
              <td className={cn(bd)} />
              <td className={cn(bd)} />
              <td colSpan={2} className={cn(bd, 'px-2 py-1')}><input type="date" className={cn(cellInput, grey)} disabled /></td>
              <td className={cn(bd, grey)} />
              <td className={cn(bd, grey)} />
            </tr>
          </tbody>
        </table>
      </div>

      <div className="flex justify-end">
        <button onClick={() => setRows((r) => [...r, (r.at(-1) ?? 0) + 1])} className="flex items-center gap-2 text-sm font-medium text-Smart-green hover:underline">
          <span className="flex size-6 items-center justify-center rounded-full border-2 border-Smart-green"><Plus className="size-3.5" /></span>
          Добавить новую строку
        </button>
      </div>

      {/* Totals block 1 */}
      <table className="w-full border-collapse text-sm">
        <tbody>
          {[['Итого по договору', 'Итого по договору'], ['Сальдо конечное по договору', 'Сальдо конечное по договору']].map(([l, r], i) => (
            <tr key={i}>
              <td colSpan={2} className={cn(bd, 'px-3 py-2 font-medium text-slate-700')}>{l}</td>
              <td className={cn(bd, grey, 'px-3 py-2 text-right text-slate-700')}>0.00</td>
              <td className={cn(bd, grey, 'px-3 py-2 text-right text-slate-700')}>0.00</td>
              <td colSpan={2} className={cn(bd, 'px-3 py-2 font-medium text-slate-700')}>{r}</td>
              <td className={cn(bd, grey, 'px-3 py-2 text-right text-slate-700')}>0.00</td>
              <td className={cn(bd, grey, 'px-3 py-2 text-right text-slate-700')}>0.00</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals block 2 */}
      <table className="mt-2 w-full border-collapse text-sm">
        <tbody>
          {[['Обороты за период', 'Обороты за период'], ['Сальдо конечное', 'Сальдо конечное']].map(([l, r], i) => (
            <tr key={i}>
              <td colSpan={2} className={cn(bd, 'px-3 py-2 font-medium text-slate-700')}>{l}</td>
              <td className={cn(bd, grey, 'px-3 py-2 text-right text-slate-700')}>0.00</td>
              <td className={cn(bd, grey, 'px-3 py-2 text-right text-slate-700')}>0.00</td>
              <td colSpan={2} className={cn(bd, 'px-3 py-2 font-medium text-slate-700')}>{r}</td>
              <td className={cn(bd, grey, 'px-3 py-2 text-right text-slate-700')}>0.00</td>
              <td className={cn(bd, grey, 'px-3 py-2 text-right text-slate-700')}>0.00</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function AktSverkiForm({ docType, onDocType }: { docType: string; onDocType: (v: string) => void }) {
  const navigate = useNavigate()
  const OWN = '"UDEVS" MCHJ'
  const [tables, setTables] = useState<number[]>([1])

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <Card>
        <div className="mb-6 flex items-center gap-4">
          <span className="text-lg font-semibold text-black/80">Тип документа:</span>
          <PillSelect options={[...DOC_TYPES]} value={docType} onChange={onDocType} />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:max-w-xl">
          <LF label="№ акта сверки" required />
          <LF label="Дата акта сверки" required date />
        </div>
      </Card>

      {/* Parties */}
      <Card>
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 lg:grid-cols-2">
          <div>
            <h4 className="mb-3 text-lg font-semibold text-slate-800">Ваши сведения</h4>
            <div className="flex flex-col gap-3">
              <LF label="ИНН/ПИНФЛ организации" value="307205394" disabled />
              <LF label="Название организации" required value={OWN} disabled />
              <div className="grid grid-cols-2 gap-3">
                <LF label="ПИНФЛ ответственного лица" required value="31107950530099" />
                <LF label="ФИО ответственного лица" required value="BAXODIROV AZIZBEK ULUG'BEK O'G'LI" />
              </div>
            </div>
          </div>
          <div>
            <h4 className="mb-3 text-lg font-semibold text-slate-800">Сведения партнера</h4>
            <div className="flex flex-col gap-3">
              <LF label="ИНН/ПИНФЛ организации" required />
              <LF label="Название организации" required />
              <div className="grid grid-cols-2 gap-3">
                <LF label="ПИНФЛ ответственного лица" required />
                <LF label="ФИО ответственного лица" required />
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Описание */}
      <Card title="Описание">
        <textarea defaultValue={DESC_TEXT} rows={5} className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm leading-6 text-slate-800 outline-none focus:border-Smart-blue" />
      </Card>

      {/* Акт tables */}
      <Card title="Акт">
        <div className="flex flex-col gap-8">
          {tables.map((tid, i) => (
            <ReconTable key={tid} own={OWN} removable={i > 0} onRemove={() => setTables((t) => t.filter((x) => x !== tid))} />
          ))}
        </div>
        <div className="mt-4 flex justify-end">
          <button onClick={() => setTables((t) => [...t, (t.at(-1) ?? 0) + 1])} className="flex items-center gap-2 text-sm font-medium text-Smart-green hover:underline">
            <span className="flex size-6 items-center justify-center rounded-full border-2 border-Smart-green"><Plus className="size-3.5" /></span>
            Добавить новую таблицу
          </button>
        </div>
      </Card>

      {/* Bottom */}
      <div className="flex flex-col items-center gap-4 pt-2">
        <button className="text-sm font-semibold text-Smart-blue hover:underline">Показать документ</button>
        <div className="flex items-center gap-3">
          <button className="rounded-lg bg-Smart-blue px-8 py-2.5 text-sm font-semibold text-white transition hover:brightness-105">Сохранить</button>
          <button onClick={() => navigate('/documents/outgoing')} className="rounded-lg bg-yellow-400 px-8 py-2.5 text-sm font-semibold text-slate-900 transition hover:brightness-105">Подписать</button>
          <button onClick={() => navigate(-1)} className="rounded-lg border border-red-300 px-8 py-2.5 text-sm font-semibold text-red-500 transition hover:bg-red-50">Отменить</button>
        </div>
      </div>
    </div>
  )
}
