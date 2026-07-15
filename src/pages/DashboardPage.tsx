import { useState } from 'react'
import { AlertTriangle, Plus, ChevronDown, Search } from 'lucide-react'
import { StatCards } from '@/features/dashboard/StatCards'
import { DocumentsTable } from '@/features/dashboard/DocumentsTable'
import { DocumentsBarChart } from '@/features/dashboard/DocumentsBarChart'
import { ProductsBarChart } from '@/features/dashboard/ProductsBarChart'
import { DonutCard } from '@/features/dashboard/DonutCard'
import { acceptedDonut, notAcceptedDonut } from '@/data/mockCharts'
import { cn } from '@/lib/cn'

const quickCreate = [
  'Счет-фактура без акта',
  'Счет-фактура (ФАРМ)',
  'Акт',
  'Доверенность',
  'Договор (ГНК)',
  'Акт сверки',
]

const tabs = ['Все документы', 'Входящий', 'Исходящий']
const filters = ['Дата', 'Счет-фактура (ФАРМ)', 'Статус']

function WarningBanner() {
  return (
    <div className="flex items-center gap-4 rounded-2xl bg-amber-50 p-4 shadow-[0px_4px_12px_0px_rgba(0,0,0,0.08)]">
      <div className="flex items-center justify-center rounded-3xl bg-amber-100 p-3">
        <AlertTriangle className="size-6 text-amber-400" />
      </div>
      <div className="flex flex-col gap-0.5">
        <h2 className="text-xl font-medium text-gray-900">Предупреждение</h2>
        <p className="text-base text-gray-500">
          У вас есть непроверенный <span className="font-medium text-Smart-blue">7 документ</span>.
          Пожалуйста, примите меры в течение 3 дней.
        </p>
      </div>
    </div>
  )
}

function QuickCreateBar() {
  return (
    <div className="flex flex-wrap gap-3">
      {quickCreate.map((label) => (
        <button
          key={label}
          className="flex h-10 items-center gap-2 rounded-2xl bg-gray-100 px-4 text-sm font-medium text-slate-800 transition hover:bg-gray-200"
        >
          <Plus className="size-5" />
          {label}
        </button>
      ))}
    </div>
  )
}

function Toolbar() {
  const [activeTab, setActiveTab] = useState(tabs[0])
  return (
    <div className="flex items-center justify-between gap-4 border-b border-gray-100 px-4 py-3">
      <div className="flex items-center gap-2.5">
        {tabs.map((tab) => {
          const active = tab === activeTab
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'flex h-10 items-center rounded-[32px] px-4 text-base font-medium transition',
                active
                  ? 'bg-Smart-blue text-white shadow-[1px_2px_12px_0px_rgba(0,0,0,0.12)]'
                  : 'bg-gray-50 text-Smart-blue hover:bg-gray-100',
              )}
            >
              {tab}
            </button>
          )
        })}
      </div>

      <div className="flex items-center gap-2.5">
        {filters.map((f) => (
          <button
            key={f}
            className="flex h-11 items-center gap-1 rounded-[46px] border border-gray-200 bg-gray-50 pl-4 pr-2.5 text-sm font-medium text-slate-700"
          >
            {f}
            <ChevronDown className="size-5 text-gray-500" />
          </button>
        ))}
        <div className="flex w-80 items-center gap-2 rounded-[46px] border border-gray-200 bg-white px-4 py-2.5 shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]">
          <Search className="size-5 text-gray-400" />
          <input
            placeholder="Поиск"
            className="flex-1 bg-transparent text-base text-gray-700 outline-none placeholder:text-gray-400"
          />
        </div>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-4">
      <WarningBanner />
      <QuickCreateBar />

      <div className="overflow-hidden rounded-md bg-white shadow-[0px_4px_12px_0px_rgba(0,0,0,0.08)]">
        <Toolbar />
        <div className="p-4">
          <StatCards />
        </div>
      </div>

      <DocumentsTable />
      <DocumentsBarChart />
      <ProductsBarChart />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <DonutCard title="Принятые документы" data={acceptedDonut} />
        <DonutCard
          title="Непринятые документы"
          data={notAcceptedDonut}
          hideFromLegend={['Прочие']}
        />
      </div>
    </div>
  )
}
