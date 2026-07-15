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

/** Catalog searched inside the "Добавить" modal. */
export const productCatalog: Product[] = [
  { id: 1001, code: '3536437434782475', name: 'Портландцемент BEKOBODSEMENT M-400 50кг', unit: 'Дона (1)', barcode: '3536437434782475' },
  { id: 1002, code: '1520030001000000', name: 'Кирпич керамический рядовой М-150', unit: 'Дона (1)', barcode: '1520030001000000' },
  { id: 1003, code: '2145070002000000', name: 'Арматура стальная A500C д.12мм', unit: 'Тонна (2)', barcode: '2145070002000000' },
  { id: 1004, code: '0987650003000000', name: 'Песок строительный мытый', unit: 'Куб.м (3)', barcode: '0987650003000000' },
  { id: 1005, code: '3344550004000000', name: 'Щебень гранитный фр. 5-20', unit: 'Куб.м (3)', barcode: '3344550004000000' },
  { id: 1006, code: '7788990005000000', name: 'Услуга по электронному документообороту (Didox.uz)', unit: 'Услуга (5)', barcode: '7788990005000000' },
  { id: 1007, code: '1122330006000000', name: 'Консультационные услуги (бухгалтерия)', unit: 'Услуга (5)', barcode: '1122330006000000' },
  { id: 1008, code: '5566770007000000', name: 'Краска водоэмульсионная белая 25кг', unit: 'Дона (1)', barcode: '5566770007000000' },
  { id: 1009, code: '9900110008000000', name: 'Профнастил оцинкованный С-8', unit: 'Кв.м (4)', barcode: '9900110008000000' },
  { id: 1010, code: '4455660009000000', name: 'Кабель ВВГ 3x2.5', unit: 'Метр (6)', barcode: '4455660009000000' },
  { id: 1011, code: '6677880010000000', name: 'Труба ПВХ канализационная д.110', unit: 'Метр (6)', barcode: '6677880010000000' },
  { id: 1012, code: '2233440011000000', name: 'Гипсокартон влагостойкий 12.5мм', unit: 'Лист (7)', barcode: '2233440011000000' },
]

