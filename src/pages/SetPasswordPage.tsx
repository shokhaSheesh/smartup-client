import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthLayout } from '@/components/layout/AuthLayout'
import { LogoMark } from '@/components/brand/Logo'
import { PasswordInput } from '@/components/ui/PasswordInput'
import { Button } from '@/components/ui/Button'
import { passwordRules, isPasswordValid } from '@/lib/password'
import { cn } from '@/lib/cn'

export default function SetPasswordPage() {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')

  const passwordsMatch = confirm.length > 0 && password === confirm
  const canContinue = isPasswordValid(password) && passwordsMatch

  function handleContinue() {
    if (!canContinue) return
    // Account created — send the user to login.
    navigate('/login')
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
              Установить пароль
            </h1>
            <p className="text-lg font-medium leading-7 text-slate-800">
              Установите пароль для входа в систему
            </p>
          </div>

          <div className="flex w-full flex-col items-start gap-1">
            <div className="flex w-full flex-col gap-5">
              <PasswordInput
                placeholder="Введите пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <PasswordInput
                placeholder="Потвердите пароль"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                destructive={confirm.length > 0 && !passwordsMatch}
                hint={
                  confirm.length > 0 && !passwordsMatch
                    ? 'Пароли не совпадают'
                    : undefined
                }
              />
            </div>

            <ul className="flex w-full flex-col">
              {passwordRules.map((rule) => {
                const passed = password.length > 0 && rule.test(password)
                return (
                  <li
                    key={rule.label}
                    className={cn(
                      'flex items-start gap-2 pt-3 text-xs font-normal leading-4',
                      passed ? 'text-Smart-green' : 'text-gray-500',
                    )}
                  >
                    <span className="pt-0.5 leading-none">•</span>
                    <span className="flex-1">{rule.label}</span>
                  </li>
                )
              })}
            </ul>
          </div>

          <Button fullWidth disabled={!canContinue} onClick={handleContinue}>
            Продолжить
          </Button>
        </div>
      </div>
    </AuthLayout>
  )
}
