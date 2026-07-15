import { useCallback, useEffect, useState } from 'react'

/** Counts down from `seconds` to 0. Returns remaining seconds + a restart fn. */
export function useCountdown(seconds: number) {
  const [remaining, setRemaining] = useState(seconds)

  useEffect(() => {
    if (remaining <= 0) return
    const id = setInterval(() => setRemaining((r) => Math.max(0, r - 1)), 1000)
    return () => clearInterval(id)
  }, [remaining])

  const restart = useCallback(() => setRemaining(seconds), [seconds])

  return { remaining, restart, isDone: remaining <= 0 }
}

/** Formats seconds as mm:ss. */
export function formatMmSs(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60)
  const s = totalSeconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}
