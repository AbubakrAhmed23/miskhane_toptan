'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

import type { Category, Product } from '@/payload-types'
import { firstProductImage } from '@/lib/media'
import { MediaImage } from './MediaImage'

function categoryOf(product: Product): Category | null {
  return typeof product.category === 'object' ? product.category : null
}

export function ProductSlider({
  products,
  interval = 3000,
}: {
  products: Product[]
  interval?: number
}) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const count = products.length

  useEffect(() => {
    if (count <= 1 || paused) return
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % count)
    }, interval)
    return () => clearInterval(id)
  }, [count, interval, paused])

  if (count === 0) {
    return (
      <div className="relative aspect-[4/5] w-full max-w-md overflow-hidden rounded-2xl border border-gold/30 bg-paper" />
    )
  }

  return (
    <div
      className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-2xl border border-gold/30 bg-paper shadow-soft"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className="flex h-full transition-transform duration-700 ease-out motion-reduce:transition-none"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {products.map((product) => {
          const category = categoryOf(product)
          return (
            <Link
              key={product.id}
              href={`/urun/${product.slug}`}
              className="relative block h-full w-full shrink-0"
              aria-label={`${product.code} — ${product.title}`}
            >
              <MediaImage
                media={firstProductImage(product)}
                size="large"
                alt={product.title}
                className="object-contain p-8"
                sizes="(max-width: 768px) 90vw, 420px"
                priority
              />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-black/80 via-black/35 to-transparent p-5">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-gold">
                    {product.code}
                  </span>
                  <p className="font-serif text-lg font-semibold leading-tight text-white">
                    {product.title}
                  </p>
                  {category && <p className="text-xs text-white/70">{category.name}</p>}
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {count > 1 && (
        <div className="absolute bottom-4 right-4 flex gap-1.5">
          {products.map((product, i) => (
            <button
              key={product.id}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`${i + 1}. ürüne geç`}
              aria-current={i === index}
              className={`h-2 rounded-full transition-all ${
                i === index ? 'w-5 bg-gold' : 'w-2 bg-white/50 hover:bg-white'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
