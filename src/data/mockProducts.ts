export type Product = {
  id: number
  code: string
  name: string
  unit: string
  barcode: string
}

const NAME = 'Портландцемент BEKOBODSEMENT сульфатга чидамли M-400 д-0 Когоз коп 50кг'
const UNIT =
  'Дона (1), kapsula=150 milligramm (256759), pachka=30 kapsula * 150 milligramm (262252), 1 dona (205319)'

function generate(): Product[] {
  const rows: Product[] = []
  for (let i = 1; i <= 42; i++) {
    const code = String(3536437434782475 - (i % 7) * 111).padStart(16, '0')
    rows.push({ id: i, code, name: NAME, unit: UNIT, barcode: code })
  }
  return rows
}

export const mockProducts: Product[] = generate()
