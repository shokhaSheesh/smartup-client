import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthLayout } from '@/components/layout/AuthLayout'
import { LogoMark } from '@/components/brand/Logo'
import { SegmentedControl } from '@/components/ui/SegmentedControl'
import { Select } from '@/components/ui/Select'
import { Input } from '@/components/ui/Input'
import { PasswordInput } from '@/components/ui/PasswordInput'
import { Button } from '@/components/ui/Button'
import { mockEcpKeys, mockUsbTokens } from '@/data/mockKeys'

type LoginType = 'ecp' | 'password' | 'usb'

export default function LoginPage() {
  const navigate = useNavigate()
  const [loginType, setLoginType] = useState<LoginType>('ecp')

  const [ecpKey, setEcpKey] = useState<string>()
  const [usbToken, setUsbToken] = useState<string>()
  const [innPinfl, setInnPinfl] = useState('')
  const [password, setPassword] = useState('')

  const canContinue =
    loginType === 'ecp'
      ? Boolean(ecpKey)
      : loginType === 'usb'
        ? Boolean(usbToken)
        : innPinfl.trim().length > 0 && password.length > 0

  function handleContinue() {
    if (!canContinue) return
    navigate('/dashboard')
  }

  return (
    <AuthLayout>
      <div className="inline-flex w-full max-w-[564px] flex-col items-center gap-11 overflow-hidden rounded-2xl bg-white px-6 pb-8 pt-10">
        <LogoMark
          size={64}
          className="rounded-2xl shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25),0px_15px_50px_0px_rgba(1,146,201,0.34)]"
        />

        <div className="flex w-full max-w-[500px] flex-col items-center gap-8">
          <div className="flex flex-col items-center gap-2">
            <h1 className="text-center text-2xl font-semibold text-neutral-900">
              Войдите в свой аккаунт
            </h1>
            <p className="text-center text-lg font-medium leading-7 text-slate-800">
              Выберите тип входа и заполните необходимые данные для входа в аккаунт
            </p>
          </div>

          <SegmentedControl<LoginType>
            value={loginType}
            onChange={setLoginType}
            options={[
              { value: 'ecp', label: 'ЭЦП' },
              { value: 'password', label: 'По паролю' },
              { value: 'usb', label: 'USB Токен' },
            ]}
          />

          <div className="flex w-full flex-col items-center gap-5">
            {loginType === 'ecp' && (
              <Select
                placeholder="Выберите ЭЦП ключ"
                options={mockEcpKeys}
                value={ecpKey}
                onChange={setEcpKey}
              />
            )}

            {loginType === 'usb' && (
              <Select
                placeholder="Выберите USB токен"
                options={mockUsbTokens}
                value={usbToken}
                onChange={setUsbToken}
              />
            )}

            {loginType === 'password' && (
              <>
                <Input
                  placeholder="Введите ИНН или ПИНФЛ"
                  inputMode="numeric"
                  value={innPinfl}
                  onChange={(e) => setInnPinfl(e.target.value)}
                />
                <PasswordInput
                  placeholder="Введите пароль"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </>
            )}

            <div className="flex w-full flex-col gap-4">
              <Button fullWidth disabled={!canContinue} onClick={handleContinue}>
                Продолжить
              </Button>
              <Button
                fullWidth
                hierarchy="secondary-gray"
                onClick={() => navigate('/register')}
              >
                Создать аккаунт
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AuthLayout>
  )
}
