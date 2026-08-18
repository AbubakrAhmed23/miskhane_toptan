'use client'

import Image from 'next/image'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'

import { ArrowIcon, WhatsAppIcon } from './icons'

/**
 * Hero carousel — referans tasarımdaki split düzen:
 * solda tam kadraj yuvarlatılmış görsel, sağda eyebrow + ince çizgi,
 * iri serif başlık, açıklama ve tek hap buton.
 * Kenarlarda dairesel oklar (lg+), altta pill biçimli aktif nokta.
 *
 * Tüm kareler DOM'da durur ve yalnızca opacity ile geçer; kareler aynı grid
 * hücresini paylaştığı için kap en uzun kareye göre ölçülenir → layout shift
 * oluşmaz. Pasif kareler `inert` ile klavye ve ekran okuyucudan çıkarılır.
 */

type Slide = {
  src: string
  alt: string
  eyebrow: string
  title: ReactNode
  body: string
  cta: { label: string; href: string }
  /** İlk kare markanın kendisidir: sayfanın tek <h1>'i ve WhatsApp eylemi ondadır. */
  brand?: boolean
}

const INTERVAL = 6000
const FADE_OUT = 260 // çıkan kare
const FADE_IN = 380 // gelen kare (FADE_OUT kadar gecikmeyle başlar)

