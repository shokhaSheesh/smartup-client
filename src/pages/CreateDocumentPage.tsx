import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, ChevronDown, Plus, Minus, Trash2, Pencil, ArrowUpRight } from 'lucide-react'
import { PillSelect } from '@/components/ui/PillSelect'
import { Modal } from '@/components/ui/Modal'
import TtnForm from '@/features/documents/TtnForm'
import HybridForm from '@/features/documents/HybridForm'
import SmrForm from '@/features/documents/SmrForm'
import TtnNewForm from '@/features/documents/TtnNewForm'
import ActForm from '@/features/documents/ActForm'
import DoverennostForm from '@/features/documents/DoverennostForm'
import DoverennostNewForm from '@/features/documents/DoverennostNewForm'
import DogovorForm from '@/features/documents/DogovorForm'
import ProizvolnyForm from '@/features/documents/ProizvolnyForm'
import AktSverkiForm from '@/features/documents/AktSverkiForm'
import MultiProizvolnyForm from '@/features/documents/MultiProizvolnyForm'
import ProtokolForm from '@/features/documents/ProtokolForm'
import PismoNKForm from '@/features/documents/PismoNKForm'
import { DOC_TYPES } from '@/data/docTypes'
import { cn } from '@/lib/cn'

/**
 * Per-variant header rules. `contract` = show Номер/Дата контракта;
 * `special` = an extra 3rd-column field (label + required).
 * Add new subtypes here as their Didox forms come in.
 */
const OLD_SF = { label: 'ID старой счёт-фактуры', required: false }
const OLD_SF_REQ = { label: 'ID старой счёт-фактуры', required: true }
const IN_SF = { label: 'ID входящей сф', required: true }

const VARIANT_CONFIG: Record<string, { contract: boolean; special?: { label: string; required: boolean } }> = {
  Стандартный: { contract: true },
  Дополнительный: { contract: false, special: OLD_SF_REQ },
  Исправленный: { contract: true, special: OLD_SF },
  'Возмещение расходов (газ, электроэнергия и др.)': { contract: true, special: IN_SF },
  'Дополнительная (возмещение затрат)': { contract: true, special: OLD_SF_REQ },
  'Исправленный (возмещение затрат)': { contract: true, special: OLD_SF },
  'Без оплаты': { contract: true },
  'Исправленный (без оплаты)': { contract: true, special: OLD_SF },
  'Дополнительный (без оплаты)': { contract: false, special: OLD_SF_REQ },
}
const VARIANTS = Object.keys(VARIANT_CONFIG)

/** Per-doc-type overrides where a variant's header differs from the default. */
const VARIANT_OVERRIDES: Record<string, Record<string, { contract: boolean; special?: { label: string; required: boolean } }>> = {
  'Счет-фактура (ФАРМ)': {
    'Возмещение расходов (газ, электроэнергия и др.)': { contract: true }, // no special field
    'Дополнительный (без оплаты)': { contract: true, special: OLD_SF_REQ },
  },
}
const UNITS = ['Штук', 'кг', 'литр', 'метр', 'услуга']
const DISPENSING = ['Оптовая реализация', 'Розничная реализация', 'Льготный отпуск']
const ORIGIN = ['Отечественный товар', 'Импортный товар', 'Товар из СЭЗ']
const VAT_RATES = [-1, 0, 12, 15]
const vatLabel = (r: number) => (r < 0 ? 'Без НДС' : `${r}%`)
const LOT_TYPES = [
  'cooperation.uz (CPR-)',
  'E-Birja (E-BIRJA-)',
  'Shaffof qurilish (SHAFFOF-)',
  'xt-xarid.uz (XT-)',
  'Давлат харидлар, Тендер (DX-T-)',
  'Давлат харидлар, Энг яхши таклиф (DX-O-)',
  'Давлат харидлар, Тўғридан-тўғри (DX-R-)',
]
const ONESIDED_TYPES = [
  'Физическому лицу',
  'Экспорт услуг (за пределами Республики Узбекистан)',
  'Импорт услуг',
  'Финансовые услуги',
  'Реализация ниже рыночной цены',
  'Реализация ниже таможенной цены',
  'Экспорт товаров и услуг (на территории РУз)',
]

