import type { SelectOption } from '@/components/ui/Select'

/** Mock E-IMZO (ЭЦП) keys as would be read from the user's device. */
export const mockEcpKeys: SelectOption[] = [
  { value: 'key-1', label: 'ООО "SMARTUP TECH" — ИНН 305512345' },
  { value: 'key-2', label: 'АЛИЕВ ЖАСУР — ПИНФЛ 31804901234567' },
  { value: 'key-3', label: 'ООО "DIGITAL DOCS" — ИНН 306789012' },
]

/** Mock USB tokens plugged into the user's device. */
export const mockUsbTokens: SelectOption[] = [
  { value: 'usb-1', label: 'USB Token — ООО "SMARTUP TECH"' },
  { value: 'usb-2', label: 'USB Token — АЛИЕВ ЖАСУР' },
]