export function HeroCarousel({ waHref, heroSubtitle }: { waHref: string; heroSubtitle?: string }) {
  const SLIDES: Slide[] = [
    {
      src: '/catalog/hero/1-parfum.webp',
      alt: 'Renkli cam parfüm şişeleri ve altın kapaklar',
      eyebrow: 'Miskhane Perfumes · Toptan',
      title: (
        <>
          Parfüm ambalajında <span className="gold-text">zarafet</span>
        </>
      ),
      body:
        heroSubtitle ||
        'Parfüm ve esans şişeleri, kapaklar, valfler, kolonyalar, oda kokuları ve buhurlar. Toptan fiyat ve numune için WhatsApp üzerinden bize ulaşın.',
      cta: { label: 'WhatsApp ile Teklif Al', href: waHref },
      brand: true,
    },
    {
      src: '/catalog/hero/3-esans.webp',
      alt: 'Altın işlemeli esans şişeleri',
      eyebrow: 'Esans Koleksiyonu',
      title: 'Esans Şişelerini Keşfet',
      body:
        'İnce cam işçiliği ve altın detaylı kapaklarıyla esans şişeleri; küçük hacimlerden dolum boylarına kadar koli bazlı tedarik.',
      cta: { label: 'Esans Şişelerini İncele', href: '/kategori/esans-siseleri' },
    },
    {
      src: '/catalog/hero/4-kapaklar.webp',
      alt: 'Zamak, ahşap ve metal parfüm kapakları',
      eyebrow: 'Kapak & Aksesuar',
      title: 'Kapakları Keşfet',
      body:
        'Zamak, ahşap ve metal kapaklar. Şişenizin karakterini tamamlayan, elde ağırlığı hissedilen son dokunuş.',
      cta: { label: 'Kapakları İncele', href: '/kategori/kapaklar' },
    },
    {
      src: '/catalog/hero/5-kolonya.webp',
      alt: 'Kolonya şişesi koleksiyonu',
      eyebrow: 'Kolonya Serisi',
      title: 'Kolonyaları Keşfet',
      body:
        'Klasik ve modern formlarıyla kolonya şişeleri; markanızın rafta duruşunu belirleyen sade hatlar.',
      cta: { label: 'Kolonyaları İncele', href: '/kategori/kolonyalar' },
    },
    {
      src: '/catalog/hero/6-odakoku.webp',
      alt: 'Sprey ve bambu çubuklu oda kokuları',
      eyebrow: 'Mekân Kokuları',
      title: 'Oda Kokularını Keşfet',
      body:
        'Sprey ve bambu çubuklu oda kokusu şişeleri; mekâna kalıcı bir imza bırakan ambalaj çözümleri.',
      cta: { label: 'Oda Kokularını İncele', href: '/kategori/bambu-cubuklu-oda-kokulari' },
    },
  ]

  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [reduced, setReduced] = useState(false)
  const timer = useRef<ReturnType<typeof setInterval> | null>(null)
  const touchX = useRef<number | null>(null)

  const go = useCallback(
    (step: number) => setIndex((i) => (i + step + SLIDES.length) % SLIDES.length),
    [SLIDES.length],
  )

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
    // Hareket azaltma tercihinde otomatik geçiş kapalı; sabit kare gösterilir.
    if (reduced || paused) {
      stop()
      return
    }
    timer.current = setInterval(() => go(1), INTERVAL)
    return stop
  }, [reduced, paused, go, stop])

  // Dokunmatikte yatay kaydırma ile kare değiştirme
  const onTouchStart = (e: React.TouchEvent) => {
    setPaused(true)
    touchX.current = e.touches[0].clientX
  }
  const onTouchEnd = (e: React.TouchEvent) => {
    setPaused(false)
    if (touchX.current === null) return
    const dx = e.changedTouches[0].clientX - touchX.current
    if (Math.abs(dx) > 45) go(dx < 0 ? 1 : -1)
    touchX.current = null
  }

  return (
    <section className="bg-cream">
      <div
        className="section-y relative mx-auto w-full max-w-6xl px-5 sm:px-8"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        aria-roledescription="carousel"
        aria-label="Öne çıkan ürün grupları"
      >
        {/* Tüm kareler aynı grid hücresinde üst üste durur */}
        <div className="grid">
          {SLIDES.map((slide, i) => {
            const active = i === index
            const Title = slide.brand ? 'h1' : 'p'
            return (
              <div
                key={slide.src}
                className={`col-start-1 row-start-1 grid items-center gap-9 lg:grid-cols-2 lg:gap-14 ${
                  active ? '' : 'pointer-events-none'
                }`}
                style={{
                  opacity: active ? 1 : 0,
                  /* Kademeli geçiş: çıkan kare önce söner, gelen kare o bittikten
                     sonra açılır. Aynı anda iki karenin metni üst üste binmez. */
                  transition: reduced
                    ? 'none'
                    : active
                      ? `opacity ${FADE_IN}ms var(--ease-out) ${FADE_OUT}ms`
                      : `opacity ${FADE_OUT}ms var(--ease-out)`,
                }}
                inert={!active}
                aria-hidden={!active}
              >
                {/* Sol: tam kadraj, yuvarlatılmış görsel */}
                <div className="relative aspect-[5/4] w-full overflow-hidden rounded-[28px] bg-white">
                  <Image
                    src={slide.src}
                    alt={active ? slide.alt : ''}
                    fill
                    priority={i === 0}
                    loading="eager"
                    sizes="(max-width: 1024px) 100vw, 600px"
                    className="object-cover"
                  />
                </div>

                {/* Sağ: eyebrow + çizgi, başlık, açıklama, tek hap buton */}
                <div>
                  <div className="flex items-center gap-4">
                    <p className="eyebrow whitespace-nowrap">{slide.eyebrow}</p>
                    <span aria-hidden className="h-px w-16 flex-none bg-espresso/25" />
                  </div>

                  <Title className="section-title mt-6 text-4xl leading-[1.06] text-espresso sm:text-5xl lg:text-[3.4rem]">
                    {slide.title}
                  </Title>

                  <p className="mt-6 max-w-md text-base leading-[1.85] text-muted">{slide.body}</p>

                  <div className="mt-9">
                    {slide.brand ? (
                      <a
                        href={slide.cta.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-lg btn-gold"
                      >
                        <WhatsAppIcon className="h-5 w-5" />
                        {slide.cta.label}
                      </a>
                    ) : (
                      <Link href={slide.cta.href} className="btn btn-lg btn-white">
                        {slide.cta.label}
                        <ArrowIcon className="h-4 w-4" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Kenarlardaki dairesel oklar — masaüstünde görselin dikey ortasında */}
        {(['prev', 'next'] as const).map((dir) => (
          <button
            key={dir}
            type="button"
            onClick={() => go(dir === 'prev' ? -1 : 1)}
            aria-label={dir === 'prev' ? 'Önceki kare' : 'Sonraki kare'}
            className={`absolute top-1/2 hidden h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full bg-white text-espresso shadow-soft transition-colors duration-[--dur-fast] hover:bg-espresso hover:text-cream lg:flex ${
              dir === 'prev' ? 'left-0 -translate-x-1/2' : 'right-0 translate-x-1/2'
            }`}
          >
            <ArrowIcon className={`h-5 w-5 ${dir === 'prev' ? 'rotate-180' : ''}`} />
          </button>
        ))}

        {/* Nokta göstergeleri — dokunma alanı 44x44px */}
        <div className="mt-10 flex justify-center gap-1">
          {SLIDES.map((slide, i) => (
            <button
              key={slide.src}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`${i + 1}. kareye geç`}
              aria-current={i === index}
              className="group flex h-11 w-11 items-center justify-center"
            >
              <span
                className={`block h-2 rounded-full transition-all duration-[--dur-base] ${
                  i === index ? 'w-10 bg-espresso' : 'w-2 bg-espresso/20 group-hover:bg-espresso/40'
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
