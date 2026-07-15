import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CalendarCheck,
  Coins,
  Info,
  ArrowRight,
  Check,
  Sparkles,
  Pencil,
  Trash2,
  Plus,
  HelpCircle,
} from 'lucide-react'
import {
  plans,
  currentSubscription,
  balance,
  billingId,
  savedCards as initialCards,
  paymentHistory,
} from '@/data/billing'
import type { Plan } from '@/data/billing'
import { CardBrandIcon } from '@/components/brand/CardBrandIcon'
import { Modal } from '@/components/ui/Modal'
import { cn } from '@/lib/cn'

type Tab = 'plans' | 'cards' | 'history'
const TABS: { key: Tab; label: string }[] = [
  { key: 'plans', label: 'Тарифы' },
  { key: 'cards', label: 'Карты' },
  { key: 'history', label: 'История' },
]

function FeatureRow({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-2 text-sm text-gray-800">
      <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-Smart-blue to-Smart-green">
        <Sparkles className="size-3 text-white" />
      </span>
      {text}
    </li>
  )
}

/** The user's active plan — the piece missing from the design. */
function CurrentPlanCard({ planKey }: { planKey: string }) {
  const plan = plans.find((p) => p.key === planKey)!
  const docPct = Math.round((currentSubscription.documentsUsed / currentSubscription.documentsLimit) * 100)
  return (
    <div className="rounded-xl border border-Smart-blue/30 bg-gradient-to-br from-Smart-blue/[0.06] to-Smart-green/[0.06] p-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-Smart-blue px-3 py-1 text-xs font-semibold text-white">
            Текущий тариф
          </span>
          <span className="text-2xl font-bold text-gray-900">{plan.name}</span>
          <span className="text-sm text-gray-500">· {plan.price} / {plan.period}</span>
        </div>
        <div className="flex items-center gap-2 text-sm font-medium text-Smart-green">
          <CalendarCheck className="size-4" />
          Активен до {currentSubscription.activeUntil}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <div className="mb-1 flex justify-between text-xs text-gray-500">
            <span>Документы</span>
            <span>{currentSubscription.documentsUsed} / {currentSubscription.documentsLimit}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-gray-200">
            <div className="h-full rounded-full bg-Smart-blue" style={{ width: `${docPct}%` }} />
          </div>
        </div>
        <div className="text-sm">
          <div className="text-xs text-gray-500">Пользователи</div>
          <div className="font-semibold text-gray-800">
            {currentSubscription.usersUsed} / {currentSubscription.usersLimit}
          </div>
        </div>
        <div className="text-sm">
          <div className="text-xs text-gray-500">Интеграция</div>
          <div className="font-semibold text-gray-800">{currentSubscription.integration}</div>
        </div>
      </div>
    </div>
  )
}

