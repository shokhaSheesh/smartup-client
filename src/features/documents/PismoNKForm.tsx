import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronDown, Paperclip, Plus, Bold, Italic, Underline, Code, AlignLeft, AlignCenter, AlignRight, AlignJustify, Quote, ListOrdered, List } from 'lucide-react'
import { PillSelect } from '@/components/ui/PillSelect'
import { DOC_TYPES } from '@/data/docTypes'
import { cn } from '@/lib/cn'

function LF({ label, required, value, dropdown, date, icon }: { label: string; required?: boolean; value?: string; dropdown?: boolean; date?: boolean; icon?: React.ReactNode }) {
  const [v, setV] = useState(value ?? '')
  return (
    <div className="relative flex flex-col rounded-lg border border-gray-300 bg-white px-3.5 py-1.5">
      <span className="text-xs text-gray-500">{label}{required && <span className="text-red-500"> *</span>}</span>
      <input value={v} onChange={(e) => setV(e.target.value)} type={date ? 'date' : 'text'} className="w-full bg-transparent pr-6 text-sm text-slate-800 outline-none" />
      {dropdown && <ChevronDown className="pointer-events-none absolute right-3 top-4 size-4 text-gray-400" />}
      {icon && <span className="pointer-events-none absolute right-3 top-3.5 text-gray-400">{icon}</span>}
    </div>
  )
}

function Card({ children }: { children: React.ReactNode }) {
  return <div className="rounded-md bg-white p-6 shadow-[0px_1px_2px_0px_rgba(16,24,40,0.06)]">{children}</div>
}

const TbBtn = ({ children }: { children: React.ReactNode }) => (
  <button type="button" className="flex size-8 items-center justify-center rounded text-slate-600 hover:bg-gray-100">{children}</button>
)
const Sep = () => <span className="mx-1 h-5 w-px bg-gray-200" />

export default function PismoNKForm({ docType, onDocType }: { docType: string; onDocType: (v: string) => void }) {
  const navigate = useNavigate()
  const [phones, setPhones] = useState<number[]>([1])

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <Card>
        <div className="mb-6 flex items-center gap-4">
          <span className="text-lg font-semibold text-black/80">Тип документа:</span>
          <PillSelect options={[...DOC_TYPES]} value={docType} onChange={onDocType} />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:max-w-xl">
          <LF label="Номер документа" required />
          <LF label="Дата документа" required date />
        </div>
      </Card>

      <Card>
        <h4 className="mb-4 text-lg font-semibold text-slate-800">Ваши сведения</h4>
        <div className="grid grid-cols-1 gap-x-8 gap-y-3 lg:grid-cols-2">
          {/* Left: company */}
          <div className="flex flex-col gap-3">
            <LF label="ИНН/ПИНФЛ" value="307205394" />
            <LF label="Наименование компании" required value='"UDEVS" MCHJ' />
            <LF label="Адрес" required value="ТОШКЕНТ ШАҲАР ОЛМАЗОР ТУМАНИ Yangi Olmazor ko'chasi" />
            <div className="grid grid-cols-2 gap-3">
              <LF label="МФО, SWIFT и др." dropdown value="01095" />
              <LF label="Расчетный счет" dropdown value="20208000505191969001" />
            </div>
            <LF label="Название банка" value='ТОШКЕНТ Ш., "ASIA ALLIANCE BANK" АТ БАНКИ' />
          </div>
          {/* Right: contacts */}
          <div className="flex flex-col gap-3">
            <LF label="Электронная почта" />
            <LF label="Веб-сайт" />
            <LF label="Логотип" icon={<Paperclip className="size-4" />} />
            <div className="flex items-end gap-2">
              <div className="flex-1 flex flex-col gap-3">
                {phones.map((pid) => <LF key={pid} label="Номер телефона" value={pid === 1 ? '+998 (33) 838-01-10' : undefined} />)}
              </div>
              <button onClick={() => setPhones((p) => [...p, (p.at(-1) ?? 0) + 1])} className="flex size-11 items-center justify-center rounded-md border border-gray-200 text-slate-500 hover:bg-gray-50"><Plus className="size-4" /></button>
            </div>
          </div>
        </div>

        {/* Signer + recipient */}
        <div className="mt-6 grid grid-cols-1 gap-x-8 gap-y-3 lg:grid-cols-2">
          <div>
            <h4 className="mb-3 text-lg font-semibold text-slate-800">Данные подписанта</h4>
            <div className="flex flex-col gap-3">
              <LF label="ПИНФЛ" required />
              <LF label="ФИО" required />
              <LF label="Должность" required />
            </div>
          </div>
          <div>
            <h4 className="mb-3 text-lg font-semibold text-slate-800">Получатель</h4>
            <div className="flex flex-col gap-3">
              <LF label="ИНН/ПИНФЛ" required />
              <LF label="Название" required />
              <LF label="Адрес" required />
            </div>
          </div>
        </div>

        {/* Описание — rich text */}
        <div className="mt-6">
          <h4 className="mb-3 text-lg font-semibold text-slate-800">Описание</h4>
          <div className="rounded-lg border border-gray-300">
            <div className="flex flex-wrap items-center gap-0.5 border-b border-gray-200 px-2 py-1.5">
              <TbBtn><Bold className="size-4" /></TbBtn>
              <TbBtn><Italic className="size-4" /></TbBtn>
              <TbBtn><Underline className="size-4" /></TbBtn>
              <TbBtn><Code className="size-4" /></TbBtn>
              <Sep />
              <TbBtn><AlignLeft className="size-4" /></TbBtn>
              <TbBtn><AlignCenter className="size-4" /></TbBtn>
              <TbBtn><AlignRight className="size-4" /></TbBtn>
              <TbBtn><AlignJustify className="size-4" /></TbBtn>
              <Sep />
              <TbBtn><span className="flex size-5 items-center justify-center rounded border border-slate-500 text-[11px] font-bold">1</span></TbBtn>
              <TbBtn><span className="flex size-5 items-center justify-center rounded border border-slate-500 text-[11px] font-bold">2</span></TbBtn>
              <TbBtn><Quote className="size-4" /></TbBtn>
              <Sep />
              <TbBtn><ListOrdered className="size-4" /></TbBtn>
              <TbBtn><List className="size-4" /></TbBtn>
            </div>
            <textarea rows={9} className="w-full resize-y rounded-b-lg px-4 py-3 text-sm text-slate-800 outline-none" />
          </div>
        </div>

        {/* Вложения */}
        <div className="mt-6">
          <h4 className="mb-3 text-lg font-semibold text-slate-800">Вложения</h4>
          <label className="flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-Smart-blue/40 bg-Smart-blue/5 px-6 py-10 text-center transition hover:bg-Smart-blue/10">
            <span className="text-2xl font-bold text-Smart-blue">Перетащите файл сюда</span>
            <span className="mt-2 text-base text-slate-500">или нажмите, чтобы найти на диске</span>
            <input type="file" className="hidden" />
          </label>
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
