import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

const input =
  'w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-base text-slate-800 outline-none placeholder:text-gray-400 focus:border-Smart-blue'

export default function AddCardPage() {
  const navigate = useNavigate()
  const [number, setNumber] = useState('')
  const [mm, setMm] = useState('')
  const [yy, setYy] = useState('')

  function formatNumber(v: string) {
    const digits = v.replace(/\D/g, '').slice(0, 16)
    return digits.replace(/(.{4})/g, '$1 ').trim()
  }

  const valid = number.replace(/\s/g, '').length === 16 && mm.length === 2 && yy.length === 2

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
          <button
            disabled={!valid}
            onClick={() => navigate('/tariffs')}
            className="mt-2 rounded-lg bg-Smart-blue py-3 text-base font-semibold text-white transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Сохранить
          </button>
        </div>
      </div>
    </div>
  )
}
