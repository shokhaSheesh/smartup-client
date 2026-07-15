import { useState } from 'react'
import {
  Upload,
  Pencil,
  ChevronRight,
  ChevronDown,
  GripVertical,
  Plus,
  Trash2,
  Check,
  RefreshCw,
  Save,
} from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { PasswordInput } from '@/components/ui/PasswordInput'
import { passwordRules } from '@/lib/password'
import {
  branches as initialBranches,
  roles as initialRoles,
  users as initialUsers,
  permissions,
  regions,
  districts,
  logs,
} from '@/data/profile'
import type { Role, User } from '@/data/profile'
import { cn } from '@/lib/cn'

type Tab = 'personal' | 'branches' | 'requisites' | 'access' | 'users' | 'logs'
const TABS: { key: Tab; label: string }[] = [
  { key: 'personal', label: 'Данные компании' },
  { key: 'branches', label: 'Филиалы' },
  { key: 'requisites', label: 'Реквизиты' },
  { key: 'access', label: 'Доступы' },
  { key: 'users', label: 'Пользователи' },
  { key: 'logs', label: 'Журнал логов' },
]

const field =
  'w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-base text-slate-800 outline-none placeholder:text-gray-400 focus:border-Smart-blue'

/* ---------- Персональные данные ---------- */

function ChangePasswordModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Modal open={open} onClose={onClose} title="Change Password">
      <div className="flex flex-col gap-5 p-6">
        <div>
          <label className="mb-1.5 block text-base font-medium text-slate-800">
            New password <span className="text-red-500">*</span>
          </label>
          <PasswordInput placeholder="••••••••" />
        </div>
        <div>
          <label className="mb-1.5 block text-base font-medium text-slate-800">
            Confirm new password <span className="text-red-500">*</span>
          </label>
          <PasswordInput placeholder="••••••••" />
        </div>
        <ul className="flex flex-col gap-2">
          {passwordRules.map((r) => (
            <li key={r.label} className="flex items-start gap-2 text-sm text-gray-500">
              <span className="pt-0.5 leading-none">•</span>
              {r.label}
            </li>
          ))}
        </ul>
        <button onClick={onClose} className="rounded-lg bg-Smart-blue py-3 text-base font-semibold text-white hover:brightness-105">
          Сохранить
        </button>
      </div>
    </Modal>
  )
}

function EditFieldModal({
  target,
  onClose,
  onSave,
}: {
  target: { key: string; label: string; value: string } | null
  onClose: () => void
  onSave: (key: string, value: string) => void
}) {
  const [value, setValue] = useState('')
  const [lastKey, setLastKey] = useState<string | null>(null)
  if (target && target.key !== lastKey) {
    setLastKey(target.key)
    setValue(target.value)
  }
  return (
    <Modal open={Boolean(target)} onClose={onClose} title={target ? `Изменить: ${target.label}` : ''}>
      {target && (
        <div className="flex flex-col gap-5 p-6">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">{target.label}</label>
            <input autoFocus className={field} value={value} onChange={(e) => setValue(e.target.value)} />
          </div>
          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 rounded-lg border border-gray-200 py-3 text-sm font-semibold text-slate-700 hover:bg-gray-50">
              Отмена
            </button>
            <button
              disabled={!value.trim()}
              onClick={() => onSave(target.key, value.trim())}
              className="flex-1 rounded-lg bg-Smart-blue py-3 text-sm font-semibold text-white hover:brightness-105 disabled:opacity-50"
            >
              Сохранить
            </button>
          </div>
        </div>
      )}
    </Modal>
  )
}

