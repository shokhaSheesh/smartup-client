import { useRef, useState } from 'react'
import { FileText } from 'lucide-react'

const CARDS = [
  'Счета-фактуры',
  'ТТН (Новый)',
  'Гибридная счет-фактура',
  'Произвольный документ',
]

function ImportCard({ title, onFile }: { title: string; onFile: (name: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null)
  return (
    <div className="flex flex-col items-center gap-4 rounded-xl border border-gray-200 bg-white p-8 text-center">
      <div className="flex size-16 items-center justify-center rounded-full bg-gray-50">
        <FileText className="size-7 text-gray-400" strokeWidth={1.6} />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        <p className="mt-1 text-sm text-gray-400">Загрузите файл-Excel</p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept=".xls,.xlsx,.csv"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0]
          if (f) onFile(f.name)
          e.target.value = ''
        }}
      />
      <button
        onClick={() => inputRef.current?.click()}
        className="w-full rounded-lg bg-Smart-blue py-2.5 text-base font-semibold text-white transition hover:brightness-105"
      >
        Импортировать
      </button>
    </div>
  )
}

export default function ImportExcelPage() {
  const [toast, setToast] = useState<string | null>(null)

  function handleFile(card: string, name: string) {
    setToast(`«${card}»: файл «${name}» загружен`)
    setTimeout(() => setToast(null), 3000)
  }

  return (
    <div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {CARDS.map((title) => (
          <ImportCard key={title} title={title} onFile={(name) => handleFile(title, name)} />
        ))}
      </div>

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 rounded-lg bg-slate-800 px-4 py-3 text-sm font-medium text-white shadow-lg">
          {toast}
        </div>
      )}
    </div>
  )
}
