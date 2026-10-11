import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Building2, User } from 'lucide-react'
import { addSavedCard, company, lookupPinfl } from '@/data/billing'
import type { CardOwner } from '@/data/billing'
import { AgreementNote } from '@/features/billing/AgreementNote'
import { PinflFields, RadioDot } from '@/features/billing/PayerFields'
import { cn } from '@/lib/cn'

const input =
  'w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-base text-slate-800 outline-none placeholder:text-gray-400 focus:border-Smart-blue'

const OWNERS: Array<{ key: CardOwner; label: string; hint: string; icon: typeof User }> = [
  {
    key: 'company',
    label: 'Корпоративная карта',
    hint: `Привязана к ИНН ${company.name}`,
    icon: Building2,
  },
  {
    key: 'personal',
    label: 'Личная карта',
    hint: 'Карта физического лица',
    icon: User,
  },
]

export default function AddCardPage() {
  const navigate = useNavigate()
  const [number, setNumber] = useState('')
  const [mm, setMm] = useState('')
  const [yy, setYy] = useState('')
  // Asked once here, so a top-up from this card never has to ask again.
  const [owner, setOwner] = useState<CardOwner>()
  const [pinfl, setPinfl] = useState('')

  function formatNumber(v: string) {
    const digits = v.replace(/\D/g, '').slice(0, 16)
    return digits.replace(/(.{4})/g, '$1 ').trim()
  }

  const holderName = lookupPinfl(pinfl)
  const valid =
    number.replace(/\s/g, '').length === 16 &&
    mm.length === 2 &&
    yy.length === 2 &&
    (owner === 'company' || (owner === 'personal' && holderName !== null))

  function save() {
    if (!owner) return
    addSavedCard({
      number: number.replace(/\s/g, ''),
      exp: `${mm}/${yy}`,
      owner,
      ...(owner === 'personal' && holderName && { holderPinfl: pinfl, holderName }),
    })
    navigate('/tariffs')
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

      <div className="mx-auto w-full max-w-md">
        <h1 className="mb-8 text-center text-3xl font-semibold text-gray-900">Добавить карту</h1>
        <div className="flex flex-col gap-4">
          <input
            value={number}
            onChange={(e) => setNumber(formatNumber(e.target.value))}
            inputMode="numeric"
            placeholder="0000 0000 0000 0000"
            className={input}
          />
          <div className="grid grid-cols-2 gap-4">
            <input
              value={mm}
              onChange={(e) => setMm(e.target.value.replace(/\D/g, '').slice(0, 2))}
              inputMode="numeric"
              placeholder="ММ"
              className={input}
            />
            <input
              value={yy}
              onChange={(e) => setYy(e.target.value.replace(/\D/g, '').slice(0, 2))}
              inputMode="numeric"
              placeholder="ГГ"
              className={input}
            />
          </div>

          <h2 className="mt-2 text-base font-semibold text-slate-800">Чья это карта?</h2>
          <div className="flex flex-col gap-3">
            {OWNERS.map((o) => (
              <button
                key={o.key}
                onClick={() => setOwner(o.key)}
                className={cn(
                  'flex items-center gap-3 rounded-xl border bg-white px-4 py-3 text-left transition',
                  owner === o.key ? 'border-Smart-blue ring-1 ring-Smart-blue' : 'border-gray-200 hover:bg-gray-50',
                )}
              >
                <o.icon className="size-5 shrink-0 text-slate-500" />
                <span className="flex flex-1 flex-col">
                  <span className="font-semibold text-slate-800">{o.label}</span>
                  <span className="text-sm text-gray-500">{o.hint}</span>
                </span>
                <RadioDot checked={owner === o.key} />
              </button>
            ))}
          </div>

          {owner === 'personal' && <PinflFields pinfl={pinfl} onChange={setPinfl} />}

          {owner && (
            <AgreementNote
              personal={owner === 'personal'}
              when="При каждом пополнении с этой карты"
              payer="владельцем карты"
            />
          )}

          <button
            disabled={!valid}
            onClick={save}
            className="mt-2 rounded-lg bg-Smart-blue py-3 text-base font-semibold text-white transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Сохранить
          </button>
        </div>
      </div>
    </div>
  )
}
