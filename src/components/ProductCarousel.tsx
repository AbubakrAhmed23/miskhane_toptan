'use client'

import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'

import type { Product } from '@/payload-types'
import { firstProductImage } from '@/lib/media'
import { displayCode, formatPrice } from '@/lib/format'
import { MediaImage } from './MediaImage'
import { ArrowIcon, ChevronLeftIcon, ChevronRightIcon } from './icons'

/**
 * (G) Ürün carousel — yatay kaydırmalı, ok kontrollü kart satırı.
 * Kart: görsel + rozet + kod/ad + fiyat + koli bilgisi + aksiyon butonu.
 */
export function ProductCarousel({
  products,
  title,
  eyebrow,
  href = '/urunler',
}: {
  products: Product[]
  title: string
  eyebrow?: string
  href?: string
}) {
  const rail = useRef<HTMLDivElement>(null)
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(false)

  const sync = useCallback(() => {
    const el = rail.current
    if (!el) return
    setAtStart(el.scrollLeft <= 4)
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4)
  }, [])

  useEffect(() => {
    sync()
    const el = rail.current
    if (!el) return
    el.addEventListener('scroll', sync, { passive: true })
    window.addEventListener('resize', sync)
    return () => {
      el.removeEventListener('scroll', sync)
      window.removeEventListener('resize', sync)
    }
  }, [sync])

  const scrollBy = (dir: 1 | -1) => {
    const el = rail.current
    if (!el) return
    // Bir "sayfa" kadar kaydır (görünen genişliğin %85'i)
    el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: 'smooth' })
  }

  if (!products.length) return null

  return (
    <section className="section-y bg-white">
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
            <h2 className="section-title mt-3 text-3xl text-espresso sm:text-4xl">{title}</h2>
          </div>
          <div className="flex items-center gap-4">
            <Link href={href} className="btn-link">
              Tümünü Gör
              <ArrowIcon className="h-4 w-4" />
            </Link>
            <div className="hidden items-center gap-2 sm:flex">
              <button
                type="button"
                onClick={() => scrollBy(-1)}
                disabled={atStart}
                aria-label="Önceki ürünler"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-espresso transition hover:border-espresso hover:text-accent-text disabled:opacity-30"
              >
                <ChevronLeftIcon className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => scrollBy(1)}
                disabled={atEnd}
                aria-label="Sonraki ürünler"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-espresso transition hover:border-espresso hover:text-accent-text disabled:opacity-30"
              >
                <ChevronRightIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div ref={rail} className="rail mt-10 pb-2">
          {products.map((product) => {
            const code = displayCode(product)
            const price = formatPrice(product.price, product.currency)
            return (
              <Link
                key={product.id}
                href={`/urun/${product.slug}`}
                className="card group flex w-[220px] flex-col overflow-hidden sm:w-[250px]"
              >
                <div className="relative aspect-square overflow-hidden rounded-t-2xl border-b border-border bg-white">
                  <MediaImage
                    media={firstProductImage(product)}
                    size="card"
                    alt={product.title}
                    className="object-contain p-6 transition-transform duration-500 ease-out group-hover:scale-[1.06]"
                    sizes="250px"
                  />
                  {product.featured ? (
                    <span className="pill-badge absolute left-3 top-3">Öne Çıkan</span>
                  ) : null}
                  {product.sizeLabel ? (
                    <span className="pill-badge pill-badge--ink absolute right-3 top-3">
                      {product.sizeLabel}
                    </span>
                  ) : null}
                </div>

                {/* Bilgi alanı — ürün ızgarasındaki kartla birebir aynı düzen */}
                <div className="flex flex-1 flex-col p-5">
                  {code ? (
                    <span className="code text-[0.7rem] font-semibold tracking-[0.12em] text-accent-text">
                      {code}
                    </span>
                  ) : null}
                  <h3 className="mt-1 font-serif text-lg leading-snug text-espresso">{product.title}</h3>
                  {price ? <p className="price mt-2 text-lg">{price}</p> : null}
                  {product.unitsPerBox ? (
                    <p className="mt-0.5 text-xs text-muted">Koli içi {product.unitsPerBox} adet</p>
                  ) : null}
                  {/* Ürün ızgarasındaki kartla AYNI aksiyon bileşeni (ok ikonlu link).
                      mt-auto: fiyat/koli satırı olmayan kartlarda da en altta hizalanır. */}
                  <span className="btn-link mt-auto pt-4">
                    İncele
                    <ArrowIcon className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
