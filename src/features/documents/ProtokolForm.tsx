import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronDown, Plus, Trash2 } from 'lucide-react'
import { PillSelect } from '@/components/ui/PillSelect'
import { DOC_TYPES } from '@/data/docTypes'
import { cn } from '@/lib/cn'

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

function Check({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="size-4 accent-Smart-blue" />
      {label}
    </label>
  )
}

function Card({ title, children }: { title?: string; children: React.ReactNode }) {
  return <div className="rounded-md bg-white p-6 shadow-[0px_1px_2px_0px_rgba(16,24,40,0.06)]">{title && <h3 className="mb-4 text-lg font-semibold text-slate-800">{title}</h3>}{children}</div>
}

/** Own organization details column. */
function OwnParty() {
  return (
    <div className="flex flex-col gap-3">
      <LF label="ИНН/ПИНФЛ" required value="307205394" />
      <LF label="Название" required value='"UDEVS" MCHJ' />
      <div className="grid grid-cols-2 gap-3">
        <LF label="ПИНФЛ физ. лица" required value="31107950530099" />
        <LF label="ФИО" required value="BAXODIROV AZIZBEK ULUG'BEK" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <LF label="МФО" dropdown value="01095" />
        <LF label="Название банка" value='ТОШКЕНТ Ш., "ASIA ALLIANCE BANK" АТ БАНКИ' />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <LF label="ОКЭД" value="62090" />
        <LF label="Расчетный счет" dropdown value="20208000505191969001" />
      </div>
      <LF label="Адрес" value="ТОШКЕНТ ШАҲАР ОЛМАЗОР ТУМАНИ Yangi Olmazor ko'chasi" />
      <div className="grid grid-cols-2 gap-3">
        <LF label="Телефон" value="998338380110" />
        <LF label="Номер мобильного телефона" value="998338380110" />
      </div>
    </div>
  )
}

/** A meeting participant — physical person by default, or legal entity via Юр. лицо. */
function Participant({ index, onAdd, onRemove, removable }: { index: number; onAdd: () => void; onRemove: () => void; removable: boolean }) {
  const [legal, setLegal] = useState(false)
  const [chair, setChair] = useState(false)
  const [secretary, setSecretary] = useState(false)
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <h4 className="text-lg font-semibold text-slate-800">Участник {index}</h4>
        <Check label="Юр. лицо" checked={legal} onChange={setLegal} />
        <div className="ml-auto flex items-center gap-2">
          <button onClick={onAdd} className="flex size-8 items-center justify-center rounded-md border border-gray-200 text-slate-500 hover:bg-gray-50"><Plus className="size-4" /></button>
          {removable && <button onClick={onRemove} className="flex size-8 items-center justify-center rounded-md border border-gray-200 text-red-500 hover:bg-red-50"><Trash2 className="size-4" /></button>}
        </div>
      </div>
      {legal ? (
        <>
          <div className="grid grid-cols-2 gap-3">
            <LF label="ИНН/ПИНФЛ" required />
            <LF label="Название" required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <LF label="ПИНФЛ физ. лица (директор)" required />
            <LF label="Доля" required />
          </div>
        </>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3">
            <LF label="ПИНФЛ физ. лица (директор)" required />
            <LF label="ФИО" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <LF label="Гражданство" />
            <LF label="Доля" required />
          </div>
        </>
      )}
      <div className="flex items-center gap-16">
        <Check label="Председатель" checked={chair} onChange={setChair} />
        <Check label="Секретарь" checked={secretary} onChange={setSecretary} />
      </div>
    </div>
  )
}

type Section = { id: number; title: string; text: string }
let nextSec = 2
const emptySection = (): Section => ({ id: nextSec++, title: '', text: '' })

export default function ProtokolForm({ docType, onDocType }: { docType: string; onDocType: (v: string) => void }) {
  const navigate = useNavigate()
  const [participants, setParticipants] = useState<number[]>([1])
  const addParticipant = () => setParticipants((p) => [...p, (p.at(-1) ?? 0) + 1])
  const [sections, setSections] = useState<Section[]>([
    { id: 1, title: 'На собрании присутствуют Участники "UDEVS" MCHJ физические лица', text: 'гр-н _____, владеющий _____% доли в уставном капитале Общества' },
  ])

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <Card>
        <div className="mb-6 flex items-center gap-4">
          <span className="text-lg font-semibold text-black/80">Тип документа:</span>
          <PillSelect options={[...DOC_TYPES]} value={docType} onChange={onDocType} />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:max-w-3xl">
          <LF label="Наименование" required />
          <LF label="Номер документа" required />
          <LF label="Место" required />
          <LF label="Дата документа" required date />
        </div>
      </Card>

      {/* Own + participants */}
      <Card>
        <div className="grid grid-cols-1 gap-x-8 gap-y-8 lg:grid-cols-2">
          <div><h4 className="mb-3 text-lg font-semibold text-slate-800">Ваши сведения</h4><OwnParty /></div>
          <div className="flex flex-col gap-8">
            {participants.map((pid, i) => (
              <Participant key={pid} index={i + 1} onAdd={addParticipant} removable={i > 0} onRemove={() => setParticipants((p) => p.filter((x) => x !== pid))} />
            ))}
          </div>
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
          <button className={cn('rounded-lg border border-Smart-blue px-6 py-2.5 text-sm font-semibold text-Smart-blue transition hover:bg-blue-50')}>Сохранить</button>
          <button onClick={() => navigate('/documents/outgoing')} className="rounded-lg bg-yellow-400 px-6 py-2.5 text-sm font-semibold text-slate-900 transition hover:brightness-105">Подписать</button>
          <button onClick={() => navigate(-1)} className="rounded-lg border border-red-300 px-6 py-2.5 text-sm font-semibold text-red-500 transition hover:bg-red-50">Отменить</button>
        </div>
      </div>
    </div>
  )
}