type LineItem = {
  id: number
  ikpu: string
  description: string
  barcode: string
  marking: string
  dispensing: string
  series: string
  unit: string
  qty: number
  basePrice: number
  markup: number
  origin: string
  price: number
  exciseRate: number
  vat: number
  lgota: string
  warehouse: string
  manualSupply: number
  manualVat: number
  manualTotal: number
}

let nextId = 2
function emptyItem(): LineItem {
  return { id: nextId++, ikpu: '', description: '', barcode: '', marking: '', dispensing: '', series: '', unit: 'Штук', qty: 0, basePrice: 0, markup: 0, origin: '', price: 0, exciseRate: 0, vat: 12, lgota: '', warehouse: '', manualSupply: 0, manualVat: 0, manualTotal: 0 }
}

const field =
  'w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none placeholder:text-gray-400 focus:border-Smart-blue'
const cellInput = 'bg-transparent outline-none'

function Fld({ label, value, required, dropdown, date, disabled, showErrors }: { label: string; value?: string; required?: boolean; dropdown?: boolean; date?: boolean; disabled?: boolean; showErrors?: boolean }) {
  const [val, setVal] = useState(value ?? '')
  const error = Boolean(required && showErrors && !disabled && !String(val).trim())
  return (
    <div>
      <div className={cn('relative flex flex-col rounded-lg border px-3.5 py-1.5', error ? 'border-red-400 bg-red-50' : disabled ? 'border-gray-200 bg-gray-50' : 'border-gray-300 bg-white')}>
        <span className="text-xs text-gray-500">
          {required && <span className="text-red-500">*</span>}
          {label}
        </span>
        <input value={val} onChange={(e) => setVal(e.target.value)} disabled={disabled} type={date ? 'date' : 'text'} className={cn('w-full bg-transparent text-sm outline-none', disabled ? 'text-gray-400' : 'text-slate-800')} />
        {dropdown && <ChevronDown className="pointer-events-none absolute right-3 top-4 size-4 text-gray-400" />}
      </div>
      {error && <p className="mt-1 text-xs text-red-500">Обязательное поле</p>}
    </div>
  )
}

/** Required plain input that shows the «Обязательное поле» error on submit. */
function Req({ placeholder, required, showErrors, date, disabled, search }: { placeholder: string; required?: boolean; showErrors?: boolean; date?: boolean; disabled?: boolean; search?: boolean }) {
  const [val, setVal] = useState('')
  const error = Boolean(required && showErrors && !disabled && !val.trim())
  return (
    <div>
      <div className={cn('flex items-stretch', search && 'rounded-lg')}>
        <div className="relative flex-1">
          {search && <Search className="pointer-events-none absolute left-3.5 top-3 size-5 text-gray-400" />}
          <input
            value={val}
            onChange={(e) => setVal(e.target.value)}
            disabled={disabled}
            type={date ? 'date' : 'text'}
            placeholder={placeholder}
            className={cn(field, search && 'rounded-r-none pl-10', error && 'border-red-400 bg-red-50', disabled && 'bg-gray-50 text-gray-400')}
          />
        </div>
        {search && (
          <button disabled={disabled} className={cn('flex items-center justify-center rounded-r-lg px-3.5 text-white', disabled ? 'bg-gray-300' : 'bg-Smart-blue')}>
            <Search className="size-5" />
          </button>
        )}
      </div>
      {error && <p className="mt-1 text-xs text-red-500">Обязательное поле</p>}
    </div>
  )
}

/** Didox-style radio/checkbox — a solid filled dot when on. */
function Dot({ checked, onChange, children }: { checked: boolean; onChange: () => void; children: React.ReactNode }) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600" onClick={onChange}>
      <span className={cn('size-4 shrink-0 rounded-full border', checked ? 'border-Smart-blue bg-Smart-blue' : 'border-gray-300 bg-white')} />
      {children}
    </label>
  )
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-4 rounded-md bg-white p-6 shadow-[0px_1px_2px_0px_rgba(16,24,40,0.06)]">
      <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
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

