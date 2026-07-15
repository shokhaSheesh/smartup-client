import type { SavedCard } from '@/data/billing'

export function CardBrandIcon({ brand }: { brand: SavedCard['brand'] }) {
  switch (brand) {
    case 'mastercard':
      return (
        <span className="flex items-center">
          <span className="size-4 rounded-full bg-red-500" />
          <span className="-ml-1.5 size-4 rounded-full bg-amber-400/90" />
        </span>
      )
    case 'visa':
      return <span className="text-sm font-bold italic text-blue-700">VISA</span>
    case 'humo':
      return (
        <span className="flex size-6 items-center justify-center rounded bg-amber-100 text-[10px] font-bold text-amber-600">
          H
        </span>
      )
    case 'uzcard':
      return (
        <span className="flex size-6 items-center justify-center rounded bg-indigo-100 text-[10px] font-bold text-indigo-700">
          U
        </span>
      )
  }
}
