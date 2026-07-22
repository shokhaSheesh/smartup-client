export type Branch = {
  id: number
  name: string
  region: string
  address: string
}

export const branches: Branch[] = [
  { id: 1, name: 'Филиал 1', region: 'Ташкент', address: 'Амир Темур 129Б' },
  { id: 2, name: 'Филиал 2', region: 'Ташкент', address: 'Амир Темур 129Б' },
  { id: 3, name: 'Филиал 3', region: 'Ташкент', address: 'Амир Темур 129Б' },
]

export type User = {
  id: number
  name: string
  role: string
}

export const users: User[] = [
  { id: 1, name: 'Muxlisa Xoliyorova', role: 'Пользователь' },
  { id: 2, name: 'Азизбек Баходиров', role: 'Админ' },
  { id: 3, name: 'Kristin Watson', role: 'Управляющий' },
]

/** Per-item permission flags, keyed by action key (e.g. 'read', 'sign'). */
export type PermFlags = Record<string, boolean>
export type RolePerms = {
  pages: Record<string, PermFlags>
  docTypes: Record<string, PermFlags>
}
export type Role = {
  id: number
  name: string
  users: string[]
  perms?: RolePerms
}

export const roles: Role[] = [
  { id: 1, name: 'Пользователь', users: ['Muxlisa Xoliyorova'] },
  { id: 2, name: 'Суперадмин', users: [] },
  { id: 3, name: 'Админ', users: [] },
  { id: 4, name: 'Управляющий', users: [] },
]

export type PermAction = { key: string; label: string }

/** Tab 1 — sidebar pages use CRUD. */
export const PAGE_ACTIONS: PermAction[] = [
  { key: 'create', label: 'Создание' },
  { key: 'read', label: 'Чтение' },
  { key: 'update', label: 'Изменение' },
  { key: 'delete', label: 'Удаление' },
]

/** Tab 2 — document types use lifecycle actions, not CRUD. */
export const DOC_ACTIONS: PermAction[] = [
  { key: 'view', label: 'Просмотр' },
  { key: 'create', label: 'Создание' },
  { key: 'sign', label: 'Подписание' },
  { key: 'reject', label: 'Отклонение' },
  { key: 'cancel', label: 'Отмена' },
]

/** Sidebar pages governed by role permissions (tab 1). */
export const permissionPages: string[] = [
  'Дашборд',
  'Документы: Входящие',
  'Документы: Исходящие',
  'Документы: Черновики',
  'Документы: Создать документ',
  'Документы: Импорт Excel',
  'Тарифы',
  'Товар и услуги',
  'Профиль',
]

/** Permissions shown in the role edit "Настройки" multi-select. */
export const permissions: string[] = [
  'Доступ к подписанию',
  'Доступ к отправке документа на согласование',
  'Доступ к отправке',
  'Доступ к подписанию и отправке',
  'Доступ к созданию документа',
  'Доступ к удалению документа',
  'Доступ к редактированию документа',
  'Доступ к чтению документа',
  'Доступ к созданию гибридного документа',
  'Доступ к созданию чека',
  'Доступ к удалению чека',
  'Доступ к чтению чека',
  'Доступ к согласованию',
  'Доступ к скачиванию архива документа',
  'Доступ к созданию счёта-фактуры',
  'Доступ к созданию акта на штрафные санкции',
  'Доступ к созданию ТТН',
  'Доступ к созданию счёта на оплату',
  'Доступ к импорту реестра ТТН',
  'Доступ к импорту реестра Гибридной почты',
  'Доступ к импорту реестра Е-омбор',
  'Доступ к импорту реестра Мониторинга счет-фактур',
  'Доступ к прикреплению',
  'Доступ к удалению прикрепления',
  'Доступ к просмотру счет-фактур и доверенностей отправленных доверенном лицу',
]

export const regions = ['Ташкент', 'Самарканд', 'Бухара', 'Андижан', 'Фергана', 'Наманган']
export const districts = ['Яккасарай', 'Мирзо-Улугбек', 'Чиланзар', 'Юнусабад', 'Шайхантахур']

export type LogEntry = {
  id: number
  date: string
  user: string
  action: string
  ip: string
}

export const logs: LogEntry[] = [
  { id: 1, date: '15.07.2026 10:24', user: 'Udevs MCHJ', action: 'Вход в систему', ip: '84.54.10.12' },
  { id: 2, date: '15.07.2026 10:31', user: 'Muxlisa Xoliyorova', action: 'Подписан документ №1221', ip: '84.54.10.44' },
  { id: 3, date: '14.07.2026 18:02', user: 'Udevs MCHJ', action: 'Создан документ (Счёт-фактура)', ip: '84.54.10.12' },
  { id: 4, date: '14.07.2026 12:47', user: 'Админ', action: 'Изменены реквизиты организации', ip: '84.54.10.30' },
  { id: 5, date: '13.07.2026 09:15', user: 'Udevs MCHJ', action: 'Пополнение баланса', ip: '84.54.10.12' },
]
