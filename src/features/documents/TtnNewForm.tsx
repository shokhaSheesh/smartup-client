import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronDown, Plus, Trash2, Check, HelpCircle, Map, Search } from 'lucide-react'
import { PillSelect } from '@/components/ui/PillSelect'
import { DOC_TYPES } from '@/data/docTypes'
import { cn } from '@/lib/cn'

const TTN_VARIANTS = ['Стандартный', 'Дополнительный', 'Исправленный']
const UNITS = ['Штук', 'кг', 'тонна', 'литр', 'метр']

const cellInput = 'bg-transparent outline-none'
function num(v: string): number {
  const n = Number(v.replace(/\s/g, '').replace(',', '.'))
  return Number.isFinite(n) ? n : 0
}
function money(n: number): string {
  return n.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}
function mass(n: number): string {
  return n.toLocaleString('ru-RU', { minimumFractionDigits: 5, maximumFractionDigits: 5 })
}

function LF({ label, required, value, dropdown, date, disabled, search }: { label: string; required?: boolean; value?: string; dropdown?: boolean; date?: boolean; disabled?: boolean; search?: boolean }) {
  const [v, setV] = useState(value ?? '')
  return (
    <div className={cn('relative flex flex-col rounded-lg border px-3.5 py-1.5', disabled ? 'border-gray-200 bg-gray-50' : 'border-gray-300 bg-white')}>
      <span className="text-xs text-gray-500">{label}{required && <span className="text-red-500"> *</span>}</span>
      <input value={v} onChange={(e) => setV(e.target.value)} type={date ? 'date' : 'text'} disabled={disabled} className={cn('w-full bg-transparent text-sm outline-none', disabled ? 'text-gray-400' : 'text-slate-800')} />
      {dropdown && <ChevronDown className="pointer-events-none absolute right-3 top-4 size-4 text-gray-400" />}
      {search && <Search className="pointer-events-none absolute right-3 top-4 size-4 text-gray-400" />}
    </div>
  )
}

function CheckBox({ checked, onChange, disabled, children }: { checked: boolean; onChange: () => void; disabled?: boolean; children: React.ReactNode }) {
  return (
    <label className={cn('flex items-start gap-2 text-sm', disabled ? 'cursor-not-allowed text-gray-300' : 'cursor-pointer text-slate-700')} onClick={disabled ? undefined : onChange}>
      <span className={cn('mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-sm border', checked ? 'border-Smart-blue bg-Smart-blue text-white' : disabled ? 'border-gray-200' : 'border-gray-300 bg-white')}>
        {checked && <Check className="size-3" strokeWidth={3} />}
      </span>
      {children}
    </label>
  )
}

function Radio({ checked, onChange, children }: { checked: boolean; onChange: () => void; children: React.ReactNode }) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600" onClick={onChange}>
      <span className={cn('size-4 shrink-0 rounded-full border', checked ? 'border-Smart-blue bg-Smart-blue' : 'border-gray-300 bg-white')} />
      {children}
    </label>
  )
}

function Card({ title, help, extra, children }: { title?: string; help?: boolean; extra?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="rounded-md bg-white p-6 shadow-[0px_1px_2px_0px_rgba(16,24,40,0.06)]">
      {(title || extra) && (
        <div className="mb-4 flex items-center justify-between gap-3">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-800">{title}{help && <HelpCircle className="size-4 text-Smart-blue" />}</h3>
          {extra}
        </div>
      )}
      {children}
    </div>
  )
}

type Item = { id: number; ikpu: string; description: string; unit: string; qty: number; price: number; gross: number; net: number }
let nextId = 2
const emptyItem = (): Item => ({ id: nextId++, ikpu: '', description: '', unit: 'Штук', qty: 0, price: 0, gross: 0, net: 0 })

type Shipment = 'warehouse' | 'seller' | 'processing' | 'postal'
type Transport = 'auto' | 'air' | 'rail' | 'water'

