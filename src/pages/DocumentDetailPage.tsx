import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Printer, Download, Link2, Check, X } from 'lucide-react'
import { mockDocuments } from '@/data/mockDocuments'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { downloadDocumentsCsv } from '@/lib/download'
import { directionLabel, formatDate } from '@/types/document'
import type { DocStatus } from '@/types/document'

function InvoiceDocument() {
  const cell = 'border border-gray-300 px-2 py-1 text-center align-middle'
  return (
    <div className="mx-auto max-w-3xl bg-white p-8 text-[11px] leading-tight text-gray-900">
      <div className="mb-2 border-b border-gray-400 pb-1 text-right text-[10px] text-gray-500">
        Страница 1 из 1
      </div>
      <div className="mb-4 text-[10px] text-gray-500">ID: 62c8c3589f752a7d5e966455</div>

      <div className="mb-4 text-center">
        <div className="text-base font-bold tracking-wide">СЧЁТ-ФАКТУРА</div>
        <div className="font-semibold">№ 06-73783</div>
        <div>от 30 июня 2022</div>
        <div>к договорам № Публичная оферта</div>
        <div>от 09 июля 2021</div>
      </div>

      {/* Parties */}
      <div className="grid grid-cols-2 gap-6">
        {[
          {
            role: 'Поставщик',
            name: 'OOO VENKON GROUP',
            addr: "Toshkent shahri, Yakkasaroy tumani, Sh.Rustaveli ko'chasi, 53b-uy",
            inn: '302936161',
            nds: '326040002521 (сертификат активный)',
            acc: '20208000800308125003',
            mfo: '00974',
          },
          {
            role: 'Покупатель',
            name: '4-SON QURILISH TRESTI',
            addr: 'Xodjayeva 2a',
            inn: '200523221',
            nds: '326030178001 (сертификат временно неактивный)',
            acc: '20210000100176992001',
            mfo: '00425',
          },
        ].map((p) => (
          <div key={p.role} className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1">
            <span className="text-right font-semibold">{p.role}:</span>
            <span className="font-semibold">{p.name}</span>
            <span className="text-right text-gray-600">Адрес:</span>
            <span>{p.addr}</span>
            <span className="text-right text-gray-600">ИНН:</span>
            <span>{p.inn}</span>
            <span className="text-right text-gray-600">Рег. код НДС:</span>
            <span>{p.nds}</span>
            <span className="text-right text-gray-600">Расчётный счёт:</span>
            <span>{p.acc}</span>
            <span className="text-right text-gray-600">МФО банка:</span>
            <span>{p.mfo}</span>
          </div>
        ))}
      </div>

      {/* VAT coefficient bars */}
      <div className="mt-4 grid grid-cols-2">
        <div className="bg-green-200 px-3 py-1.5 text-center text-[10px] font-semibold text-green-900">
          Коэффициент разрыва при уплате НДС (по всей цепочке): 0,00
        </div>
        <div className="bg-red-300 px-3 py-1.5 text-center text-[10px] font-semibold text-red-900">
          Коэффициент разрыва при уплате НДС (по всей цепочке): 1,00
        </div>
      </div>

      {/* Line items */}
      <table className="mt-4 w-full border-collapse text-[10px]">
        <thead>
          <tr>
            <th className={cell}>№</th>
            <th className={cell}>Примечание к товару (работе, услуге)</th>
            <th className={cell}>Идентификационный код и название по ЕНКТ</th>
            <th className={cell}>Единица измерения</th>
            <th className={cell}>Количество</th>
            <th className={cell}>Цена</th>
            <th className={cell}>Стоимость поставки</th>
            <th className={cell}>НДС ставка</th>
            <th className={cell}>НДС сумма</th>
            <th className={cell}>Стоимость с учётом НДС</th>
          </tr>
          <tr className="text-gray-500">
            {['x', '1', '2', '3', '4', '5', '6', '7', '8', '9'].map((n, i) => (
              <td key={i} className={cell}>{n}</td>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className={cell}>1</td>
            <td className={`${cell} text-left`}>
              Услуги по организации юридически значимого документооборота между организациями (Didox.uz)
            </td>
            <td className={`${cell} text-left`}>
              11201001003000000 - Услуга по электронному документообороту
            </td>
            <td className={cell}>штук</td>
            <td className={cell}>11,0000</td>
            <td className={cell}>0,00</td>
            <td className={cell}>0,00</td>
            <td className={cell}>Без НДС</td>
            <td className={cell}>—</td>
            <td className={cell}>0,00</td>
          </tr>
          <tr className="font-semibold">
            <td className={`${cell} text-right`} colSpan={6}>Итого:</td>
            <td className={cell}>0,00</td>
            <td className={cell}>x</td>
            <td className={cell}>x</td>
            <td className={cell}>0,00</td>
          </tr>
        </tbody>
      </table>
      <div className="mt-1 text-right text-[10px] font-semibold">
        Всего к оплате: Ноль сум 00 тийин
      </div>

      {/* Signatures */}
      <div className="mt-6 grid grid-cols-2 gap-6 text-[10px]">
        <div className="space-y-1">
          <div><span className="font-semibold">Руководитель:</span> Разикова И.Б.</div>
          <div><span className="font-semibold">Главный бухгалтер:</span> Исмаилов А. Б.</div>
          <div><span className="font-semibold">Товар отпустил:</span></div>
        </div>
        <div className="space-y-1">
          <div><span className="font-semibold">Руководитель:</span> RAXIMBEKOV RUSTAMBEK RAXMANBEKOVICH</div>
          <div><span className="font-semibold">Главный бухгалтер:</span> RAXIMBEKOV RUSTAMBEK RAXMANBEKOVICH</div>
        </div>
      </div>
    </div>
  )
}

export default function DocumentDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const doc = mockDocuments.find((d) => d.id === Number(id))
  const [status, setStatus] = useState<DocStatus | undefined>(doc?.status)

  if (!doc) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-2">
        <h1 className="text-2xl font-semibold text-slate-800">Документ не найден</h1>
        <button onClick={() => navigate(-1)} className="text-Smart-blue">
          Назад
        </button>
      </div>
    )
  }

  const section = directionLabel[doc.direction] === 'Входящий' ? 'Входящие' : 'Исходящие'
  const title = `Счёт фактура: ${doc.number} от ${formatDate(doc.date)}`

  return (
    <div className="flex flex-col gap-4">
      {/* Breadcrumb */}
      <div className="flex items-center gap-3 text-base">
        <button onClick={() => navigate(-1)} aria-label="Назад">
          <ArrowLeft className="size-5 text-slate-700" />
        </button>
        <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-slate-600">
          {section}
        </button>
        <span className="text-gray-300">/</span>
        <span className="font-medium text-Smart-blue">{title}</span>
      </div>

      {/* Header card */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-[0px_1px_2px_0px_rgba(16,24,40,0.06)]">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{title}</h1>
            <p className="mt-2 text-gray-400">{doc.date} 13:43:23</p>
          </div>
          <a href="#" className="flex items-center gap-2 font-medium text-Smart-blue">
            <Link2 className="size-5" />
            Статус документа в ГНК
          </a>
        </div>

        <div className="mt-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {status && <StatusBadge status={status} />}
            <button
              onClick={() => window.print()}
              className="flex size-11 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50"
              aria-label="Печать"
            >
              <Printer className="size-5" />
            </button>
            <button
              onClick={() => downloadDocumentsCsv([doc])}
              className="flex size-11 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50"
              aria-label="Скачать"
            >
              <Download className="size-5" />
            </button>
          </div>

          {status === 'pending' && (
            <div className="flex items-center gap-3">
              <button
                onClick={() => setStatus('signed')}
                className="flex items-center gap-2 rounded-lg bg-Smart-green px-6 py-3 text-base font-semibold text-white transition hover:brightness-105"
              >
                <Check className="size-5" />
                Подписать
              </button>
              <button
                onClick={() => setStatus('canceled')}
                className="flex items-center gap-2 rounded-lg bg-red-500 px-6 py-3 text-base font-semibold text-white transition hover:brightness-105"
              >
                <X className="size-5" />
                Отказать
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Document preview */}
      <div className="rounded-xl border border-gray-200 bg-slate-50 p-6">
        <div className="rounded-md bg-white shadow-sm">
          <InvoiceDocument />
        </div>
      </div>
    </div>
  )
}
