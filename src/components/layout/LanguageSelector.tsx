import { useState, useRef, useEffect } from 'react'
import { Globe, ChevronDown, Check } from 'lucide-react'
import { cn } from '@/lib/cn'

type Lang = {
  code: 'ru' | 'uz' | 'en'
  label: string
  flag: string
}

const LANGS: Lang[] = [
  { code: 'ru', label: 'Русский', flag: '🇷🇺' },
  { code: 'uz', label: 'Узбекский', flag: '🇺🇿' },
  { code: 'en', label: 'Английский', flag: '🇺🇸' },
]

export function LanguageSelector() {
  const [open, setOpen] = useState(false)
  const [current, setCurrent] = useState<Lang['code']>('ru')
  const ref = useRef<HTMLDivElement>(null)
  const active = LANGS.find((l) => l.code === current)!

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-white transition hover:bg-white/10"
      >
        <Globe className="size-4" />
        <span>{active.label}</span>
        <ChevronDown className={cn('size-4 transition', open && 'rotate-180')} />
      </button>

      {open && (
        <div className="absolute right-0 z-20 mt-2 w-56 overflow-hidden rounded-xl border border-gray-100 bg-white py-1 shadow-xl">
          {LANGS.map((lang) => (
            <button
              key={lang.code}
              type="button"
              onClick={() => {
                setCurrent(lang.code)
                setOpen(false)
              }}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm font-medium text-slate-700 hover:bg-gray-50"
            >
              <span className="text-base leading-none">{lang.flag}</span>
              <span className="flex-1">{lang.label}</span>
              {lang.code === current && <Check className="size-4 text-Smart-blue" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