function OrgFields({ own, disabled, showErrors }: { own: boolean; disabled?: boolean; showErrors?: boolean }) {
  return (
    <>
      <Fld label="Название" required showErrors={showErrors} disabled={disabled} value={own ? '"UDEVS" MCHJ' : undefined} />
      <Fld label="Регистрационный код плательщика НДС" disabled={disabled} value={own ? '326090125584' : undefined} />
      <div className="grid grid-cols-2 gap-4">
        <Fld label="Расчётный счёт" dropdown disabled={disabled} value={own ? '20208000505191969001' : undefined} />
        <Fld label="МФО, SWIFT и др." dropdown disabled={disabled} value={own ? '01095' : undefined} />
      </div>
      <Fld label="Название банка" disabled={disabled} value={own ? 'ТОШКЕНТ Ш., "ASIA ALLIANCE BANK" АТ БАНКИ' : undefined} />
      <Fld label="Адрес" required showErrors={showErrors} disabled={disabled} value={own ? 'ТОШКЕНТ ШАҲАР ОЛМАЗОР ТУМАНИ Yangi Olmazor ko\'chasi' : undefined} />
      <div className="grid grid-cols-2 gap-4">
        <Fld label="Директор" disabled={disabled} value={own ? 'BAXODIROV AZIZBEK' : undefined} />
        <Fld label="Глав. бух." disabled={disabled} />
      </div>
    </>
  )
}

