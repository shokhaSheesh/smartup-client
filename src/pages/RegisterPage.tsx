import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthLayout } from '@/components/layout/AuthLayout'
import { LogoMark } from '@/components/brand/Logo'
import { SegmentedControl } from '@/components/ui/SegmentedControl'
import { Select } from '@/components/ui/Select'
import { Input } from '@/components/ui/Input'
import { Checkbox } from '@/components/ui/Checkbox'
import { Button } from '@/components/ui/Button'
import { mockEcpKeys } from '@/data/mockKeys'

type KeyType = 'ecp' | 'usb'

export default function RegisterPage() {
  const navigate = useNavigate()
  const [keyType, setKeyType] = useState<KeyType>('ecp')
  const [selectedKey, setSelectedKey] = useState<string>()
  const [phone, setPhone] = useState('')
  const [accepted, setAccepted] = useState(false)

  const canContinue = Boolean(selectedKey) && phone.trim().length > 0 && accepted

  function handleContinue() {
    if (!canContinue) return
    // Next step (OTP) — to be built.
    navigate('/register/otp')
  }

  return (
    <AuthLayout>
      <div className="inline-flex w-full max-w-[564px] flex-col items-center gap-11 overflow-hidden rounded-2xl bg-white px-6 pb-8 pt-10">
        {/* Glowing logo mark */}
        <LogoMark
          size={64}
          className="rounded-2xl shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25),0px_15px_50px_0px_rgba(1,146,201,0.34)]"
        />

        <div className="flex w-full max-w-[500px] flex-col items-center gap-8">
          <div className="flex flex-col items-center gap-2">
            <h1 className="text-center text-2xl font-semibold text-neutral-900">
              Создайте свой аккаунт
            </h1>
            <p className="text-lg font-medium leading-7 text-slate-800">
              Выберите ключ и заполните данные для регистрации
            </p>
          </div>

          <SegmentedControl<KeyType>
            value={keyType}
            onChange={setKeyType}
            options={[
              { value: 'ecp', label: 'ЭЦП' },
              { value: 'usb', label: 'USB Токен' },
            ]}
          />

          <div className="flex w-full flex-col items-center gap-5">
            <Select
              placeholder="Выберите ЭЦП ключ"
              options={mockEcpKeys}
              value={selectedKey}
              onChange={setSelectedKey}
            />

            <Input
              label="Телефон"
              type="tel"
              inputMode="tel"
              placeholder="Введите номер телефона"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            <Checkbox checked={accepted} onChange={setAccepted}>
              <span className="text-sm font-medium leading-5 text-slate-700">
                Я ознакомился и принимаю условия{' '}
              </span>
              <a href="#" className="text-sm font-medium leading-5 text-Smart-green underline">
                оферты
              </a>
            </Checkbox>

            <div className="flex w-full flex-col gap-4">
              <Button fullWidth disabled={!canContinue} onClick={handleContinue}>
                Продолжить
              </Button>
              <Button
                fullWidth
                hierarchy="secondary-gray"
                onClick={() => navigate('/login')}
              >
                У меня есть аккаунт
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AuthLayout>
  )
}
