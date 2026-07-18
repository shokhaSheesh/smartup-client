import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronDown } from 'lucide-react'
import { PillSelect } from '@/components/ui/PillSelect'
import { DOC_TYPES } from '@/data/docTypes'
import { cn } from '@/lib/cn'

const SUBTYPES = ['Другое', 'Договор', 'Акт', 'Счет', 'Письмо', 'Приказ']

function LF({ label, required, value, dropdown, date, options }: { label: string; required?: boolean; value?: string; dropdown?: boolean; date?: boolean; options?: string[] }) {
  const [v, setV] = useState(value ?? (options ? options[0] : ''))
  return (
    <div className="relative flex flex-col rounded-lg border border-gray-300 bg-white px-3.5 py-1.5">
      <span className="text-xs text-gray-500">{label}{required && <span className="text-red-500"> *</span>}</span>
      {options ? (
        <select value={v} onChange={(e) => setV(e.target.value)} className="w-full appearance-none bg-transparent text-sm text-slate-800 outline-none">{options.map((o) => <option key={o}>{o}</option>)}</select>
      ) : (
        <input value={v} onChange={(e) => setV(e.target.value)} type={date ? 'date' : 'text'} className="w-full bg-transparent text-sm text-slate-800 outline-none" />
      )}
      {(dropdown || options) && <ChevronDown className="pointer-events-none absolute right-3 top-4 size-4 text-gray-400" />}
    </div>
  )
}

function Card({ children }: { children: React.ReactNode }) {
  return <div className="rounded-md bg-white p-6 shadow-[0px_1px_2px_0px_rgba(16,24,40,0.06)]">{children}</div>
}

export default function ProizvolnyForm({ docType, onDocType }: { docType: string; onDocType: (v: string) => void }) {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <Card>
        <div className="mb-6 flex items-center gap-4">
          <span className="text-lg font-semibold text-black/80">Тип документа:</span>
          <PillSelect options={[...DOC_TYPES]} value={docType} onChange={onDocType} />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:max-w-3xl">
          <LF label="Номер документа" required />
          <LF label="Дата документа" required date />
          <LF label="Номер контракта" />
          <LF label="Дата контракта" date />
          <LF label="Название документа" />
          <LF label="Подтип документа" options={SUBTYPES} />
        </div>
      </Card>

      {/* Parties + upload */}
      <Card>
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 lg:grid-cols-2">
          <div><h4 className="mb-3 text-lg font-semibold text-slate-800">Ваши сведения</h4><LF label="ИНН/ПИНФЛ" required value="307205394" /></div>
          <div><h4 className="mb-3 text-lg font-semibold text-slate-800">Сведения о партнере</h4><LF label="ИНН/ПИНФЛ" required /></div>
          <div>
            <h4 className="mb-3 text-lg font-semibold text-slate-800">Компания</h4>
            <div className="flex flex-col gap-3">
              <LF label="Наименование компании" required value='"UDEVS" MCHJ' />
              <LF label="Адрес" required value="ТОШКЕНТ ШАҲАР ОЛМАЗОР ТУМАНИ Yangi Olmazor ko'chasi" />
            </div>
          </div>
          <div>
            <h4 className="mb-3 text-lg font-semibold text-slate-800">Компания партнера</h4>
            <div className="flex flex-col gap-3">
              <LF label="Наименование компании" required />
              <LF label="Адрес" required />
            </div>
          </div>
        </div>

        {/* Drop zone */}
        <label className="mt-6 flex min-h-44 cursor-pointer flex-col items-center justify-center rounded-xl bg-[#2e1a47] px-6 py-10 text-center transition hover:brightness-110">
          <span className="text-3xl font-bold text-white">Перетащите файл сюда</span>
          <span className="mt-2 text-base text-gray-300">или нажмите, чтобы найти на диске</span>
          <span className="mt-1 text-sm text-gray-400">(.pdf не более 10мб)</span>
          <input type="file" accept="application/pdf" className="hidden" />
        </label>
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
