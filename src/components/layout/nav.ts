import type { LucideIcon } from 'lucide-react'
import {
  BarChart3,
  FileText,
  DollarSign,
  ShoppingBag,
  Headphones,
  User,
  LogOut,
} from 'lucide-react'

export type NavChild = { label: string; to: string }
export type NavItem = {
  label: string
  icon: LucideIcon
  to?: string
  children?: NavChild[]
}

export const mainNav: NavItem[] = [
  { label: 'Дашборд', icon: BarChart3, to: '/dashboard' },
  {
    label: 'Документы',
    icon: FileText,
    children: [
      { label: 'Входящие', to: '/documents/incoming' },
      { label: 'Исходящие', to: '/documents/outgoing' },
      { label: 'Черновики', to: '/documents/drafts' },
      { label: 'Создать документ', to: '/documents/create' },
      { label: 'Импорт Excel', to: '/documents/import' },
    ],
  },
  { label: 'Тарифы', icon: DollarSign, to: '/tariffs' },
  { label: 'Товар и услуги', icon: ShoppingBag, to: '/products' },
]

export const bottomNav: NavItem[] = [
  { label: 'Support', icon: Headphones, to: '/support' },
  { label: 'Профиль', icon: User, to: '/profile' },
  { label: 'Войти', icon: LogOut, to: '/login' },
]
