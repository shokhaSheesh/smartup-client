/** Generic placeholder for app sections whose designs haven't arrived yet. */
export default function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="flex h-full min-h-[60vh] flex-col items-center justify-center gap-2 text-center">
      <h1 className="text-2xl font-semibold text-slate-800">{title}</h1>
      <p className="text-slate-500">Раздел в разработке — ожидается дизайн.</p>
    </div>
  )
}
