import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { AuthLayout } from '@/components/layout/AuthLayout'
import { LogoMark } from '@/components/brand/Logo'
import { OtpInput } from '@/components/ui/OtpInput'
import { Button } from '@/components/ui/Button'
import { useCountdown, formatMmSs } from '@/lib/useCountdown'

const OTP_LENGTH = 4
// In the real flow this comes from the previous step; mocked for the prototype.
const PHONE = '+998 90 123 45 67'

export default function OtpPage() {
  const navigate = useNavigate()
  const [code, setCode] = useState('')
  const { remaining, restart, isDone } = useCountdown(59)

  const canContinue = code.length === OTP_LENGTH

  function handleContinue() {
    if (!canContinue) return
    navigate('/register/credentials')
  }

  return (
    <AuthLayout>
      <div className="relative inline-flex w-full max-w-[564px] flex-col items-center gap-11 overflow-hidden rounded-2xl bg-white px-6 pb-8 pt-10">
        {/* Back button */}
        <Button
          hierarchy="secondary-gray"
          size="sm"
          leadingIcon={<ArrowLeft className="size-5" />}
          onClick={() => navigate(-1)}
          className="absolute left-6 top-6"
        >
          Назад
        </Button>

        <LogoMark
          size={64}
          className="rounded-2xl shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25),0px_15px_50px_0px_rgba(1,146,201,0.34)]"
        />

        <div className="flex w-full max-w-[500px] flex-col items-center gap-8">
          <div className="flex flex-col items-center gap-3">
            <h1 className="text-center text-3xl font-semibold leading-9 text-gray-900">
              Код подтверждения
            </h1>
            <p className="text-center text-base font-medium leading-6 text-gray-900">
              Отправили код на номер {PHONE}
            </p>
          </div>

          <div className="flex w-full flex-col items-center gap-8">
            <OtpInput length={OTP_LENGTH} value={code} onChange={setCode} />

            <div className="flex h-12 w-full items-center justify-center text-center text-base font-semibold leading-6">
              {isDone ? (
                <button
                  type="button"
                  onClick={restart}
                  className="text-Smart-green hover:underline"
                >
                  Отправить код повторно
                </button>
              ) : (
                <p>
                  <span className="text-slate-600">Отправить код повторно через </span>
                  <span className="text-Smart-green">{formatMmSs(remaining)}</span>
                </p>
              )}
            </div>

            <Button fullWidth disabled={!canContinue} onClick={handleContinue}>
              Продолжить
            </Button>
          </div>
        </div>
      </div>
    </AuthLayout>
  )
}