function PersonalTab() {
  const [pwOpen, setPwOpen] = useState(false)
  const [values, setValues] = useState<Record<string, string>>({
    inn: '397 308 543',
    address: 'Ул. Олмазор, 2а',
    phone: '+998901234567',
    email: 'udevs@gmail.io',
  })
  const [editTarget, setEditTarget] = useState<{ key: string; label: string; value: string } | null>(null)

  const rows = [
    { key: 'inn', label: 'ИНН/ПИНФЛ', editable: false },
    { key: 'address', label: 'Адрес', editable: false },
    { key: 'phone', label: 'Номер', editable: true },
    { key: 'email', label: 'Электронная почта', editable: true },
  ]

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
      <div className="flex items-center gap-6">
        <div className="flex size-24 items-center justify-center rounded-full border border-gray-200 bg-white text-sm font-bold text-slate-700">
          udevs
        </div>
        <button className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-5 py-3 text-base font-semibold text-slate-700 hover:bg-gray-50">
          <Upload className="size-5" />
          Изменить фото
        </button>
      </div>

      {rows.map((r) => (
        <div key={r.key} className="flex items-center gap-6">
          <span className="w-32 shrink-0 text-base text-slate-700">{r.label}</span>
          <div
            className={cn(
              'flex flex-1 items-center rounded-xl border px-4 py-3 text-base',
              r.editable ? 'border-gray-200 bg-white text-slate-800' : 'border-gray-200 bg-gray-50 text-slate-500',
            )}
          >
            <span className="flex-1">{values[r.key]}</span>
            {r.editable && (
              <button
                onClick={() => setEditTarget({ key: r.key, label: r.label, value: values[r.key] })}
                className="text-slate-500 transition hover:text-Smart-blue"
                aria-label={`Изменить ${r.label}`}
              >
                <Pencil className="size-5" />
              </button>
            )}
          </div>
        </div>
      ))}

      <button
        onClick={() => setPwOpen(true)}
        className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-base text-slate-800 hover:bg-gray-50"
        style={{ marginLeft: '152px' }}
      >
        Change password
        <ChevronRight className="size-5 text-gray-400" />
      </button>

      <button className="rounded-xl bg-Smart-blue py-3.5 text-base font-semibold text-white hover:brightness-105" style={{ marginLeft: '152px' }}>
        Сохранить
      </button>

      <ChangePasswordModal open={pwOpen} onClose={() => setPwOpen(false)} />
      <EditFieldModal
        target={editTarget}
        onClose={() => setEditTarget(null)}
        onSave={(key, value) => {
          setValues((v) => ({ ...v, [key]: value }))
          setEditTarget(null)
        }}
      />
    </div>
  )
}

/* ---------- Филиалы ---------- */

