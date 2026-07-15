export type PasswordRule = {
  label: string
  test: (pwd: string) => boolean
}

export const passwordRules: PasswordRule[] = [
  { label: 'Длина - от 8 символов', test: (p) => p.length >= 8 },
  {
    label: 'Используйте заглавную и строчную буквы',
    test: (p) => /[a-zа-я]/.test(p) && /[A-ZА-Я]/.test(p),
  },
  {
    label: 'Используйте цифру и спецсимвол (например, !@#$%)',
    test: (p) => /\d/.test(p) && /[^\wа-яё\s]/i.test(p),
  },
  {
    label: 'Не используйте личные данные и пробелы',
    test: (p) => p.length > 0 && !/\s/.test(p),
  },
]

export function isPasswordValid(pwd: string): boolean {
  return passwordRules.every((rule) => rule.test(pwd))
}
