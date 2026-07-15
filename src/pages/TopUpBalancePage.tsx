import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Coins, CreditCard } from 'lucide-react'
import { balance } from '@/data/billing'
import { cn } from '@/lib/cn'

const METHODS = [
  { key: 'payme', label: 'Payme', color: 'text-teal-500' },
  { key: 'octobank', label: 'Octobank', color: 'text-slate-800' },
  { key: 'paynet', label: 'Paynet', color: 'text-green-600' },
  { key: 'click', label: 'Click', color: 'text-blue-600' },
  { key: 'cards', label: 'Мои карты', color: 'text-slate-600' },
]

export default function TopUpBalancePage() {
  const navigate = useNavigate()
  const [amount, setAmount] = useState('')
  const [method, setMethod] = useState<string>()

  return (
    <div className="flex flex-col gap-6">
      <button
        onClick={() => navigate('/tariffs')}
        className="flex w-max items-center gap-2 rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 hover:bg-gray-50"
      >
        <ArrowLeft className="size-5" />
        Назад
      </button>

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
          className="mb-4 w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-base text-slate-800 outline-none placeholder:text-gray-400 focus:border-Smart-blue"
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
              <span
                className={cn(
                  'flex size-5 items-center justify-center rounded-full border',
                  method === m.key ? 'border-Smart-blue' : 'border-gray-300',
                )}
              >
                {method === m.key && <span className="size-2.5 rounded-full bg-Smart-blue" />}
              </span>
            </button>
          ))}
        </div>

        <button
          disabled={!amount || !method}
          onClick={() => navigate('/tariffs')}
          className="mt-4 w-full rounded-lg bg-Smart-blue py-3 text-base font-semibold text-white transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Отправить
        </button>
      </div>
    </div>
  )
}
