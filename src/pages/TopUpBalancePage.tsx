import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, Clock, Coins, CreditCard, FileText, Info, Plus } from 'lucide-react'
import { balance, company, lookupPinfl, useSavedCards } from '@/data/billing'
import { CardBrandIcon } from '@/components/brand/CardBrandIcon'
import { AgreementNote } from '@/features/billing/AgreementNote'
import { PinflFields, RadioDot } from '@/features/billing/PayerFields'
import { cn } from '@/lib/cn'

const METHODS = [
  { key: 'payme', label: 'Payme', color: 'text-teal-500' },
  { key: 'octobank', label: 'Octobank', color: 'text-slate-800' },
  { key: 'paynet', label: 'Paynet', color: 'text-green-600' },
  { key: 'click', label: 'Click', color: 'text-blue-600' },
  { key: 'cards', label: 'Мои карты', color: 'text-slate-600' },
]

/**
 * Who pays is never asked here — the method already says it. A payment app
 * (Payme, Click, …) is always personal money, so it needs the payer's ПИНФЛ.
 * A saved card answered the question when it was added. Personal money ends
 * in a three-party agreement; either way the счёт-фактура goes to the company.
 */
const input =
  'w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-base text-slate-800 outline-none placeholder:text-gray-400 focus:border-Smart-blue'

const formatAmount = (digits: string) => `${Number(digits).toLocaleString('ru-RU')} сум`

