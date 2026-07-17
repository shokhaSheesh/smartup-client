import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronDown, Plus, Trash2, Check, HelpCircle, Pencil, Search } from 'lucide-react'
import { PillSelect } from '@/components/ui/PillSelect'
import { Modal } from '@/components/ui/Modal'
import { DOC_TYPES } from '@/data/docTypes'
import { cn } from '@/lib/cn'

const HYBRID_VARIANTS = ['Стандартный', 'Дополнительный', 'Исправленный']
const UNITS = ['Штук', 'кг', 'литр', 'метр', 'услуга']
const VAT_RATES = [-1, 0, 12, 15]
const vatLabel = (r: number) => (r < 0 ? 'Без НДС' : `${r}%`)
const ORIGIN = ['Отечественный товар', 'Импортный товар', 'Товар из СЭЗ']
const DISPENSING = ['Оптовая реализация', 'Розничная реализация', 'Льготный отпуск']

const cellInput = 'bg-transparent outline-none'

function num(v: string): number {
  const n = Number(v.replace(/\s/g, '').replace(',', '.'))
  return Number.isFinite(n) ? n : 0
}
function money(n: number): string {
  return n.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

/** Floating-label field (Didox hybrid style). */
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

function CheckBox({ checked, onChange, children }: { checked: boolean; onChange: () => void; children: React.ReactNode }) {
  return (
    <label className="flex cursor-pointer items-start gap-2 text-sm text-slate-700" onClick={onChange}>
      <span className={cn('mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-sm border', checked ? 'border-Smart-blue bg-Smart-blue text-white' : 'border-gray-300 bg-white')}>
        {checked && <Check className="size-3" strokeWidth={3} />}
      </span>
      {children}
    </label>
  )
}

function Radio({ checked, onChange, disabled, children }: { checked: boolean; onChange: () => void; disabled?: boolean; children: React.ReactNode }) {
  return (
    <label className={cn('flex items-center gap-2 text-sm', disabled ? 'cursor-not-allowed text-gray-300' : 'cursor-pointer text-slate-600')} onClick={disabled ? undefined : onChange}>
      <span className={cn('size-4 shrink-0 rounded-full border', checked ? 'border-Smart-blue bg-Smart-blue' : disabled ? 'border-gray-200' : 'border-gray-300 bg-white')} />
      {children}
    </label>
  )
}

function Card({ title, help, extra, children }: { title?: string; help?: boolean; extra?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="rounded-md bg-white p-6 shadow-[0px_1px_2px_0px_rgba(16,24,40,0.06)]">
      {title && (
        <div className="mb-4 flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-800">{title}{help && <HelpCircle className="size-4 text-gray-300" />}</h3>
          {extra}
        </div>
      )}
      {children}
    </div>
  )
}

type LineItem = {
  id: number
  komInn: string; komName: string; komVat: string
  ikpu: string; description: string; barcode: string; marking: string
  dispensing: string; series: string; basePrice: number; markup: number
  unit: string; qty: number; price: number; exciseRate: number
  vat: number; lgota: string; warehouse: string; origin: string
}
let nextId = 2
function emptyItem(): LineItem {
  return { id: nextId++, komInn: '', komName: '', komVat: '', ikpu: '', description: '', barcode: '', marking: '', dispensing: '', series: '', basePrice: 0, markup: 0, unit: 'Штук', qty: 0, price: 0, exciseRate: 0, vat: -1, lgota: '', warehouse: '', origin: '' }
}

export default function HybridForm({ docType, onDocType }: { docType: string; onDocType: (v: string) => void }) {
  const navigate = useNavigate()
  const [variant, setVariant] = useState(HYBRID_VARIANTS[0])
  const [flags, setFlags] = useState({ komissioner: false, lgota: false, excise: false, reverse: false, marked: false, manual: false })
  const toggle = (k: keyof typeof flags) => setFlags((f) => ({ ...f, [k]: !f[k] }))
  const [exciseMode, setExciseMode] = useState<'percent' | 'sum'>('sum')
  const [expIsCarrier, setExpIsCarrier] = useState(false)
  const [semi, setSemi] = useState(false)
  const [otherOwners, setOtherOwners] = useState(false)
  const [trailer, setTrailer] = useState(false)
  const [driverIsResp, setDriverIsResp] = useState(false)
  const [items, setItems] = useState<LineItem[]>([emptyItem()])
  const [markingRow, setMarkingRow] = useState<number | null>(null)
  const [markCodes, setMarkCodes] = useState<string[]>([''])
  const [markOrderId, setMarkOrderId] = useState('')

  const isAmendment = variant !== 'Стандартный'
  const isFarm = docType === 'Гибридная счет-фактура (ФАРМ)'

  const field = 'w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none placeholder:text-gray-400 focus:border-Smart-blue'
  function openMarking(id: number) { setMarkingRow(id); setMarkOrderId(''); setMarkCodes(['']) }
  function saveMarking() {
    if (markingRow !== null) {
      const codes = markCodes.filter(Boolean)
      updateItem(markingRow, { marking: codes.length ? codes.join(', ') : '' })
    }
    setMarkingRow(null)
  }

  function updateItem(id: number, patch: Partial<LineItem>) {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, ...patch } : it)))
  }
  const rowSupply = (it: LineItem) => it.qty * it.price
  const rowExcise = (it: LineItem) => (!flags.excise ? 0 : exciseMode === 'percent' ? (rowSupply(it) * it.exciseRate) / 100 : it.exciseRate)
  const rowVat = (it: LineItem) => (it.vat > 0 ? (rowSupply(it) * it.vat) / 100 : 0)
  const rowTotal = (it: LineItem) => rowSupply(it) + rowExcise(it) + rowVat(it)
  const totalSupply = items.reduce((s, it) => s + rowSupply(it), 0)
  const totalVat = items.reduce((s, it) => s + rowVat(it), 0)

  const cellCls = 'border-b border-r border-gray-200 px-3 py-2 text-sm'
  type Col = { key: string; header: React.ReactNode; show?: boolean; cls?: string; cell: (it: LineItem, i: number) => React.ReactNode }
  const cols: Col[] = ([
    { key: 'num', header: '№', cls: 'text-center text-zinc-700', cell: (_it, i) => i + 1 },
    { key: 'komInn', header: 'ИНН/ПИНФЛ комитента *', show: flags.komissioner, cell: (it) => <input value={it.komInn} onChange={(e) => updateItem(it.id, { komInn: e.target.value })} className={cn(cellInput, 'w-28')} /> },
    { key: 'komName', header: 'Наименование комитента *', show: flags.komissioner, cell: (it) => <input value={it.komName} onChange={(e) => updateItem(it.id, { komName: e.target.value })} className={cn(cellInput, 'w-36')} /> },
    { key: 'komVat', header: 'Рег. код плательщика НДС комитента', show: flags.komissioner, cell: (it) => <input value={it.komVat} onChange={(e) => updateItem(it.id, { komVat: e.target.value })} className={cn(cellInput, 'w-28')} /> },
    { key: 'ikpu', header: 'ИКПУ и наименование товаров *', cell: (it) => <input value={it.ikpu} onChange={(e) => updateItem(it.id, { ikpu: e.target.value })} placeholder="ИКПУ" className={cn(cellInput, 'w-48')} /> },
    { key: 'description', header: 'Описание товаров *', cell: (it) => <input value={it.description} onChange={(e) => updateItem(it.id, { description: e.target.value })} className={cn(cellInput, 'w-36')} /> },
    { key: 'barcode', header: 'Штрих код товара/услуги', cell: (it) => <input value={it.barcode} onChange={(e) => updateItem(it.id, { barcode: e.target.value })} placeholder="—" className={cn(cellInput, 'w-24')} /> },
    { key: 'dispensing', header: 'Отпуск лекарственных средств *', show: isFarm, cell: (it) => <select value={it.dispensing} onChange={(e) => updateItem(it.id, { dispensing: e.target.value })} className={cn(cellInput, 'w-40', !it.dispensing && 'text-gray-400')}><option value="">Выберите</option>{DISPENSING.map((d) => <option key={d}>{d}</option>)}</select> },
    { key: 'series', header: 'Серия *', show: isFarm, cell: (it) => <input value={it.series} onChange={(e) => updateItem(it.id, { series: e.target.value })} placeholder="—" className={cn(cellInput, 'w-24')} /> },
    {
      key: 'marking', header: 'Маркировки', show: flags.marked, cell: (it) => (
        <button onClick={() => openMarking(it.id)} className="flex items-center gap-1.5 text-left">
          <span className={it.marking ? 'text-Smart-green' : 'text-gray-500'}>{it.marking ? 'Маркирован' : 'Немаркирован'}</span>
          <Pencil className="size-3.5 text-Smart-blue" />
        </button>
      ),
    },
    { key: 'unit', header: 'Ед. изм. *', cell: (it) => <select value={it.unit} onChange={(e) => updateItem(it.id, { unit: e.target.value })} className={cellInput}>{UNITS.map((u) => <option key={u}>{u}</option>)}</select> },
    { key: 'qty', header: 'Кол-во', cell: (it) => <input value={it.qty || ''} onChange={(e) => updateItem(it.id, { qty: num(e.target.value) })} className={cn(cellInput, 'w-14 text-right')} /> },
    { key: 'basePrice', header: 'Базовая цена', show: isFarm, cell: (it) => <input value={it.basePrice || ''} onChange={(e) => updateItem(it.id, { basePrice: num(e.target.value) })} className={cn(cellInput, 'w-24 text-right')} /> },
    { key: 'markup', header: 'Наценка %', show: isFarm, cell: (it) => <input value={it.markup || ''} onChange={(e) => updateItem(it.id, { markup: num(e.target.value) })} className={cn(cellInput, 'w-16 text-right')} /> },
    { key: 'price', header: 'Цена *', cls: 'text-right', cell: (it) => <input value={it.price || ''} onChange={(e) => updateItem(it.id, { price: num(e.target.value) })} className={cn(cellInput, 'w-24 text-right')} /> },
    {
      key: 'exciseRate', show: flags.excise,
      header: (<div className="flex flex-col gap-1"><span>Акциз, ставка</span><select value={exciseMode} onChange={(e) => setExciseMode(e.target.value as 'percent' | 'sum')} className="rounded border border-gray-300 px-1 py-0.5 text-xs font-normal"><option value="sum">Сумма</option><option value="percent">В процентах</option></select></div>),
      cell: (it) => <input value={it.exciseRate || ''} onChange={(e) => updateItem(it.id, { exciseRate: num(e.target.value) })} placeholder="0" className={cn(cellInput, 'w-20 text-right')} />,
    },
    { key: 'exciseSum', header: 'Акциз, сумма', show: flags.excise, cls: 'bg-gray-50 text-right text-zinc-700', cell: (it) => money(rowExcise(it)) },
    { key: 'supply', header: 'Стоимость поставки *', cls: 'text-right text-zinc-700', cell: (it) => money(rowSupply(it)) },
    { key: 'vat', header: 'НДС, %', cell: (it) => <select value={it.vat} onChange={(e) => updateItem(it.id, { vat: Number(e.target.value) })} className={cellInput}>{VAT_RATES.map((r) => <option key={r} value={r}>{vatLabel(r)}</option>)}</select> },
    { key: 'vatsum', header: 'Сумма НДС *', cls: 'text-right text-zinc-700', cell: (it) => money(rowVat(it)) },
    { key: 'total', header: 'Всего *', cls: 'text-right font-medium text-zinc-900', cell: (it) => money(rowTotal(it)) },
    { key: 'lgota', header: 'Льгота *', show: flags.lgota, cell: (it) => <input value={it.lgota} onChange={(e) => updateItem(it.id, { lgota: e.target.value })} placeholder="Код" className={cn(cellInput, 'w-24')} /> },
    { key: 'warehouse', header: 'Склад', cell: (it) => <input value={it.warehouse} onChange={(e) => updateItem(it.id, { warehouse: e.target.value })} placeholder="—" className={cn(cellInput, 'w-24')} /> },
    { key: 'origin', header: 'Происхождение товара *', cell: (it) => <select value={it.origin} onChange={(e) => updateItem(it.id, { origin: e.target.value })} className={cn(cellInput, 'w-36', !it.origin && 'text-gray-400')}><option value="">Выберите</option>{ORIGIN.map((o) => <option key={o}>{o}</option>)}</select> },
    { key: 'actions', header: '', cls: 'text-center', cell: (it) => (
      <div className="flex items-center justify-center gap-1">
        <button onClick={() => setItems((p) => p.filter((x) => x.id !== it.id))} className="flex size-7 items-center justify-center rounded-md border border-gray-200 text-red-500 hover:bg-red-50"><Trash2 className="size-4" /></button>
        <button onClick={() => setItems((p) => [...p, emptyItem()])} className="flex size-7 items-center justify-center rounded-md border border-green-200 text-Smart-green hover:bg-green-50"><Plus className="size-4" /></button>
      </div>
    ) },
  ] as Col[]).filter((c) => c.show !== false)
  const supplyIdx = cols.findIndex((c) => c.key === 'supply')

  return (
    <div className="flex flex-col gap-4">
      {/* Type header */}
      <Card>
        <div className="mb-6 flex flex-wrap items-center gap-4">
          <span className="text-lg font-semibold text-black/80">Тип документа:</span>
          <PillSelect options={[...DOC_TYPES]} value={docType} onChange={onDocType} />
          <PillSelect options={HYBRID_VARIANTS} value={variant} onChange={setVariant} />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:max-w-2xl">
          <LF label="Номер счёт-фактуры" required />
          <LF label="Дата документа" required date />
          {isAmendment && <LF label="ID старой счёт-фактуры" required />}
          <LF label="Номер контракта" required />
          <LF label="Дата контракта" required date />
        </div>
      </Card>

      {/* Ваши сведения / партнёр */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card title="Ваши сведения">
          <div className="flex flex-col gap-3">
            <LF label="ИНН/ПИНФЛ" value="307205394" disabled />
            <div className="rounded-lg border border-Smart-green px-3.5 py-2.5 text-sm text-slate-700">Статус: Плательщик НДС+ (сертификат активный)</div>
            <div className="flex flex-wrap items-center gap-6 py-1">
              <CheckBox checked={flags.komissioner} onChange={() => toggle('komissioner')}>Комиссионер</CheckBox>
              <CheckBox checked={flags.lgota} onChange={() => toggle('lgota')}>Есть льгота</CheckBox>
              {!isFarm && <CheckBox checked={flags.excise} onChange={() => toggle('excise')}>Акциз</CheckBox>}
            </div>
            <LF label="Наименование компании" required value='"UDEVS" MCHJ' />
            <LF label="Регистрационный код плательщика НДС" value="326090125584" />
            <div className="grid grid-cols-2 gap-3"><LF label="Расчётный счёт" dropdown value="20208000505191969001" /><LF label="МФО, SWIFT и др." value="01095" /></div>
            <LF label="Название банка" value='ТОШКЕНТ Ш., "ASIA ALLIANCE BANK" АТ БАНКИ' />
            <LF label="Адрес" required value="ТОШКЕНТ ШАҲАР ОЛМАЗОР ТУМАНИ" />
            <div className="grid grid-cols-2 gap-3"><LF label="Директор" value="BAXODIROV AZIZBEK" /><LF label="Глав. бух." required /></div>
            <h4 className="pt-2 text-base font-semibold text-slate-800">Товар отпустил</h4>
            <div className="grid grid-cols-2 gap-3"><LF label="ИНН/ПИНФЛ" /><LF label="ФИО" /></div>
          </div>
        </Card>

        <Card title="Сведения о партнере">
          <div className="flex flex-col gap-3">
            <LF label="ИНН/ПИНФЛ" required />
            <LF label="Наименование компании" required />
            <LF label="Регистрационный код плательщика НДС" />
            <div className="grid grid-cols-2 gap-3"><LF label="Расчётный счёт" dropdown /><LF label="МФО, SWIFT и др." /></div>
            <LF label="Название банка" />
            <LF label="Адрес" required />
            <div className="grid grid-cols-2 gap-3"><LF label="Директор" required /><LF label="Глав. бух." required /></div>
          </div>
        </Card>
      </div>

      {/* Экспедитор / Грузоперевозчик */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card title="Экспедитор" extra={<CheckBox checked={expIsCarrier} onChange={() => setExpIsCarrier(!expIsCarrier)}>Экспедитор одновременно является грузоперевозчиком</CheckBox>}>
          <div className="grid grid-cols-2 gap-3"><LF label="ИНН/ПИНФЛ" /><LF label="Название" /></div>
        </Card>
        <Card title="Грузоперевозчик" help>
          <div className="grid grid-cols-2 gap-3"><LF label="ИНН/ПИНФЛ" required /><LF label="Название" required /></div>
        </Card>
      </div>

      {/* Клиент / Заказчик — hidden when the forwarder is also the carrier */}
      {!expIsCarrier && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Card title="Клиент" help>
            <div className="flex flex-col gap-3"><LF label="ИНН/ПИНФЛ" dropdown /><div className="grid grid-cols-2 gap-3"><LF label="Номер контракта" /><LF label="Дата контракта" date /></div></div>
          </Card>
          <Card title="Заказчик" help>
            <div className="flex flex-col gap-3"><LF label="ИНН/ПИНФЛ" dropdown /><div className="grid grid-cols-2 gap-3"><LF label="Номер контракта" /><LF label="Дата контракта" date /></div></div>
          </Card>
        </div>
      )}

      {/* Тип транспорта */}
      <Card title="Тип транспорта" help>
        <div className="flex flex-wrap items-center gap-6">
          <Radio checked onChange={() => {}}>Автомобиль</Radio>
          <Radio checked={false} onChange={() => {}} disabled>Воздушный</Radio>
          <Radio checked={false} onChange={() => {}} disabled>Железнодорожный</Radio>
          <Radio checked={false} onChange={() => {}} disabled>Водный</Radio>
          <CheckBox checked={semi} onChange={() => setSemi(!semi)}>Полуприцеп</CheckBox>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <LF label="Гос. номер автомобиля" required />
          <LF label="Модель авто" required />
          <LF label="Гос. номер полуприцепа" disabled={!semi} />
          <LF label="Модель авто" disabled={!semi} />
        </div>
        <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Другие владельцы — revealed when checked */}
          <div>
            <CheckBox checked={otherOwners} onChange={() => setOtherOwners(!otherOwners)}>Другие владельцы</CheckBox>
            {otherOwners && (
              <div className="mt-3 flex items-end gap-2">
                <div className="grid flex-1 grid-cols-2 gap-2"><LF label="ИНН/ПИНФЛ" /><LF label="Название" /></div>
                <button className="flex size-10 shrink-0 items-center justify-center rounded-md bg-yellow-400 text-white"><Plus className="size-5" /></button>
                <button className="flex size-10 shrink-0 items-center justify-center rounded-md border border-gray-200 text-gray-500 hover:bg-gray-50"><Trash2 className="size-5" /></button>
              </div>
            )}
          </div>
          {/* Прицеп — always shown, disabled until checked */}
          <div>
            <CheckBox checked={trailer} onChange={() => setTrailer(!trailer)}>Прицеп</CheckBox>
            <div className="mt-3 flex items-end gap-2">
              <div className="grid flex-1 grid-cols-2 gap-2"><LF label="Гос. номер прицепа" disabled={!trailer} /><LF label="Модель авто" disabled={!trailer} /></div>
              <button disabled={!trailer} className={cn('flex size-10 shrink-0 items-center justify-center rounded-md text-white', trailer ? 'bg-yellow-400' : 'bg-yellow-200')}><Plus className="size-5" /></button>
              <button disabled={!trailer} className="flex size-10 shrink-0 items-center justify-center rounded-md border border-gray-200 text-gray-500 hover:bg-gray-50"><Trash2 className="size-5" /></button>
            </div>
          </div>
        </div>
      </Card>

      {/* Водитель / Ответственное лицо */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card title="Водитель" extra={<CheckBox checked={driverIsResp} onChange={() => setDriverIsResp(!driverIsResp)}>Водитель также является ответственным лицом</CheckBox>}>
          <div className="grid grid-cols-2 gap-3"><LF label="ПИНФЛ" required /><LF label="ФИО" required /></div>
        </Card>
        <Card title="Ответственное лицо, доставляющий груз" help>
          <div className="grid grid-cols-2 gap-3"><LF label="ПИНФЛ" required /><LF label="ФИО" required /></div>
        </Card>
      </div>

      {/* Адрес погрузки / доставки */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card title="Адрес погрузки" extra={<button className="rounded-md bg-yellow-400 px-3 py-1.5 text-sm font-semibold text-slate-800">Мои адреса</button>}>
          <div className="flex flex-col gap-3"><div className="grid grid-cols-2 gap-3"><LF label="Область" required dropdown /><LF label="Район" required dropdown /></div><LF label="Адрес" required /></div>
        </Card>
        <Card title="Адрес доставки">
          <div className="flex flex-col gap-3"><div className="grid grid-cols-2 gap-3"><LF label="Область" required dropdown /><LF label="Район" required dropdown /></div><LF label="Адрес" required /></div>
        </Card>
      </div>

      {/* Доверенность */}
      <Card title="Доверенность">
        <div className="flex flex-col gap-3">
          <LF label="Выберите доверенность" dropdown />
          <div className="grid grid-cols-1 gap-3 md:grid-cols-4"><LF label="ID доверенности" /><LF label="Номер доверенности" /><LF label="от" date /><LF label="до" date /></div>
          <div className="grid grid-cols-2 gap-3"><LF label="ИНН/ПИНФЛ" /><LF label="ФИО" /></div>
        </div>
      </Card>

      {/* Items */}
      <div className="rounded-md border border-gray-200 bg-white">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 px-6 py-4">
          <div className="flex flex-wrap items-center gap-6">
            <CheckBox checked={flags.reverse} onChange={() => toggle('reverse')}>Обратный расчёт</CheckBox>
            {!isFarm && <CheckBox checked={flags.excise} onChange={() => toggle('excise')}>Акциз</CheckBox>}
            <CheckBox checked={flags.marked} onChange={() => toggle('marked')}>Товар маркирован</CheckBox>
            <CheckBox checked={flags.manual} onChange={() => toggle('manual')}>Ручной расчёт</CheckBox>
          </div>
          <button className="text-sm font-medium text-Smart-blue">Коды ИКПУ</button>
        </div>
        <div className="overflow-x-auto p-4">
          <table className="w-full border-collapse">
            <thead><tr className="bg-gray-100">{cols.map((c) => <th key={c.key} className="border-b border-r border-gray-200 px-3 py-3 text-left align-top text-sm font-semibold text-zinc-900 last:border-r-0">{c.header}</th>)}</tr></thead>
            <tbody>
              {items.map((it, idx) => <tr key={it.id}>{cols.map((c) => <td key={c.key} className={cn(cellCls, c.cls)}>{c.cell(it, idx)}</td>)}</tr>)}
              <tr className="font-semibold">
                <td colSpan={supplyIdx} className="px-3 py-3 text-right text-sm text-slate-700">Итого:</td>
                <td className="px-3 py-3 text-right text-sm text-slate-800">{money(totalSupply)}</td>
                <td /><td className="px-3 py-3 text-right text-sm text-slate-800">{money(totalVat)}</td>
                <td colSpan={cols.length - supplyIdx - 3} />
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Distance / delivery cost / mass */}
      <Card>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="relative"><LF label="Общее расстояние" required /><span className="absolute right-4 top-4 text-sm text-gray-400">км</span></div>
          <div className="relative"><LF label="Стоимость доставки (в сумах)" required /><span className="absolute right-4 top-4 text-sm text-gray-400">сум</span></div>
        </div>
      </Card>
      <Card>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2"><LF label="Брутто (ТН)" required /><LF label="Нетто (ТН)" required /></div>
      </Card>

      {/* Bottom */}
      <div className="flex flex-col items-center gap-4 pt-2">
        <button className="text-sm font-semibold text-Smart-blue hover:underline">Показать документ</button>
        <div className="flex items-center gap-3">
          <button className="rounded-lg bg-Smart-blue px-6 py-2.5 text-sm font-semibold text-white transition hover:brightness-105">Сохранить</button>
          <button onClick={() => navigate('/documents/outgoing')} className="rounded-lg bg-Smart-green px-6 py-2.5 text-sm font-semibold text-white transition hover:brightness-105">Подписать</button>
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