export default function TtnNewForm({ docType, onDocType }: { docType: string; onDocType: (v: string) => void }) {
  const navigate = useNavigate()
  const [variant, setVariant] = useState(TTN_VARIANTS[0])
  const [shipment, setShipment] = useState<Shipment>('seller')
  const [transport, setTransport] = useState<Transport>('auto')
  const [senderAgent, setSenderAgent] = useState(false)
  const [senderIsForwarder, setSenderIsForwarder] = useState(false)
  const [receiverIsForwarder, setReceiverIsForwarder] = useState(false)
  const [oneSided, setOneSided] = useState(false)
  const [expIsCarrier, setExpIsCarrier] = useState(false)
  const [semi, setSemi] = useState(false)
  const [otherOwners, setOtherOwners] = useState(false)
  const [trailer, setTrailer] = useState(false)
  const [driverIsResp, setDriverIsResp] = useState(false)
  const [items, setItems] = useState<Item[]>([emptyItem()])

  const contractRequired = shipment === 'seller' || shipment === 'processing'
  const isWarehouse = shipment === 'warehouse'
  const isRail = transport === 'rail'
  const isAuto = transport === 'auto'

  function updateItem(id: number, patch: Partial<Item>) {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, ...patch } : it)))
  }
  const rowSum = (it: Item) => it.qty * it.price
  const totalSum = items.reduce((s, it) => s + rowSum(it), 0)
  const totalGross = items.reduce((s, it) => s + it.gross, 0)
  const totalNet = items.reduce((s, it) => s + it.net, 0)

  const cellCls = 'border-b border-r border-gray-200 px-3 py-2 text-sm'
  const th = 'border border-gray-300 px-3 py-2 text-center align-middle font-semibold text-zinc-900'

  return (
    <div className="flex flex-col gap-4">
      {/* Type + Тип перевозки */}
      <Card>
        <div className="mb-6 flex flex-wrap items-center gap-4">
          <span className="text-lg font-semibold text-black/80">Тип документа:</span>
          <PillSelect options={[...DOC_TYPES]} value={docType} onChange={onDocType} />
          <PillSelect options={TTN_VARIANTS} value={variant} onChange={setVariant} />
        </div>
        <h3 className="mb-3 text-base font-semibold text-slate-800">Тип перевозки</h3>
        <div className="mb-4 grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-2">
          <Radio checked={shipment === 'warehouse'} onChange={() => setShipment('warehouse')}>От склада до склада</Radio>
          <Radio checked={shipment === 'seller'} onChange={() => setShipment('seller')}>От продавца до покупателя</Radio>
          <Radio checked={shipment === 'processing'} onChange={() => setShipment('processing')}>Переработка/хранение</Radio>
          <Radio checked={shipment === 'postal'} onChange={() => setShipment('postal')}>Почтовые и курьерские услуги</Radio>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:max-w-2xl">
          <LF label="Номер товарно-транспортной накладной" />
          <LF label="Дата документа" required date />
          <LF label="Номер контракта" required={contractRequired} />
          <LF label="Дата контракта" required={contractRequired} date />
        </div>
      </Card>

      {/* Грузоотправитель / Грузополучатель */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card title="Грузоотправитель" extra={<div className="flex items-center gap-4"><CheckBox checked={senderAgent} onChange={() => setSenderAgent(!senderAgent)}>Агент (доверенное лицо)</CheckBox><CheckBox checked={senderIsForwarder} onChange={() => setSenderIsForwarder(!senderIsForwarder)}>Одновременно и экспедитор</CheckBox></div>}>
          <div className="grid grid-cols-2 gap-3"><LF label="ИНН/ПИНФЛ" value="307205394" /><LF label="Название" value='"UDEVS" MCHJ' /></div>
        </Card>
        <Card title="Грузополучатель" extra={<CheckBox checked={receiverIsForwarder} onChange={() => setReceiverIsForwarder(!receiverIsForwarder)} disabled={isWarehouse}>Одновременно и экспедитор</CheckBox>}>
          <div className="grid grid-cols-2 gap-3">
            <LF label="ИНН/ПИНФЛ" required value={isWarehouse ? '307205394' : undefined} disabled={isWarehouse} />
            <LF label="Название" required value={isWarehouse ? '"UDEVS" MCHJ' : undefined} disabled={isWarehouse} />
          </div>
          <div className="mt-3"><CheckBox checked={oneSided} onChange={() => setOneSided(!oneSided)}>Односторонний документ</CheckBox></div>
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

      {/* Клиент / Заказчик */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card title="Клиент" help>
          <div className="flex flex-col gap-3"><LF label="ИНН/ПИНФЛ" dropdown /><div className="grid grid-cols-2 gap-3"><LF label="Номер контракта" /><LF label="Дата контракта" date /></div></div>
        </Card>
        <Card title="Заказчик" help>
          <div className="flex flex-col gap-3"><LF label="ИНН/ПИНФЛ" dropdown /><div className="grid grid-cols-2 gap-3"><LF label="Номер контракта" /><LF label="Дата контракта" date /></div></div>
        </Card>
      </div>

      {/* Тип транспорта */}
      <Card title="Тип транспорта" help>
        <div className="flex flex-wrap items-center gap-6">
          <Radio checked={transport === 'auto'} onChange={() => setTransport('auto')}>Автомобиль</Radio>
          <Radio checked={transport === 'air'} onChange={() => setTransport('air')}>Воздушный</Radio>
          <Radio checked={transport === 'rail'} onChange={() => setTransport('rail')}>Железнодорожный</Radio>
          <Radio checked={transport === 'water'} onChange={() => setTransport('water')}>Водный</Radio>
          {isAuto && <CheckBox checked={semi} onChange={() => setSemi(!semi)}>Полуприцеп</CheckBox>}
        </div>

        {isAuto && (
          <>
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              <LF label="Гос. номер автомобиля" required />
              <LF label="Модель авто" />
              <LF label="Гос. номер полуприцепа" disabled={!semi} />
              <LF label="Модель авто" disabled={!semi} />
            </div>
            <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <CheckBox checked={otherOwners} onChange={() => setOtherOwners(!otherOwners)}>Другие владельцы</CheckBox>
                {otherOwners && (
                  <div className="mt-3 flex items-end gap-2">
                    <div className="grid flex-1 grid-cols-2 gap-2"><LF label="ИНН/ПИНФЛ" /><LF label="Название" /></div>
                    <button className="flex size-10 shrink-0 items-center justify-center rounded-md bg-yellow-400 text-white"><Plus className="size-5" /></button>
                    <button className="flex size-10 shrink-0 items-center justify-center rounded-md border border-gray-200 text-gray-500"><Trash2 className="size-5" /></button>
                  </div>
                )}
              </div>
              <div>
                <CheckBox checked={trailer} onChange={() => setTrailer(!trailer)}>Прицеп</CheckBox>
                <div className="mt-3 flex items-end gap-2">
                  <div className="grid flex-1 grid-cols-2 gap-2"><LF label="Гос. номер прицепа" disabled={!trailer} /><LF label="Модель авто" disabled={!trailer} /></div>
                  <button disabled={!trailer} className={cn('flex size-10 shrink-0 items-center justify-center rounded-md text-white', trailer ? 'bg-yellow-400' : 'bg-yellow-200')}><Plus className="size-5" /></button>
                  <button disabled={!trailer} className="flex size-10 shrink-0 items-center justify-center rounded-md border border-gray-200 text-gray-500"><Trash2 className="size-5" /></button>
                </div>
              </div>
            </div>
          </>
        )}
        {transport === 'air' && <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:max-w-lg"><LF label="Номер рейса" required /><LF label="Направление полёта" required /></div>}
        {transport === 'rail' && <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:max-w-lg"><LF label="ID ЖД накладная" search /><LF label="Направление поезда" required /></div>}
        {transport === 'water' && <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:max-w-lg"><LF label="Номер корабля" required /><LF label="Направление корабля" required /></div>}
      </Card>

      {/* Водитель (auto only) / Ответственное лицо */}
      {isAuto ? (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Card title="Водитель" extra={<CheckBox checked={driverIsResp} onChange={() => setDriverIsResp(!driverIsResp)}>Водитель также является ответственным лицом, доставляющим груз</CheckBox>}>
            <div className="grid grid-cols-2 gap-3"><LF label="ПИНФЛ" required /><LF label="ФИО" /></div>
          </Card>
          <Card title="Ответственное лицо, доставляющий груз" help>
            <div className="grid grid-cols-2 gap-3"><LF label="ПИНФЛ" required /><LF label="ФИО" /></div>
          </Card>
        </div>
      ) : (
        <Card title="Ответственное лицо, доставляющий груз" help>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:max-w-md"><LF label="ИНН/ПИНФЛ" required /><LF label="ФИО" /></div>
        </Card>
      )}

      {/* Адрес груза - 1 */}
      <Card>
        <h3 className="mb-4 text-lg font-semibold text-slate-800">Адрес груза - 1</h3>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Погрузка */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h4 className="text-base font-semibold text-slate-800">{isRail ? 'Станция погрузки' : 'Адрес погрузки'}</h4>
              {!isRail && <div className="flex items-center gap-2"><button className="rounded-md bg-yellow-400 px-3 py-1.5 text-sm font-semibold text-white">Мои адреса</button><Map className="size-5 text-slate-500" /></div>}
            </div>
            {isRail ? (
              <>
                <div className="grid grid-cols-2 gap-3"><LF label="ID станции" required dropdown /><LF label="Название станции" /></div>
                <LF label="Малые железнодорожные ветки" required dropdown />
              </>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-3"><LF label="Область" required dropdown /><LF label="Район" required dropdown /></div>
                <div className="grid grid-cols-2 gap-3"><LF label="Улица" required /><LF label="Дом" required /></div>
                <div className="grid grid-cols-2 gap-3"><LF label="Широта" /><LF label="Долгота" /></div>
              </>
            )}
            <div className="text-sm text-gray-500">Ответственное лицо грузоотправителя:</div>
            <div className="grid grid-cols-2 gap-3"><LF label="ПИНФЛ" /><LF label="ФИО" /></div>
            {isRail && <><div className="text-sm text-gray-500">Вагон:</div><LF label="Номер вагона" required /></>}
            {!isRail && <><div className="text-sm text-gray-500">Расстояние:</div><div className="relative max-w-xs"><LF label=" " /><span className="absolute right-4 top-4 text-sm text-gray-400">км</span></div></>}
          </div>
          {/* Доставка */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h4 className="text-base font-semibold text-slate-800">{isRail ? 'Станция разгрузки' : 'Адрес доставки'}</h4>
              {!isRail && <div className="flex items-center gap-2"><button disabled={isWarehouse} className={cn('rounded-md px-3 py-1.5 text-sm font-semibold', isWarehouse ? 'cursor-not-allowed bg-gray-100 text-gray-400' : 'bg-yellow-400 text-white')}>Адреса партнера</button><Map className="size-5 text-slate-500" /></div>}
            </div>
            {isRail ? (
              <>
                <div className="grid grid-cols-2 gap-3"><LF label="ID станции" required dropdown /><LF label="Название станции" /></div>
                <LF label="Малые железнодорожные ветки" required dropdown />
              </>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-3"><LF label="Область" required dropdown /><LF label="Район" required dropdown /></div>
                <div className="grid grid-cols-2 gap-3"><LF label="Улица" required /><LF label="Дом" required /></div>
                <div className="grid grid-cols-2 gap-3"><LF label="Широта" /><LF label="Долгота" /></div>
              </>
            )}
            <div className="text-sm text-gray-500">Ответственное лицо грузополучателя:</div>
            <div className="grid grid-cols-2 gap-3"><LF label="ПИНФЛ" /><LF label="ФИО" /></div>
            <h4 className="flex items-center gap-2 pt-2 text-base font-semibold text-slate-800">Доверенность <HelpCircle className="size-4 text-Smart-blue" /></h4>
            <LF label="Выберите доверенность" dropdown />
            <div className="grid grid-cols-3 gap-3"><LF label="Номер документа" /><LF label="от" date /><LF label="до" date /></div>
          </div>
        </div>

        {/* Items */}
        <div className="mt-6 flex justify-end"><button className="rounded-md bg-yellow-400 px-4 py-1.5 text-sm font-semibold text-white">Коды ИКПУ</button></div>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                <th className={th} rowSpan={2}>№</th>
                <th className={th} rowSpan={2}>ИКПУ и наименование товаров *</th>
                <th className={th} rowSpan={2}>Описание товаров *</th>
                <th className={th} rowSpan={2}>Ед. изм. *</th>
                <th className={th} rowSpan={2}>Кол-во *</th>
                <th className={th} rowSpan={2}>Цена *</th>
                <th className={th} rowSpan={2}>Сумма (без НДС) *</th>
                <th className={th} colSpan={2}>Масса (ТН)</th>
                <th className={th} rowSpan={2} />
              </tr>
              <tr>
                <th className={th}>Брутто (ТН)</th>
                <th className={th}>Нетто (ТН)</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it, idx) => (
                <tr key={it.id}>
                  <td className={cn(cellCls, 'text-center text-zinc-700')}>{idx + 1}</td>
                  <td className={cellCls}><select value={it.ikpu} onChange={(e) => updateItem(it.id, { ikpu: e.target.value })} className={cn(cellInput, 'w-56')}><option value="">—</option><option>ИКПУ 001</option><option>ИКПУ 002</option></select></td>
                  <td className={cellCls}><input value={it.description} onChange={(e) => updateItem(it.id, { description: e.target.value })} placeholder="Описание" className={cn(cellInput, 'w-40')} /></td>
                  <td className={cellCls}><select value={it.unit} onChange={(e) => updateItem(it.id, { unit: e.target.value })} className={cellInput}>{UNITS.map((u) => <option key={u}>{u}</option>)}</select></td>
                  <td className={cellCls}><input value={it.qty || ''} onChange={(e) => updateItem(it.id, { qty: num(e.target.value) })} className={cn(cellInput, 'w-16 text-right')} /></td>
                  <td className={cellCls}><input value={it.price || ''} onChange={(e) => updateItem(it.id, { price: num(e.target.value) })} className={cn(cellInput, 'w-24 text-right')} /></td>
                  <td className={cn(cellCls, 'text-right text-zinc-700')}>{money(rowSum(it))}</td>
                  <td className={cellCls}><input value={it.gross || ''} onChange={(e) => updateItem(it.id, { gross: num(e.target.value) })} className={cn(cellInput, 'w-24 text-right')} /></td>
                  <td className={cellCls}><input value={it.net || ''} onChange={(e) => updateItem(it.id, { net: num(e.target.value) })} className={cn(cellInput, 'w-24 text-right')} /></td>
                  <td className={cn(cellCls, 'text-center')}>
                    <div className="flex items-center justify-center gap-1">
                      <button onClick={() => setItems((p) => p.filter((x) => x.id !== it.id))} className="flex size-7 items-center justify-center rounded-md border border-gray-200 text-red-500 hover:bg-red-50"><Trash2 className="size-4" /></button>
                      <button onClick={() => setItems((p) => [...p, emptyItem()])} className="flex size-7 items-center justify-center rounded-md border border-green-200 text-Smart-green hover:bg-green-50"><Plus className="size-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              <tr className="font-semibold">
                <td colSpan={6} className="px-3 py-3 text-right text-sm text-slate-700">Итого:</td>
                <td className="border-r border-gray-200 px-3 py-3 text-right text-sm text-slate-800">{money(totalSum)}</td>
                <td className="border-r border-gray-200 px-3 py-3 text-right text-sm text-slate-800">{mass(totalGross)}</td>
                <td className="px-3 py-3 text-right text-sm text-slate-800">{mass(totalNet)}</td>
                <td />
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mt-3 flex justify-end gap-3">
          <button onClick={() => setItems((p) => (p.length > 1 ? p.slice(0, -1) : p))} className="rounded-md bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:brightness-105">Удалить</button>
          <button onClick={() => setItems((p) => [...p, emptyItem()])} className="rounded-md bg-yellow-400 px-4 py-2 text-sm font-semibold text-white hover:brightness-105">Добавить груз</button>
        </div>
      </Card>

      {/* Delivery cost */}
      <Card>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="relative"><LF label="Общее расстояние" required /><span className="absolute right-4 top-4 text-sm text-gray-400">км</span></div>
          <div className="relative"><LF label="Стоимость доставки за 1 км" required /><span className="absolute right-4 top-4 text-sm text-gray-400">сум</span></div>
          <div className="relative"><LF label="Стоимость доставки (в сумах)" required /><span className="absolute right-4 top-4 text-sm text-gray-400">сум</span></div>
        </div>
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
    </div>
  )
}
