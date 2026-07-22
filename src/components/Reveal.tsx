'use client'

import { type ElementType, type ReactNode, useEffect, useRef, useState } from 'react'

interface Props {
  children: ReactNode
  className?: string
  /** Kademeli (stagger) belirme için gecikme (ms) */
  delay?: number
  /** Sarmalayıcı etiket (varsayılan div) */
  as?: ElementType
}

export function Reveal({ children, className, delay = 0, as: Tag = 'div' }: Props) {
  const ref = useRef<HTMLElement | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Hareket azaltma tercihi varsa doğrudan göster.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <Tag
      ref={ref}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={`reveal ${visible ? 'is-visible' : ''} ${className ?? ''}`}
    >
      {children}
    </Tag>
  )
}