export default function CreateDocumentPage() {
  const navigate = useNavigate()
  const [docType, setDocType] = useState<string>('Счет-фактура без акта')
  const [variant, setVariant] = useState(VARIANTS[0])

  const [flags, setFlags] = useState({
    komissioner: false,
    lgota: false,
    excise: false, // shared: "Акциз" in Ваши сведения AND in the items toolbar
    odnostoronniy: false,
    lot: false,
    reverse: false,
    marked: false,
    manual: false,
  })
  const toggle = (k: keyof typeof flags) => setFlags((f) => ({ ...f, [k]: !f[k] }))
  function toggleLgota() {
    const turningOn = !flags.lgota
    setFlags((f) => ({ ...f, lgota: turningOn }))
    // Есть льгота → НДС becomes «Без НДС» (like Didox)
    setItems((prev) => prev.map((it) => ({ ...it, vat: turningOn ? -1 : 12 })))
  }

  const [exciseMode, setExciseMode] = useState<'percent' | 'sum'>('percent')
  const [items, setItems] = useState<LineItem[]>([emptyItem()])

  // Marking modal
  const [markingRow, setMarkingRow] = useState<number | null>(null)
  const [markCodes, setMarkCodes] = useState<string[]>([''])
  const [markOrderId, setMarkOrderId] = useState('')

  const showExcise = flags.excise
  const showMarking = flags.marked
  const showLgota = flags.lgota
  const manual = flags.manual
  const isFarm = docType === 'Счет-фактура (ФАРМ)'
  const vcfg = VARIANT_OVERRIDES[docType]?.[variant] ?? VARIANT_CONFIG[variant] ?? { contract: true }
  const showContract = vcfg.contract
  const special = vcfg.special
  const [showErrors, setShowErrors] = useState(false)
  const itemErr = (v: string) => showErrors && !String(v).trim()

  // ТТН and Гибридная are completely different forms.
  if (docType === 'Товарно-транспортная накладная') {
    return <TtnForm docType={docType} onDocType={setDocType} />
  }
  if (docType === 'Гибридная счет-фактура' || docType === 'Гибридная счет-фактура (ФАРМ)') {
    return <HybridForm docType={docType} onDocType={setDocType} />
  }
  if (docType === 'ЭСФ для строительно-монтажных работ') {
    return <SmrForm docType={docType} onDocType={setDocType} />
  }
  if (docType === 'ТТН (новый)') {
    return <TtnNewForm docType={docType} onDocType={setDocType} />
  }
  if (docType === 'Акт') {
    return <ActForm docType={docType} onDocType={setDocType} />
  }
  if (docType === 'Доверенность') {
    return <DoverennostForm docType={docType} onDocType={setDocType} />
  }
  if (docType === 'Доверенность (новая)') {
    return <DoverennostNewForm docType={docType} onDocType={setDocType} />
  }
  if (docType === 'Договор (ГНК)') {
    return <DogovorForm docType={docType} onDocType={setDocType} />
  }
  if (docType === 'Произвольный документ') {
    return <ProizvolnyForm docType={docType} onDocType={setDocType} />
  }
  if (docType === 'Многосторонний произвольный документ') {
    return <MultiProizvolnyForm docType={docType} onDocType={setDocType} />
  }
  if (docType === 'Протокол собрания учредителей') {
    return <ProtokolForm docType={docType} onDocType={setDocType} />
  }
  if (docType === 'Письмо (НК)') {
    return <PismoNKForm docType={docType} onDocType={setDocType} />
  }
  if (docType === 'Акт сверки') {
    return <AktSverkiForm docType={docType} onDocType={setDocType} />
  }

  function updateItem(id: number, patch: Partial<LineItem>) {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, ...patch } : it)))
  }
  function removeItem(id: number) {
    setItems((prev) => prev.filter((it) => it.id !== id))
  }

  const rowSupply = (it: LineItem) => (manual ? it.manualSupply : it.qty * it.price)
  const rowExcise = (it: LineItem) => (!showExcise ? 0 : exciseMode === 'percent' ? (rowSupply(it) * it.exciseRate) / 100 : it.exciseRate)
  const rowVat = (it: LineItem) => (manual ? it.manualVat : it.vat > 0 ? (rowSupply(it) * it.vat) / 100 : 0)
  const rowTotal = (it: LineItem) => (manual ? it.manualTotal : rowSupply(it) + rowExcise(it) + rowVat(it))
  const totalSupply = items.reduce((s, it) => s + rowSupply(it), 0)
  const grandTotal = items.reduce((s, it) => s + rowTotal(it), 0)

  const cellCls = 'border-b border-r border-gray-200 px-3 py-2 text-sm'

  function openMarking(id: number) {
    setMarkingRow(id)
    setMarkOrderId('')
    setMarkCodes([''])
  }
  function saveMarking() {
    if (markingRow !== null) {
      const codes = markCodes.filter(Boolean)
      updateItem(markingRow, { marking: codes.length ? codes.join(', ') : '' })
    }
    setMarkingRow(null)
  }

  type Col = { key: string; header: React.ReactNode; show?: boolean; cls?: string | ((it: LineItem) => string | undefined); cell: (it: LineItem, i: number) => React.ReactNode }
  const cols: Col[] = (
    [
      { key: 'num', header: '№', cls: 'text-center text-zinc-700', cell: (_it, i) => i + 1 },
      { key: 'ikpu', header: 'ИКПУ и наименование товаров (работ, услуг) *', cls: (it: LineItem) => itemErr(it.ikpu) ? 'bg-red-50' : undefined, cell: (it) => <input value={it.ikpu} onChange={(e) => updateItem(it.id, { ikpu: e.target.value })} placeholder="ИКПУ" className={cn(cellInput, 'w-56')} /> },
      { key: 'description', header: 'Описание товаров (работ, услуг) *', cls: (it: LineItem) => itemErr(it.description) ? 'bg-red-50' : undefined, cell: (it) => <input value={it.description} onChange={(e) => updateItem(it.id, { description: e.target.value })} placeholder="Описание" className={cn(cellInput, 'w-40')} /> },
      { key: 'barcode', header: 'Штрих код товара/услуги', cell: (it) => <input value={it.barcode} onChange={(e) => updateItem(it.id, { barcode: e.target.value })} placeholder="—" className={cn(cellInput, 'w-24')} /> },
      { key: 'dispensing', header: 'Отпуск лекарственных средств *', show: isFarm, cell: (it) => <select value={it.dispensing} onChange={(e) => updateItem(it.id, { dispensing: e.target.value })} className={cn(cellInput, 'w-40', !it.dispensing && 'text-gray-400')}><option value="">Выберите</option>{DISPENSING.map((d) => <option key={d}>{d}</option>)}</select> },
      {
        key: 'marking', header: 'Маркировка', show: showMarking, cell: (it) => (
          <button onClick={() => openMarking(it.id)} className="flex items-center gap-1.5 text-left text-slate-600">
            <span className={it.marking ? 'text-Smart-green' : 'text-gray-500'}>{it.marking ? 'Маркирован' : 'Не маркирован'}</span>
            <Pencil className="size-3.5 text-Smart-blue" />
          </button>
        ),
      },
      { key: 'series', header: 'Серия', show: isFarm, cell: (it) => <input value={it.series} onChange={(e) => updateItem(it.id, { series: e.target.value })} placeholder="—" className={cn(cellInput, 'w-24')} /> },
      { key: 'unit', header: 'Ед. измер. *', cell: (it) => <select value={it.unit} onChange={(e) => updateItem(it.id, { unit: e.target.value })} className={cellInput}>{UNITS.map((u) => <option key={u}>{u}</option>)}</select> },
      { key: 'qty', header: 'Кол-во', cell: (it) => <input value={it.qty || ''} onChange={(e) => updateItem(it.id, { qty: num(e.target.value) })} className={cn(cellInput, 'w-14 text-right')} /> },
      { key: 'basePrice', header: 'Базовая цена', show: isFarm, cell: (it) => <input value={it.basePrice || ''} onChange={(e) => updateItem(it.id, { basePrice: num(e.target.value) })} className={cn(cellInput, 'w-24 text-right')} /> },
      { key: 'markup', header: 'Наценка, %', show: isFarm, cell: (it) => <input value={it.markup || ''} onChange={(e) => updateItem(it.id, { markup: num(e.target.value) })} className={cn(cellInput, 'w-16 text-right')} /> },
      { key: 'price', header: 'Цена *', cls: (it: LineItem) => (showErrors && !it.price ? 'bg-red-50 text-right' : 'text-right'), cell: (it) => <input value={it.price || ''} onChange={(e) => updateItem(it.id, { price: num(e.target.value) })} className={cn(cellInput, 'w-24 text-right')} /> },
      {
        key: 'exciseRate', show: showExcise,
        header: (
          <div className="flex flex-col gap-1">
            <span>Ставка акцизного налога</span>
            <select value={exciseMode} onChange={(e) => setExciseMode(e.target.value as 'percent' | 'sum')} className="rounded border border-gray-300 px-1 py-0.5 text-xs font-normal">
              <option value="percent">В процентах</option>
              <option value="sum">В сумме</option>
            </select>
          </div>
        ),
        cell: (it) => <input value={it.exciseRate || ''} onChange={(e) => updateItem(it.id, { exciseRate: num(e.target.value) })} placeholder="0" className={cn(cellInput, 'w-20 text-right')} />,
      },
      { key: 'exciseSum', header: 'Акциз, сумма', show: showExcise, cls: 'bg-gray-50 text-right text-zinc-700', cell: (it) => money(rowExcise(it)) },
      {
        key: 'supply', header: 'Стоимость поставки *', cls: 'text-right text-zinc-700',
        cell: (it) => manual ? <input value={it.manualSupply || ''} onChange={(e) => updateItem(it.id, { manualSupply: num(e.target.value) })} className={cn(cellInput, 'w-28 text-right')} /> : money(rowSupply(it)),
      },
      { key: 'vat', header: 'Ндс, %', cell: (it) => <select value={it.vat} onChange={(e) => updateItem(it.id, { vat: Number(e.target.value) })} className={cellInput}>{VAT_RATES.map((r) => <option key={r} value={r}>{vatLabel(r)}</option>)}</select> },
      {
        key: 'vatsum', header: 'Ндс, Сумма *', cls: 'text-right text-zinc-700',
        cell: (it) => manual ? <input value={it.manualVat || ''} onChange={(e) => updateItem(it.id, { manualVat: num(e.target.value) })} className={cn(cellInput, 'w-24 text-right')} /> : money(rowVat(it)),
      },
      {
        key: 'total', header: 'Всего *', cls: 'text-right font-medium text-zinc-900',
        cell: (it) => manual ? <input value={it.manualTotal || ''} onChange={(e) => updateItem(it.id, { manualTotal: num(e.target.value) })} className={cn(cellInput, 'w-24 text-right')} /> : money(rowTotal(it)),
      },
      { key: 'lgota', header: 'Льгота', show: showLgota, cell: (it) => <input value={it.lgota} onChange={(e) => updateItem(it.id, { lgota: e.target.value })} placeholder="Код льготы" className={cn(cellInput, 'w-32')} /> },
      { key: 'warehouse', header: 'Склад', cell: (it) => <input value={it.warehouse} onChange={(e) => updateItem(it.id, { warehouse: e.target.value })} placeholder="—" className={cn(cellInput, 'w-24')} /> },
      { key: 'origin', header: 'Происхождение товара *', show: flags.lot, cell: (it) => <select value={it.origin} onChange={(e) => updateItem(it.id, { origin: e.target.value })} className={cn(cellInput, 'w-40', !it.origin && 'text-gray-400')}><option value="">Выберите</option>{ORIGIN.map((o) => <option key={o}>{o}</option>)}</select> },
      { key: 'actions', header: '', cls: 'text-center', cell: (it) => (
        <div className="flex items-center justify-center gap-1">
          <button onClick={() => removeItem(it.id)} className="flex size-7 items-center justify-center rounded-full border border-red-200 text-red-500 transition hover:bg-red-50" aria-label="Удалить строку">
            <Minus className="size-4" />
          </button>
          <button onClick={() => setItems((prev) => [...prev, emptyItem()])} className="flex size-7 items-center justify-center rounded-full border border-green-200 text-Smart-green transition hover:bg-green-50" aria-label="Добавить строку">
            <Plus className="size-4" />
          </button>
        </div>
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
            <Req placeholder="Номер счёт-фактуры *" required showErrors={showErrors} />
            {showContract && <Req placeholder="Номер контракта *" required showErrors={showErrors} />}
          </div>
          <div className="flex flex-col gap-4">
            <Req placeholder="Дата документа *" date required showErrors={showErrors} />
            {showContract && <Req placeholder="Дата контракта *" date required showErrors={showErrors} />}
          </div>
          <div className="flex flex-col gap-4">
            {special && <Req placeholder={`${special.label}${special.required ? ' *' : ''}`} required={special.required} showErrors={showErrors} />}
            <Req placeholder="ID договора" search />
            <Req placeholder="ТТН ИД" search />
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
              <Dot checked={flags.komissioner} onChange={() => toggle('komissioner')}>Комиссионер (Доверенное лицо)</Dot>
              <Dot checked={flags.lgota} onChange={toggleLgota}>Есть льгота</Dot>
              {!isFarm && <Dot checked={flags.excise} onChange={() => toggle('excise')}>Акциз</Dot>}
            </div>
          </Card>

          {flags.komissioner && (
            <Card title="Посредник (Комиссионер)">
              <div className="flex items-stretch">
                <input className={cn(field, 'rounded-r-none')} placeholder="ИНН / ПИНФЛ посредника" />
                <button className="flex items-center justify-center rounded-r-lg bg-Smart-blue px-3.5 text-white"><Search className="size-5" /></button>
              </div>
              <input className={field} placeholder="Наименование посредника" />
            </Card>
          )}

          <Card title="Компания"><OrgFields own showErrors={showErrors} /></Card>

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
            <Req placeholder="ИНН / ПИНФЛ *" search required={!flags.odnostoronniy} disabled={flags.odnostoronniy} showErrors={showErrors} />
            <div className="flex flex-wrap items-center gap-6">
              <Dot checked={flags.odnostoronniy} onChange={() => toggle('odnostoronniy')}>Односторонний документ</Dot>
              <Dot checked={flags.lot} onChange={() => toggle('lot')}>Лот присутствует</Dot>
            </div>
            {flags.odnostoronniy && (
              <div className="relative">
                <select className={cn(field, 'appearance-none pr-9 text-gray-500')} defaultValue="">
                  <option value="" disabled>Тип одностороннего документа *</option>
                  {ONESIDED_TYPES.map((t) => <option key={t}>{t}</option>)}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-3 size-5 text-gray-400" />
              </div>
            )}
            {flags.lot && (
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

          <Card title="Компания партнёра"><OrgFields own={false} disabled={flags.odnostoronniy} showErrors={showErrors} /></Card>
        </div>
      </div>

      {/* Line items */}
      <div className="rounded-md border border-gray-200 bg-white">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 px-6 py-4">
          <div className="flex flex-wrap items-center gap-6">
            <Dot checked={flags.reverse} onChange={() => toggle('reverse')}>Обратный расчёт</Dot>
            {!isFarm && <Dot checked={flags.excise} onChange={() => toggle('excise')}>Акциз</Dot>}
            <Dot checked={flags.marked} onChange={() => toggle('marked')}>Товар маркирован</Dot>
            <Dot checked={flags.manual} onChange={() => toggle('manual')}>Ручное вычисление</Dot>
            {flags.marked && (
              <button onClick={() => openMarking(items[0]?.id ?? 0)} className="flex items-center gap-1.5 rounded-md bg-Smart-blue px-3 py-1.5 text-sm font-medium text-white">
                <Plus className="size-4" /> Маркировка
              </button>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-1.5 text-sm font-medium text-Smart-blue">Коды ИКПУ <ArrowUpRight className="size-4" /></button>
            <button onClick={() => setItems((prev) => [...prev, emptyItem()])} className="flex items-center gap-2 rounded-md bg-blue-800 px-3 py-1.5 text-sm font-medium text-white transition hover:brightness-110">
              <Plus className="size-5" /> Добавить
            </button>
          </div>
        </div>

        <div className="overflow-x-auto p-4">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                {cols.map((c) => (
                  <th key={c.key} className="border-b border-r border-gray-200 px-3 py-3 text-left align-top text-sm font-semibold text-zinc-900 last:border-r-0">{c.header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((it, idx) => (
                <tr key={it.id}>
                  {cols.map((c) => (
                    <td key={c.key} className={cn(cellCls, typeof c.cls === 'function' ? c.cls(it) : c.cls)}>{c.cell(it, idx)}</td>
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
          <span className="size-4 rounded-full border border-gray-300" />
          Счёт-фактура с актом
        </label>
        <div className="flex items-center gap-3">
          <button onClick={() => setShowErrors(true)} className="rounded-lg bg-Smart-blue px-6 py-2.5 text-sm font-semibold text-white transition hover:brightness-105">Сохранить</button>
          <button onClick={() => setShowErrors(true)} className="rounded-lg bg-Smart-green px-6 py-2.5 text-sm font-semibold text-white transition hover:brightness-105">Подписать</button>
          <button onClick={() => navigate(-1)} className="rounded-lg border border-red-300 px-6 py-2.5 text-sm font-semibold text-red-500 transition hover:bg-red-50">Отмена</button>
        </div>
      </div>

      {/* Marking modal */}
      <Modal open={markingRow !== null} onClose={() => setMarkingRow(null)} title="Введите код маркировки" maxWidth="max-w-xl">
        <div className="flex flex-col gap-4 p-6">
          <div className="flex items-stretch gap-2">
            <input value={markOrderId} onChange={(e) => setMarkOrderId(e.target.value)} className={field} placeholder="ID заказа" />
            <button className="flex items-center justify-center rounded-lg border border-gray-200 px-3.5 text-gray-500 hover:bg-gray-50"><Search className="size-5" /></button>
          </div>
          {markCodes.map((code, i) => (
            <div key={i} className="flex items-stretch gap-2">
              <input value={code} onChange={(e) => setMarkCodes((c) => c.map((x, j) => (j === i ? e.target.value : x)))} className={field} placeholder="Код маркировки" />
              <button onClick={() => setMarkCodes((c) => [...c, ''])} className="flex items-center justify-center rounded-lg border border-gray-200 px-3.5 text-Smart-green hover:bg-gray-50"><Plus className="size-5" /></button>
              <button onClick={() => setMarkCodes((c) => (c.length > 1 ? c.filter((_, j) => j !== i) : c))} className="flex items-center justify-center rounded-lg border border-gray-200 px-3.5 text-red-500 hover:bg-red-50"><Trash2 className="size-5" /></button>
            </div>
          ))}
          <div className="flex justify-center gap-3 pt-2">
            <button onClick={() => setMarkingRow(null)} className="rounded-lg bg-slate-400 px-6 py-2.5 text-sm font-semibold text-white hover:brightness-105">Закрыть</button>
            <button onClick={saveMarking} className="rounded-lg bg-Smart-blue px-6 py-2.5 text-sm font-semibold text-white hover:brightness-105">Сохранить</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