function BranchesTab() {
  const [list, setList] = useState(initialBranches)
  const [form, setForm] = useState({ region: '', district: '', name: '', address: '' })
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [overIndex, setOverIndex] = useState<number | null>(null)

  function add() {
    if (!form.name && !form.region) return
    setList((l) => [
      ...l,
      { id: Math.max(0, ...l.map((b) => b.id)) + 1, name: form.name || `Филиал ${l.length + 1}`, region: form.region || 'Ташкент', address: form.address || '—' },
    ])
    setForm({ region: '', district: '', name: '', address: '' })
  }

  function drop(target: number) {
    if (dragIndex === null || dragIndex === target) {
      setDragIndex(null)
      setOverIndex(null)
      return
    }
    setList((l) => {
      const next = [...l]
      const [moved] = next.splice(dragIndex, 1)
      next.splice(target, 0, moved)
      return next
    })
    setDragIndex(null)
    setOverIndex(null)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Новый филиал</h2>
          <button onClick={add} className="flex items-center gap-2 rounded-lg bg-Smart-green px-5 py-2.5 text-base font-semibold text-white hover:brightness-105">
            <Plus className="size-5" /> Добавить
          </button>
        </div>
        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
          <Select placeholder="Область" options={regions} value={form.region} onChange={(v) => setForm((f) => ({ ...f, region: v }))} />
          <Select placeholder="Район" options={districts} value={form.district} onChange={(v) => setForm((f) => ({ ...f, district: v }))} />
          <input className={field} placeholder="Филиал" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
          <input className={field} placeholder="Адрес" value={form.address} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} />
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white">
        {list.map((b, i) => (
          <div
            key={b.id}
            draggable
            onDragStart={() => setDragIndex(i)}
            onDragOver={(e) => {
              e.preventDefault()
              setOverIndex(i)
            }}
            onDrop={() => drop(i)}
            onDragEnd={() => {
              setDragIndex(null)
              setOverIndex(null)
            }}
            className={cn(
              'flex items-center gap-4 px-6 py-4 transition',
              i > 0 && 'border-t border-gray-100',
              dragIndex === i && 'opacity-40',
              overIndex === i && dragIndex !== i && 'bg-sky-50',
            )}
          >
            <GripVertical className="size-5 shrink-0 cursor-grab text-gray-300 active:cursor-grabbing" />
            <span className="font-bold text-gray-900">{b.name}</span>
            <span className="text-slate-500">Область:{b.region}</span>
            <span className="flex-1 text-slate-500">Адрес:{b.address}</span>
            <button className="flex size-10 items-center justify-center rounded-lg border border-gray-200 text-Smart-blue hover:bg-gray-50">
              <Pencil className="size-4" />
            </button>
            <button onClick={() => setList((l) => l.filter((x) => x.id !== b.id))} className="flex size-10 items-center justify-center rounded-lg border border-gray-200 text-Smart-blue hover:bg-red-50 hover:text-red-500">
              <Trash2 className="size-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

/* Small inline select */
function Select({ placeholder, options, value, onChange }: { placeholder: string; options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="relative">
      <select value={value} onChange={(e) => onChange(e.target.value)} className={cn(field, 'appearance-none pr-10', !value && 'text-gray-400')}>
        <option value="">{placeholder}</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      <ChevronDown className="pointer-events-none absolute right-4 top-3.5 size-5 text-gray-400" />
    </div>
  )
}

/* ---------- Реквизиты ---------- */

function RequisitesTab() {
  const left = ['ИНН/ПИНФЛ', 'Наименование организации', 'Регистрационный код плательщика НДС', 'Адрес', 'Телефон', 'Основной Р/С|+', 'МФО|+', 'ОКЭД', 'Регион', 'Район']
  const right = ['Директор', 'ПИНФЛ директора', 'Главный бугалтер', 'Товар отпустил (ПИНФЛ)|+', 'Товар отпустил (ФИО)', 'НДС|v', 'Акцизный налог|v', 'Происхождения товара|v', 'Автоматичечкое заполнение СФ по ID договора']

  const renderField = (spec: string) => {
    const [label, kind] = spec.split('|')
    return (
      <div key={label} className="relative">
        <input className={field} placeholder={label} />
        {kind === '+' && (
          <button className="absolute right-2 top-2 flex size-8 items-center justify-center rounded-md bg-Smart-green text-white">
            <Plus className="size-5" />
          </button>
        )}
        {kind === 'v' && <ChevronDown className="pointer-events-none absolute right-4 top-3.5 size-5 text-gray-400" />}
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-2xl font-semibold text-gray-900">Реквизиты организации</h2>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 rounded-lg bg-Smart-green px-5 py-2.5 text-base font-semibold text-white hover:brightness-105">
            <RefreshCw className="size-5" /> Обновить с НК
          </button>
          <button className="flex items-center gap-2 rounded-lg bg-Smart-blue px-5 py-2.5 text-base font-semibold text-white hover:brightness-105">
            <Save className="size-5" /> Сохранить <ChevronDown className="size-4" />
          </button>
        </div>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="flex flex-col gap-4">{left.map(renderField)}</div>
        <div className="flex flex-col gap-4">{right.map(renderField)}</div>
      </div>
    </div>
  )
}

/* ---------- Доступы ---------- */

function RoleEditModal({ role, isNew, onClose, onSave }: { role: Role | null; isNew: boolean; onClose: () => void; onSave: (name: string) => void }) {
  const [name, setName] = useState('')
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<Set<string>>(new Set(['Доступ к подписанию']))

  return (
    <Modal open={Boolean(role)} onClose={onClose} title={isNew ? 'Новая роль' : 'Редактирование роли'}>
      {role && (
        <div className="flex flex-col gap-5 p-6">
          <div>
            <label className="mb-1.5 block text-base font-medium text-slate-800">Название</label>
            <input className={field} placeholder={role.name} value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label className="mb-1.5 block text-base font-medium text-slate-800">Настройки</label>
            <button onClick={() => setOpen((v) => !v)} className={cn(field, 'flex items-center justify-between text-left', selected.size === 0 && 'text-gray-400')}>
              {selected.size === 0 ? 'Выберите' : `Выбрано: ${selected.size}`}
              <ChevronDown className={cn('size-5 text-gray-400 transition', open && 'rotate-180')} />
            </button>
            {open && (
              <div className="mt-2 max-h-72 overflow-y-auto rounded-xl border border-gray-200">
                {permissions.map((p) => {
                  const on = selected.has(p)
                  return (
                    <button
                      key={p}
                      onClick={() => setSelected((s) => { const n = new Set(s); n.has(p) ? n.delete(p) : n.add(p); return n })}
                      className={cn('flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm', on ? 'bg-sky-50 text-Smart-blue' : 'text-slate-700 hover:bg-gray-50')}
                    >
                      <span className={cn('flex size-4 items-center justify-center rounded-sm border', on ? 'border-Smart-blue bg-Smart-blue text-white' : 'border-gray-300')}>
                        {on && <Check className="size-3" strokeWidth={3} />}
                      </span>
                      <span className="flex-1">{p}</span>
                    </button>
                  )
                })}
              </div>
            )}
          </div>
          <button
            disabled={isNew && !name.trim()}
            onClick={() => onSave(name || role.name)}
            className="rounded-lg bg-Smart-blue py-3 text-base font-semibold text-white hover:brightness-105 disabled:opacity-50"
          >
            Сохранить
          </button>
        </div>
      )}
    </Modal>
  )
}

function AccessTab() {
  const [list, setList] = useState(initialRoles)
  const [editing, setEditing] = useState<Role | null>(null)
  const [isNew, setIsNew] = useState(false)

  function openNew() {
    setIsNew(true)
    setEditing({ id: -Date.now(), name: '', users: [] })
  }
  function save(name: string) {
    if (isNew) {
      setList((l) => [...l, { id: Math.max(0, ...l.map((r) => r.id)) + 1, name, users: [] }])
    } else if (editing) {
      setList((l) => l.map((r) => (r.id === editing.id ? { ...r, name } : r)))
    }
    setEditing(null)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">Настройки</h2>
        <button onClick={openNew} className="flex items-center gap-2 rounded-lg bg-Smart-green px-5 py-2.5 text-base font-semibold text-white hover:brightness-105">
          <Plus className="size-5" /> Добавить
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
        <div className="grid grid-cols-[60px_1fr_120px] gap-4 border-b border-gray-200 px-6 py-4 text-base text-gray-500">
          <span>№</span><span>Роли</span><span />
        </div>
        {list.map((r, i) => (
          <div key={r.id} className={cn('grid grid-cols-[60px_1fr_120px] items-center gap-4 px-6 py-5', i > 0 && 'border-t border-gray-100')}>
            <span className="text-gray-900">{r.id}</span>
            <span className="text-gray-900">{r.name}</span>
            <div className="flex items-center justify-end gap-2">
              <button onClick={() => { setIsNew(false); setEditing(r) }} className="flex size-9 items-center justify-center rounded-lg text-slate-600 hover:bg-gray-50"><Pencil className="size-5" /></button>
              <button onClick={() => setList((l) => l.filter((x) => x.id !== r.id))} className="flex size-9 items-center justify-center rounded-lg text-slate-600 hover:bg-red-50 hover:text-red-500"><Trash2 className="size-5" /></button>
            </div>
          </div>
        ))}
      </div>

      <RoleEditModal role={editing} isNew={isNew} onClose={() => setEditing(null)} onSave={save} />
    </div>
  )
}

/* ---------- Пользователи ---------- */

function UserModal({
  user,
  isNew,
  onClose,
  onSave,
}: {
  user: User | null
  isNew: boolean
  onClose: () => void
  onSave: (u: Omit<User, 'id'>) => void
}) {
  const [form, setForm] = useState({ name: '', role: '', login: '', password: '' })
  // Reset the form when a different user opens.
  const [lastId, setLastId] = useState<number | null>(null)
  if (user && user.id !== lastId) {
    setLastId(user.id)
    setForm({ name: isNew ? '' : user.name, role: isNew ? '' : user.role, login: isNew ? '' : user.login, password: '' })
  }

  const valid = form.name.trim() && form.role && form.login.trim() && (!isNew || form.password.length >= 8)

  return (
    <Modal open={Boolean(user)} onClose={onClose} title={isNew ? 'Новый пользователь' : 'Редактирование пользователя'}>
      {user && (
        <div className="flex flex-col gap-4 p-6">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Имя</label>
            <input className={field} placeholder="Имя пользователя" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Роль</label>
            <Select placeholder="Выберите роль" options={initialRoles.map((r) => r.name)} value={form.role} onChange={(v) => setForm((f) => ({ ...f, role: v }))} />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Логин</label>
            <input className={field} placeholder="Логин" value={form.login} onChange={(e) => setForm((f) => ({ ...f, login: e.target.value }))} />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Пароль {isNew && <span className="text-red-500">*</span>}
            </label>
            <PasswordInput placeholder={isNew ? 'Введите пароль' : 'Оставьте пустым, чтобы не менять'} value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} />
          </div>
          <button
            disabled={!valid}
            onClick={() => onSave({ name: form.name, role: form.role, login: form.login })}
            className="mt-1 rounded-lg bg-Smart-blue py-3 text-base font-semibold text-white transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Сохранить
          </button>
        </div>
      )}
    </Modal>
  )
}

function UsersTab() {
  const [list, setList] = useState(initialUsers)
  const [editing, setEditing] = useState<User | null>(null)
  const [isNew, setIsNew] = useState(false)

  function openNew() {
    setIsNew(true)
    setEditing({ id: -Date.now(), name: '', role: '', login: '' })
  }
  function openEdit(u: User) {
    setIsNew(false)
    setEditing(u)
  }
  function save(data: Omit<User, 'id'>) {
    if (isNew) {
      setList((l) => [...l, { ...data, id: Math.max(0, ...l.map((x) => x.id)) + 1 }])
    } else if (editing) {
      setList((l) => l.map((x) => (x.id === editing.id ? { ...x, ...data } : x)))
    }
    setEditing(null)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">Пользователи</h2>
        <button onClick={openNew} className="flex items-center gap-2 rounded-lg bg-Smart-green px-5 py-2.5 text-base font-semibold text-white hover:brightness-105">
          <Plus className="size-5" /> Добавить
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
        <div className="grid grid-cols-[60px_1fr_1fr_1fr_120px] gap-4 border-b border-gray-200 px-6 py-4 text-base text-gray-500">
          <span>№</span><span>Имя</span><span>Роль</span><span>Логин</span><span />
        </div>
        {list.length === 0 && (
          <div className="px-6 py-10 text-center text-gray-400">Пользователи не добавлены</div>
        )}
        {list.map((u, i) => (
          <div key={u.id} className={cn('grid grid-cols-[60px_1fr_1fr_1fr_120px] items-center gap-4 px-6 py-5', i > 0 && 'border-t border-gray-100')}>
            <span className="text-gray-900">{i + 1}</span>
            <span className="text-gray-900">{u.name}</span>
            <span className="text-gray-900">{u.role}</span>
            <span className="text-gray-900">{u.login}</span>
            <div className="flex items-center justify-end gap-2">
              <button onClick={() => openEdit(u)} className="flex size-9 items-center justify-center rounded-lg text-slate-600 hover:bg-gray-50">
                <Pencil className="size-5" />
              </button>
              <button onClick={() => setList((l) => l.filter((x) => x.id !== u.id))} className="flex size-9 items-center justify-center rounded-lg text-slate-600 hover:bg-red-50 hover:text-red-500">
                <Trash2 className="size-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <UserModal user={editing} isNew={isNew} onClose={() => setEditing(null)} onSave={save} />
    </div>
  )
}

/* ---------- Журнал логов ---------- */

function LogsTab() {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 text-left text-xs font-medium text-gray-900">
            <th className="px-6 py-3">Дата</th>
            <th className="px-6 py-3">Пользователь</th>
            <th className="px-6 py-3">Действие</th>
            <th className="px-6 py-3">IP-адрес</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((l) => (
            <tr key={l.id} className="border-t border-gray-100">
              <td className="px-6 py-4 text-gray-900">{l.date}</td>
              <td className="px-6 py-4 text-gray-900">{l.user}</td>
              <td className="px-6 py-4 text-gray-900">{l.action}</td>
              <td className="px-6 py-4 text-gray-500">{l.ip}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function ProfilePage() {
  const [tab, setTab] = useState<Tab>('personal')
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2 border-b border-gray-200">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              'h-12 border-b-2 px-3.5 text-base font-medium transition',
              tab === t.key ? 'border-Smart-blue text-slate-800' : 'border-transparent text-gray-400 hover:text-slate-600',
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'personal' && <PersonalTab />}
      {tab === 'branches' && <BranchesTab />}
      {tab === 'requisites' && <RequisitesTab />}
      {tab === 'access' && <AccessTab />}
      {tab === 'users' && <UsersTab />}
      {tab === 'logs' && <LogsTab />}
    </div>
  )
}
