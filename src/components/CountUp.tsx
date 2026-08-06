'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Bölüm ekrana ilk girdiğinde 0'dan hedefe sayar (~1.2 sn).
 * Yalnızca ana istatistikte kullanılır — çok sayaç göz yorar.
 * Layout shift olmaması için kap `tabular-nums` ile sabit genişlikte tutulur.
 */
export function CountUp({ to, duration = 1200 }: { to: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [value, setValue] = useState(0)
  const done = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      setValue(to)
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting || done.current) continue
          done.current = true
          io.disconnect()
          const start = performance.now()
          const tick = (now: number) => {
            const p = Math.min(1, (now - start) / duration)
            // ease-out: hızlı başlar, yumuşak biter
            setValue(Math.round(to * (1 - Math.pow(1 - p, 3))))
            if (p < 1) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
        }
      },
      { threshold: 0.4 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [to, duration])

  return (
    <span ref={ref} className="tabular-nums">
      {value}
    </span>
  )
}
