'use client'

import Link from 'next/link'
import { useState } from 'react'

import type { Category } from '@/payload-types'
import { MediaImage } from './MediaImage'
import { ArrowIcon } from './icons'

type CatWithCount = Category & { productCount: number }

export function CollectionIndex({ categories }: { categories: CatWithCount[] }) {
  const [active, setActive] = useState(0)
  if (categories.length === 0) return null
  const activeCat = categories[active] ?? categories[0]

  return (
    <section className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Koleksiyon</p>
          <h2 className="mt-2 font-serif text-3xl font-bold text-petrol sm:text-4xl md:text-5xl">
            Ürün Grupları
          </h2>
        </div>
        <span className="code hidden text-sm text-muted sm:block">
          {String(categories.length).padStart(2, '0')} grup
        </span>
      </div>

      <div className="mt-12 grid gap-10 md:grid-cols-[1.1fr_0.9fr] md:gap-16">
        {/* İndeks */}
        <ol className="border-t border-line">
          {categories.map((c, i) => {
            const isActive = i === active
            return (
              <li key={c.id} className="border-b border-line">
                <Link
                  href={`/kategori/${c.slug}`}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  className="group flex items-center gap-4 py-5 transition-colors sm:gap-6"
                >
                  <span
                    className={`code text-sm transition-colors ${
                      isActive ? 'text-gold' : 'text-muted'
                    }`}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span
                    aria-hidden="true"
                    className={`h-2 w-2 rotate-45 border transition-all ${
                      isActive ? 'border-gold bg-gold' : 'border-line'
                    }`}
                  />
                  <span
                    className={`flex-1 font-serif text-xl font-semibold transition-colors sm:text-2xl ${
                      isActive ? 'text-gold-deep' : 'text-petrol'
                    }`}
                  >
                    {c.name}
                  </span>
                  <span className="code text-xs text-muted">{c.productCount} ürün</span>
                  <ArrowIcon
                    className={`h-4 w-4 text-gold transition-all ${
                      isActive ? 'translate-x-0 opacity-100' : '-translate-x-1 opacity-0'
                    }`}
                  />
                </Link>
              </li>
            )
          })}
        </ol>

        {/* Büyük görsel paneli (masaüstü) */}
        <div className="relative hidden md:block">
          <div className="sticky top-28 overflow-hidden rounded-2xl border border-line bg-paper shadow-card">
            <div className="relative aspect-[4/5]">
              <MediaImage
                key={activeCat.id}
                media={activeCat.image}
                size="large"
                alt={activeCat.name}
                className="animate-fade-up object-cover"
                sizes="(max-width: 1024px) 50vw, 480px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-petrol-deep/85 via-petrol-deep/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-6">
                <div>
                  <p className="code text-xs text-gold">
                    {String(active + 1).padStart(2, '0')} / {String(categories.length).padStart(2, '0')}
                  </p>
                  <p className="mt-1 font-serif text-2xl font-bold text-white">{activeCat.name}</p>
                </div>
                <Link
                  href={`/kategori/${activeCat.slug}`}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/50 text-white transition hover:border-gold hover:bg-gold"
                  aria-label={`${activeCat.name} kategorisine git`}
                >
                  <ArrowIcon className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