/** Shown after a personal-funds payment: the agreement both sides still have to sign. */
function AgreementPending({ amount, owner }: { amount: string; owner: string }) {
  const navigate = useNavigate()
  const signers = [
    { name: 'Smartup24 Doc', signed: true },
    { name: company.name, signed: false },
    { name: owner, signed: false },
  ]

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-4">
      <div className="flex flex-col items-center gap-2 text-center">
        <CheckCircle2 className="size-12 text-Smart-green" />
        <h1 className="text-3xl font-semibold text-gray-900">Оплата принята</h1>
        <p className="text-base text-slate-600">
          {formatAmount(amount)} · плательщик {owner}
        </p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-blue-50 p-2.5">
            <FileText className="size-5 text-Smart-blue" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-slate-800">Трёхстороннее соглашение</span>
            <span className="text-sm text-gray-500">
              Многосторонний произвольный документ · Доп. соглашение на предоплату
            </span>
          </div>
        </div>

        <ul className="mt-4 flex flex-col gap-2 border-t border-gray-100 pt-4">
          {signers.map((s) => (
            <li key={s.name} className="flex items-center gap-2 text-sm">
              {s.signed ? (
                <CheckCircle2 className="size-4 shrink-0 text-Smart-green" />
              ) : (
                <Clock className="size-4 shrink-0 text-amber-500" />
              )}
              <span className="flex-1 text-slate-800">{s.name}</span>
              <span className={s.signed ? 'text-Smart-green' : 'text-amber-600'}>
                {s.signed ? 'Подписано' : 'Ожидает подписи'}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex items-start gap-2 rounded-xl bg-amber-50 px-4 py-3">
        <Info className="mt-0.5 size-4 shrink-0 text-amber-500" />
        <span className="text-sm text-amber-700">
          Средства находятся в резерве и будут зачислены на баланс после того, как соглашение
          подпишут компания и плательщик. Документ уже во «Входящих» — подписать его
          можно ключом ЭЦП или кодом из SMS.
        </span>
      </div>

      <button
        onClick={() => navigate('/documents/incoming')}
        className="w-full rounded-lg bg-Smart-blue py-3 text-base font-semibold text-white transition hover:brightness-105"
      >
        Перейти к документу
      </button>
      <button
        onClick={() => navigate('/tariffs')}
        className="w-full rounded-lg border border-gray-200 bg-white py-3 text-base font-semibold text-slate-700 transition hover:bg-gray-50"
      >
        К тарифам
      </button>
    </div>
  )
}

export default function TopUpBalancePage() {
  const navigate = useNavigate()
  const [amount, setAmount] = useState('')
  const [method, setMethod] = useState<string>()
  const [cardId, setCardId] = useState<number>()
  const [pinfl, setPinfl] = useState('')
  const [paid, setPaid] = useState(false)
  const cards = useSavedCards()

  const viaApp = method !== undefined && method !== 'cards'
  const card = method === 'cards' ? cards.find((c) => c.id === cardId) : undefined
  const personal = viaApp || card?.owner === 'personal'
  /** Whoever the agreement is drawn up with — null until known, or for company money. */
  const owner = viaApp ? lookupPinfl(pinfl) : (card?.holderName ?? null)
  const ready = Boolean(amount && (viaApp ? owner : card))

  function submit() {
    // Company money needs nothing further; personal money ends on the agreement.
    if (personal) setPaid(true)
    else navigate('/tariffs')
  }

  return (
    <div className="flex flex-col gap-6">
      <button
        onClick={() => navigate('/tariffs')}
        className="flex w-max items-center gap-2 rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 hover:bg-gray-50"
      >
        <ArrowLeft className="size-5" />
        Назад
      </button>

      {paid && owner ? (
        <AgreementPending amount={amount} owner={owner} />
      ) : (
        <div className="mx-auto w-full max-w-md">
          <h1 className="mb-8 text-center text-3xl font-semibold text-gray-900">Пополнить баланс</h1>

          <div className="mb-4 flex items-center gap-3 rounded-xl bg-Smart-green px-6 py-4">
            <div className="rounded-lg bg-white p-2.5">
              <Coins className="size-5 text-Smart-green" />
            </div>
            <div>
              <div className="text-base font-medium text-white">Баланс</div>
              <div className="text-xl font-semibold text-white">{balance}</div>
            </div>
          </div>

          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value.replace(/\D/g, ''))}
            inputMode="numeric"
            placeholder="Введите сумму"
            className={cn(input, 'mb-4')}
          />

          <div className="flex flex-col gap-3">
            {METHODS.map((m) => (
              <button
                key={m.key}
                onClick={() => setMethod(m.key)}
                className={cn(
                  'flex items-center gap-3 rounded-xl border bg-white px-4 py-3 text-left transition',
                  method === m.key ? 'border-Smart-blue ring-1 ring-Smart-blue' : 'border-gray-200 hover:bg-gray-50',
                )}
              >
                {m.key === 'cards' ? (
                  <CreditCard className="size-5 text-slate-500" />
                ) : (
                  <span className={cn('flex size-6 items-center justify-center text-xs font-bold', m.color)}>
                    {m.label[0]}
                  </span>
                )}
                <span className="flex-1 font-semibold text-slate-800">{m.label}</span>
                <RadioDot checked={method === m.key} />
              </button>
            ))}
          </div>

          {method === 'cards' && (
            <div className="mt-4 flex flex-col gap-3">
              {cards.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCardId(c.id)}
                  className={cn(
                    'flex items-center gap-3 rounded-xl border bg-white px-4 py-3 text-left transition',
                    cardId === c.id ? 'border-Smart-blue ring-1 ring-Smart-blue' : 'border-gray-200 hover:bg-gray-50',
                  )}
                >
                  <span className="flex w-10 justify-center">
                    <CardBrandIcon brand={c.brand} />
                  </span>
                  <span className="flex flex-1 flex-col">
                    <span className="font-semibold text-slate-800">{c.masked}</span>
                    <span className="text-sm text-gray-500">
                      {c.owner === 'company' ? 'Корпоративная' : `Личная · ${c.holderName}`}
                    </span>
                  </span>
                  <RadioDot checked={cardId === c.id} />
                </button>
              ))}
              <button
                onClick={() => navigate('/tariffs/add-card')}
                className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-gray-300 bg-white py-3 text-sm font-semibold text-slate-700 transition hover:bg-gray-50"
              >
                <Plus className="size-4" />
                Добавить карту
              </button>
            </div>
          )}

          {viaApp && (
            <div className="mt-4">
              <PinflFields pinfl={pinfl} onChange={setPinfl} placeholder="ПИНФЛ плательщика" />
            </div>
          )}

          {(viaApp || card) && (
            <div className="mt-4">
              <AgreementNote
                personal={personal}
                when={
                  viaApp
                    ? 'Оплата через платёжное приложение считается оплатой личными средствами. После неё'
                    : 'После оплаты'
                }
                payer={viaApp ? 'плательщиком' : 'владельцем карты'}
              />
            </div>
          )}

          <button
            disabled={!ready}
            onClick={submit}
            className="mt-4 w-full rounded-lg bg-Smart-blue py-3 text-base font-semibold text-white transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Отправить
          </button>
        </div>
      )}
    </div>
  )
}
