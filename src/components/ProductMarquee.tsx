'use client'

import Link from 'next/link'
import type { CSSProperties } from 'react'

import type { Category, Product } from '@/payload-types'
import { firstProductImage } from '@/lib/media'
import { MediaImage } from './MediaImage'

function categoryOf(product: Product): Category | null {
  return typeof product.category === 'object' ? product.category : null
}

export function ProductMarquee({
  products,
  durationSeconds = 45,
}: {
  products: Product[]
  durationSeconds?: number
}) {
  if (products.length === 0) return null

  const items = [...products, ...products]
  const style = { '--marquee-duration': `${durationSeconds}s` } as CSSProperties

  return (
    <div className="group relative overflow-hidden py-1">
      <div
        className="flex w-max animate-marquee gap-5 group-hover:[animation-play-state:paused]"
        style={style}
      >
        {items.map((product, i) => {
          const category = categoryOf(product)
          const href = category?.slug ? `/kategori/${category.slug}` : '/urunler'
          return (
            <Link
              key={`${product.id}-${i}`}
              href={href}
              aria-label={`${product.title} — ${category?.name ?? 'ürünler'} kategorisine git`}
              className="group/card relative w-44 shrink-0 overflow-hidden rounded-xl border border-line bg-panel shadow-panel transition hover:border-gold/50 sm:w-52"
            >
              <div className="relative aspect-square overflow-hidden bg-paper">
                <MediaImage
                  media={firstProductImage(product)}
                  size="card"
                  alt={product.title}
                  className="object-contain p-5 transition duration-500 group-hover/card:scale-105"
                  sizes="210px"
                />
                {category && (
                  <span className="absolute left-2 top-2 rounded-full bg-black/70 px-2.5 py-1 text-[0.65rem] font-medium text-gold-soft opacity-0 backdrop-blur transition group-hover/card:opacity-100">
                    {category.name}
                  </span>
                )}
              </div>
              <div className="border-t border-line px-3 py-2.5">
                <span className="text-[0.65rem] font-semibold uppercase tracking-wider text-gold">
                  {product.code}
                </span>
                <p className="truncate font-serif text-sm font-semibold text-cream">
                  {product.title}
                </p>
              </div>
            </Link>
          )
        })}
      </div>

      <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-night to-transparent sm:w-24" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-night to-transparent sm:w-24" />
    </div>
  )
}