function PlansTab({
  currentPlanKey,
  onChoose,
}: {
  currentPlanKey: string
  onChoose: (plan: Plan) => void
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4 rounded-xl bg-white p-4 shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]">
        <div className="flex size-10 items-center justify-center rounded-lg border border-gray-200">
          <Info className="size-5 text-slate-700" />
        </div>
        <span className="flex-1 text-sm font-semibold text-slate-700">Разовые услуги</span>
        <button className="flex items-center gap-2 text-sm font-semibold text-Smart-blue">
          Подробнее <ArrowRight className="size-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {plans.map((plan) => {
          const isCurrent = plan.key === currentPlanKey
          return (
            <div
              key={plan.key}
              className={cn(
                'flex flex-col rounded-xl bg-white shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]',
                isCurrent ? 'ring-2 ring-Smart-blue' : 'border border-gray-200',
              )}
            >
              <div className="flex flex-col items-center gap-2 px-6 pt-6 text-center">
                <div className="flex items-center gap-2 text-xl font-semibold text-gray-900">
                  {plan.name}
                  {isCurrent && (
                    <span className="rounded-full bg-Smart-blue/10 px-2 py-0.5 text-xs font-medium text-Smart-blue">
                      активен
                    </span>
                  )}
                </div>
                <div className="text-4xl font-semibold text-gray-900">{plan.price}</div>
                <div className="text-base text-slate-600">{plan.period}</div>
              </div>
              <ul className="flex flex-1 flex-col gap-4 px-5 py-8">
                {plan.features.map((f) => (
                  <FeatureRow key={f} text={f} />
                ))}
              </ul>
              <div className="px-6 pb-6">
                <button
                  disabled={isCurrent}
                  onClick={() => onChoose(plan)}
                  className={cn(
                    'flex w-full items-center justify-center gap-2 rounded-lg px-5 py-3 text-base font-semibold transition',
                    isCurrent
                      ? 'cursor-default bg-gray-100 text-gray-400'
                      : 'bg-Smart-blue text-white hover:brightness-105',
                  )}
                >
                  {isCurrent ? <><Check className="size-5" /> Ваш тариф</> : 'Выбрать план'}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function CardsTab() {
  const navigate = useNavigate()
  const [cards, setCards] = useState(initialCards)
  return (
    <div className="flex flex-col gap-3">
      {cards.map((card) => (
        <div
          key={card.id}
          className="flex items-center gap-4 rounded-xl bg-white px-6 py-4 shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]"
        >
          <div className="flex w-12 justify-center">
            <CardBrandIcon brand={card.brand} />
          </div>
          <div className="flex-1">
            <div className="font-medium text-slate-800">{card.masked}</div>
            <div className="text-sm text-gray-400">{card.exp}</div>
          </div>
          <button className="flex size-10 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50">
            <Pencil className="size-4" />
          </button>
          <button
            onClick={() => setCards((c) => c.filter((x) => x.id !== card.id))}
            className="flex size-10 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-red-50 hover:text-red-500"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      ))}
      <button
        onClick={() => navigate('/tariffs/add-card')}
        className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-gray-300 bg-white py-4 text-base font-semibold text-slate-700 transition hover:bg-gray-50"
      >
        <Plus className="size-5" />
        Добавить карту
      </button>
    </div>
  )
}

function HistoryTab() {
  const statusStyle = {
    success: 'bg-green-100 text-emerald-600',
    pending: 'bg-amber-50 text-amber-500',
    failed: 'bg-red-100 text-red-600',
  }
  const statusLabel = { success: 'Успешно', pending: 'В обработке', failed: 'Ошибка' }
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 text-left text-xs font-medium text-gray-900">
            <th className="px-6 py-3">Дата</th>
            <th className="px-6 py-3">Описание</th>
            <th className="px-6 py-3">Сумма</th>
            <th className="px-6 py-3">Статус</th>
          </tr>
        </thead>
        <tbody>
          {paymentHistory.map((h) => (
            <tr key={h.id} className="border-t border-gray-100">
              <td className="px-6 py-4 text-gray-900">{h.date}</td>
              <td className="px-6 py-4 text-gray-900">{h.description}</td>
              <td className="px-6 py-4 font-medium text-gray-900">{h.amount}</td>
              <td className="px-6 py-4">
                <span className={cn('rounded-md px-3 py-1 text-xs font-medium', statusStyle[h.status])}>
                  {statusLabel[h.status]}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function CheckoutModal({
  plan,
  onClose,
  onConfirm,
}: {
  plan: Plan | null
  onClose: () => void
  onConfirm: () => void
}) {
  const balanceNumber = balance.replace(/\s*сум$/, '')

  return (
    <Modal open={Boolean(plan)} onClose={onClose} title={'План "Месячный"'}>
      {plan && (
        <div className="flex flex-col">
          <div className="flex flex-col gap-5 px-6 pt-2">
            {/* Balance */}
            <div className="rounded-xl bg-green-500 px-6 py-3">
              <div className="text-base font-medium text-gray-50">Баланс (сум)</div>
              <div className="text-xl font-semibold text-gray-50">{balanceNumber}</div>
            </div>

            {/* Selected plan card */}
            <div className="rounded-lg bg-gray-100">
              <div className="flex flex-col items-center gap-2 px-6 pt-6 text-center">
                <div className="flex items-center gap-2 text-xl font-semibold text-gray-900">
                  {plan.name}
                  <HelpCircle className="size-5 text-gray-400" />
                </div>
                <div className="text-4xl font-semibold text-gray-900">{plan.price}</div>
                <div className="text-base text-slate-600">{plan.period}</div>
              </div>
              <ul className="flex flex-col gap-4 px-5 py-8">
                {plan.features.map((f) => (
                  <FeatureRow key={f} text={f} />
                ))}
              </ul>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-6">
            <button
              onClick={onConfirm}
              className="w-full rounded-lg bg-Smart-blue py-2.5 text-base font-semibold text-white shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] transition hover:brightness-105"
            >
              Оплатить
            </button>
          </div>
        </div>
      )}
    </Modal>
  )
}

export default function BillingPage() {
  const navigate = useNavigate()
  const [tab, setTab] = useState<Tab>('plans')
  const [currentPlanKey, setCurrentPlanKey] = useState(currentSubscription.planKey)
  const [checkoutPlan, setCheckoutPlan] = useState<Plan | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  function confirmPlan() {
    if (!checkoutPlan) return
    const name = checkoutPlan.name
    setCurrentPlanKey(checkoutPlan.key)
    setCheckoutPlan(null)
    setToast(`Тариф «${name}» оформлен`)
    setTimeout(() => setToast(null), 3000)
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Биллинг</h1>
          <p className="mt-1 text-base font-medium text-gray-500">ID {billingId}</p>
        </div>
        <button
          onClick={() => navigate('/tariffs/topup')}
          className="rounded-lg bg-Smart-blue px-3.5 py-2 text-sm font-semibold text-white transition hover:brightness-105"
        >
          Пополнить баланс
        </button>
      </div>

      {/* Balance */}
      <div className="flex w-80 items-center gap-3 rounded-xl bg-Smart-green px-6 py-3">
        <div className="rounded-lg bg-white p-2.5">
          <Coins className="size-5 text-Smart-green" />
        </div>
        <div>
          <div className="text-base font-medium text-white">Баланс</div>
          <div className="text-xl font-semibold text-white">{balance}</div>
        </div>
      </div>

      {/* Current subscription */}
      <CurrentPlanCard planKey={currentPlanKey} />

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              'h-12 border-b-2 px-3.5 text-sm font-medium transition',
              tab === t.key ? 'border-Smart-blue text-slate-800' : 'border-transparent text-gray-500 hover:text-slate-700',
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'plans' && <PlansTab currentPlanKey={currentPlanKey} onChoose={setCheckoutPlan} />}
      {tab === 'cards' && <CardsTab />}
      {tab === 'history' && <HistoryTab />}

      <CheckoutModal plan={checkoutPlan} onClose={() => setCheckoutPlan(null)} onConfirm={confirmPlan} />

      {toast && (
        <div className="fixed bottom-6 right-6 z-[60] flex items-center gap-2 rounded-lg bg-slate-800 px-4 py-3 text-sm font-medium text-white shadow-lg">
          <Check className="size-5 text-emerald-400" />
          {toast}
        </div>
      )}
    </div>
  )
}
