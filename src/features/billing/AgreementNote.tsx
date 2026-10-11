import { Building2, FileSignature, Info } from 'lucide-react'
import { company } from '@/data/billing'

/**
 * What paying implies, spelled out before the money moves. Company money needs
 * no paperwork. Personal money paid for a company is covered by a multi-party
 * agreement, modelled on how Didox handles the same case: the document is
 * generated per payment, lands with both signers, and the money stays in
 * reserve until it is signed.
 */
export function AgreementNote({
  personal,
  when,
  payer,
}: {
  personal: boolean
  /** Lead-in for the first step: when the agreement gets created. */
  when: string
  /** The paying individual, in the instrumental case — it follows «между … и». */
  payer: string
}) {
  const invoiceLine = (
    <>
      Счёт-фактура за услуги выставляется на{' '}
      <b className="font-semibold">{company.name}</b> (ИНН {company.inn}).
    </>
  )

  if (!personal) {
    return (
      <div className="flex items-start gap-3 rounded-xl bg-blue-50 px-4 py-3">
        <Building2 className="mt-0.5 size-4 shrink-0 text-Smart-blue" />
        <div className="flex flex-col gap-1 text-sm text-slate-700">
          <span className="font-semibold text-slate-800">Средства компании</span>
          <span>
            Корпоративная карта привязана к ИНН компании, поэтому дополнительные документы не
            нужны — баланс пополняется сразу после оплаты.
          </span>
          <span>{invoiceLine}</span>
        </div>
      </div>
    )
  }

  const steps = [
    <>
      {when} мы сформируем <b className="font-semibold">многосторонний произвольный документ</b>{' '}
      — дополнительное соглашение на предоплату между Smartup24 Doc, {company.name} и{' '}
      {payer}.
    </>,
    <>
      Документ появится во «Входящих» у компании и в кабинете физического лица, чей ПИНФЛ указан
      при оплате.
    </>,
    <>
      Соглашение подписывают обе стороны — ключом ЭЦП или кодом из SMS.
    </>,
    <>
      Пока соглашение не подписано, средства находятся в резерве. После подписания они
      зачисляются на баланс компании.
    </>,
  ]

  return (
    <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-4">
      <div className="flex items-center gap-2">
        <FileSignature className="size-4 shrink-0 text-Smart-blue" />
        <span className="text-sm font-semibold text-slate-800">
          Оплата личными средствами за компанию
        </span>
      </div>

      <ol className="mt-3 flex flex-col gap-2.5">
        {steps.map((step, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
            <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-white text-xs font-semibold text-Smart-blue">
              {i + 1}
            </span>
            <span>{step}</span>
          </li>
        ))}
      </ol>

      <div className="mt-3 flex items-start gap-2 border-t border-blue-100 pt-3 text-sm text-slate-700">
        <Info className="mt-0.5 size-4 shrink-0 text-Smart-blue" />
        <span>{invoiceLine}</span>
      </div>
    </div>
  )
}
