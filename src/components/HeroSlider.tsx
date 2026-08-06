'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Hero kategori carousel'i.
 *
 * Görseller katalogdan (yenikatalog1.pdf) alınan kategori kapak sahneleridir;
 * hepsi 1:1 oranında dışa aktarıldığı için geçişte layout shift olmaz.
 * Sıra, sitedeki kategori sırasına sadıktır (rastgele değil).
 */
/**
 * Kareler siteyle tonal uyum için hafifçe derecelendirildi (doygunluk 0.82 +
 * sıcak tint). Çok renkli "gökkuşağı şişeler" karesi, palete aykırı durduğu
 * için carousel'den çıkarıldı; Parfüm Şişeleri'ni muted sahne temsil ediyor.
 */
const SLIDES = [
  { src: '/catalog/hero/1-parfum.webp', label: 'Parfüm Şişeleri', href: '/kategori/parfum-siseleri', alt: 'Siyah, altın ve şeffaf parfüm şişeleri' },
  { src: '/catalog/hero/3-esans.webp', label: 'Esans Şişeleri', href: '/kategori/esans-siseleri', alt: 'Altın işlemeli esans şişeleri' },
  { src: '/catalog/hero/4-kapaklar.webp', label: 'Kapaklar', href: '/kategori/kapaklar', alt: 'Zamak, ahşap ve metal parfüm kapakları' },
  { src: '/catalog/hero/5-kolonya.webp', label: 'Kolonyalar', href: '/kategori/kolonyalar', alt: 'Kolonya koleksiyonu' },
  { src: '/catalog/hero/6-odakoku.webp', label: 'Oda Kokuları', href: '/kategori/bambu-cubuklu-oda-kokulari', alt: 'Sprey ve bambu çubuklu oda kokuları' },
]

const INTERVAL = 5000 // her görsel 5 sn ekranda kalır
const FADE = 900 // crossfade süresi (ms)

export function HeroSlider() {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [reduced, setReduced] = useState(false)
  const timer = useRef<ReturnType<typeof setInterval> | null>(null)

  const stop = useCallback(() => {
    if (timer.current) {
      clearInterval(timer.current)
      timer.current = null
    }
  }, [])

  useEffect(() => {
    const mq = window.matchMedia?.('(prefers-reduced-motion: reduce)')
    const apply = () => setReduced(!!mq?.matches)
    apply()
    mq?.addEventListener('change', apply)
    return () => mq?.removeEventListener('change', apply)
  }, [])

  useEffect(() => {
    // Hareket azaltma tercihinde otomatik geçiş kapalı; sabit görsel gösterilir.
    if (reduced || paused) {
      stop()
      return
    }
    timer.current = setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), INTERVAL)
    return stop
  }, [reduced, paused, stop])

  const active = SLIDES[index]

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
    >
      {/* Sabit yükseklikli kap → geçişte layout shift olmaz */}
      <Link
        href={active.href}
        aria-label={`${active.label} kategorisine git`}
        className="relative block aspect-square w-full overflow-hidden rounded-2xl bg-white"
      >
        {SLIDES.map((slide, i) => (
          <Image
            key={slide.src}
            src={slide.src}
            alt={i === index ? slide.alt : ''}
            fill
            /* Tüm kareler baştan yüklenir → geçişte flash/boşluk olmaz */
            priority={i === 0}
            loading="eager"
            sizes="(max-width: 1024px) 100vw, 560px"
            className={`object-cover ${i === index && !reduced ? 'ken-burns' : ''}`}
            style={{
              opacity: i === index ? 1 : 0,
              transition: reduced ? 'none' : `opacity ${FADE}ms ease-in-out`,
            }}
            aria-hidden={i === index ? undefined : true}
          />
        ))}

        {/* Kategori etiketi pili */}
        <span className="pointer-events-none absolute bottom-4 left-4 rounded-full bg-navy/85 px-4 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-cream">
          {active.label}
        </span>
      </Link>

      {/* Nokta göstergeleri — dokunma alanı 44x44px */}
      <div className="mt-3 flex justify-center gap-1">
        {SLIDES.map((slide, i) => (
          <button
            key={slide.src}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`${slide.label} görseline geç`}
            aria-current={i === index}
            className="group flex h-11 w-11 items-center justify-center"
          >
            <span
              className={`block h-1.5 rounded-full transition-all duration-300 ${
                i === index ? 'w-7 bg-amber' : 'w-1.5 bg-clay group-hover:bg-amber/60'
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  )
}
