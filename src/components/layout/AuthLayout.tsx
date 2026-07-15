import type { ReactNode } from 'react'
import { ShieldCheck, Info, Phone } from 'lucide-react'
import wordmark from '@/assets/logo-wordmark.png'
import {
  InstagramIcon,
  LinkedinIcon,
  TelegramIcon,
  FacebookIcon,
} from '@/components/brand/SocialIcons'
import { LanguageSelector } from './LanguageSelector'

/** Faint scattered "document" cards evoking the EDM watermark texture. */
function WatermarkLayer() {
  const cards = [
    { top: '8%', left: '6%' },
    { top: '30%', left: '2%' },
    { top: '58%', left: '10%' },
    { top: '80%', left: '4%' },
    { top: '12%', left: '78%' },
    { top: '40%', left: '86%' },
    { top: '66%', left: '80%' },
    { top: '85%', left: '90%' },
    { top: '48%', left: '44%' },
  ]
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {cards.map((c, i) => (
        <div
          key={i}
          className="absolute w-40 rounded-md border border-white/20 bg-white/[0.03] p-2.5"
          style={{ top: c.top, left: c.left, transform: 'rotate(-28deg)' }}
        >
          <div className="mb-2 h-1.5 w-16 rounded-full bg-white/25" />
          <div className="space-y-1.5">
            <div className="h-1 w-full rounded-full bg-white/15" />
            <div className="h-1 w-11/12 rounded-full bg-white/15" />
            <div className="h-1 w-2/3 rounded-full bg-white/15" />
          </div>
        </div>
      ))}
    </div>
  )
}

/** L-shaped scanner-frame brackets in each corner. */
function CornerBrackets() {
  const base = 'pointer-events-none absolute size-8 border-white/70'
  return (
    <>
      <div className={`${base} left-4 top-4 rounded-tl-md border-l-2 border-t-2`} />
      <div className={`${base} right-4 top-4 rounded-tr-md border-r-2 border-t-2`} />
      <div className={`${base} bottom-4 left-4 rounded-bl-md border-b-2 border-l-2`} />
      <div className={`${base} bottom-4 right-4 rounded-br-md border-b-2 border-r-2`} />
    </>
  )
}

function FooterLink({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <a
      href="#"
      className="flex items-center gap-1.5 text-sm text-white/80 transition hover:text-white"
    >
      {icon}
      {children}
    </a>
  )
}

function SocialIcon({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <a
      href="#"
      aria-label={label}
      className="text-white/80 transition hover:text-white"
    >
      {icon}
    </a>
  )
}

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-[linear-gradient(135deg,#1e88b8_0%,#0f6690_38%,#0a4666_72%,#08324a_100%)]">
      <WatermarkLayer />
      <CornerBrackets />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-8 py-6">
        <img src={wordmark} alt="smartup" className="h-8 w-auto" />
        <LanguageSelector />
      </header>

      {/* Center content */}
      <main className="relative z-10 flex flex-1 items-center justify-center px-4 py-6">
        {children}
      </main>

      {/* Footer */}
      <footer className="relative z-10 flex items-center justify-between px-8 py-6">
        <div className="flex items-center gap-6">
          <FooterLink icon={<ShieldCheck className="size-4" />}>
            Публичная оферта
          </FooterLink>
          <FooterLink icon={<Info className="size-4" />}>О нас</FooterLink>
          <FooterLink icon={<Phone className="size-4" />}>Обратная связь</FooterLink>
        </div>
        <div className="flex items-center gap-4">
          <SocialIcon icon={<InstagramIcon className="size-5" />} label="Instagram" />
          <SocialIcon icon={<LinkedinIcon className="size-5" />} label="LinkedIn" />
          <SocialIcon icon={<TelegramIcon className="size-5" />} label="Telegram" />
          <SocialIcon icon={<FacebookIcon className="size-5" />} label="Facebook" />
        </div>
      </footer>
    </div>
  )
}
