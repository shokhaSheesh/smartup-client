import { useRef } from 'react'
import type { ClipboardEvent, KeyboardEvent } from 'react'
import { cn } from '@/lib/cn'

type OtpInputProps = {
  length?: number
  value: string
  onChange: (value: string) => void
}

export function OtpInput({ length = 4, value, onChange }: OtpInputProps) {
  const refs = useRef<Array<HTMLInputElement | null>>([])

  function setDigit(index: number, digit: string) {
    const chars = value.split('')
    chars[index] = digit
    // pad to keep positions stable
    const next = Array.from({ length }, (_, i) => chars[i] ?? '').join('')
    onChange(next.replace(/\s/g, ''))
  }

  function handleChange(index: number, raw: string) {
    const digit = raw.replace(/\D/g, '').slice(-1)
    if (!digit) {
      setDigit(index, '')
      return
    }
    setDigit(index, digit)
    if (index < length - 1) refs.current[index + 1]?.focus()
  }

  function handleKeyDown(index: number, e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      refs.current[index - 1]?.focus()
    }
    if (e.key === 'ArrowLeft' && index > 0) refs.current[index - 1]?.focus()
    if (e.key === 'ArrowRight' && index < length - 1) refs.current[index + 1]?.focus()
  }

  function handlePaste(e: ClipboardEvent<HTMLInputElement>) {
    e.preventDefault()
    const digits = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length)
    if (!digits) return
    onChange(digits.padEnd(length, '').trimEnd())
    const focusIndex = Math.min(digits.length, length - 1)
    refs.current[focusIndex]?.focus()
  }

  return (
    <div className="flex items-center gap-2">
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el
          }}
          type="text"
          inputMode="numeric"
          autoComplete={i === 0 ? 'one-time-code' : 'off'}
          maxLength={1}
          placeholder="0"
          value={value[i] ?? ''}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          className={cn(
            'size-16 rounded-lg bg-white text-center text-5xl font-normal leading-[60px] text-gray-900 shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] outline outline-1 outline-offset-[-1px] outline-gray-300 transition',
            'placeholder:text-gray-300 focus:outline-2 focus:outline-Smart-blue',
          )}
        />
      ))}
    </div>
  )
}
