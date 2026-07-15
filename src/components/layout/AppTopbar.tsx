import { Wallet, ChevronDown, Bell, ChevronsRight, ChevronsLeft } from 'lucide-react'
import { cn } from '@/lib/cn'

type AppTopbarProps = {
  collapsed: boolean
  onToggleCollapse: () => void
}

function UzFlag() {
  return (
    <span className="flex size-6 flex-col overflow-hidden rounded-full ring-1 ring-black/5">
      <span className="flex-1 bg-sky-500" />
      <span className="h-px bg-rose-600" />
      <span className="flex-1 bg-white" />
      <span className="h-px bg-rose-600" />
      <span className="flex-1 bg-green-600" />
    </span>
  )
}

export function AppTopbar({ collapsed, onToggleCollapse }: AppTopbarProps) {
  return (
    <header className="flex h-14 items-center justify-between border-b border-slate-100 bg-white px-6">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onToggleCollapse}
          className="flex size-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-50"
          aria-label="Свернуть меню"
        >
          {collapsed ? (
            <ChevronsRight className="size-5" />
          ) : (
            <ChevronsLeft className="size-5" />
          )}
        </button>

        <div className="flex items-center gap-2">
          <Wallet className="size-5 text-Smart-blue" />
          <span className="text-xs">
            <span className="font-semibold text-slate-800">Баланс: </span>
            <span className="font-medium text-slate-600">100 сум</span>
          </span>
          <a href="#" className="text-xs font-medium text-Smart-green underline">
            Пополнить
          </a>
        </div>

        <div className="flex h-9 items-center rounded-lg bg-gray-50 px-3">
          <span className="text-xs">
            <span className="font-semibold text-slate-800">ИНН: </span>
            <span className="font-medium text-slate-600">397 308 543</span>
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="flex size-10 items-center justify-center rounded-full bg-slate-50">
          <UzFlag />
        </button>
        <button className="relative flex size-10 items-center justify-center rounded-full bg-slate-50">
          <Bell className="size-5 text-slate-600" />
          <span className="absolute right-2.5 top-2 size-1.5 rounded-full bg-red-500 ring-1 ring-white" />
        </button>

        <button
          className={cn(
            'flex items-center gap-3 rounded-lg border border-gray-200 px-3 py-1',
          )}
        >
          <span className="flex size-8 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white">
            U
          </span>
          <span className="flex flex-col items-start">
            <span className="text-sm font-medium text-slate-800">Udevs MCHJ</span>
            <span className="text-xs font-medium text-green-500">
              Плательщик НДС+ (активный)
            </span>
          </span>
          <ChevronDown className="size-5 text-gray-500" />
        </button>
      </div>
    </header>
  )
}
