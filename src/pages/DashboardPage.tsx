import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'

/** Placeholder — the real dashboard/app shell comes from later designs. */
export default function DashboardPage() {
  const navigate = useNavigate()
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50 text-slate-800">
      <h1 className="text-3xl font-semibold">Smartup24 Doc</h1>
      <p className="text-slate-500">Вы вошли в систему. Дашборд — в разработке.</p>
      <Button hierarchy="secondary-gray" onClick={() => navigate('/login')}>
        Выйти
      </Button>
    </div>
  )
}
