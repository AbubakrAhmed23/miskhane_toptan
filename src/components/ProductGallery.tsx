'use client'

import { useState } from 'react'

import type { Product } from '@/payload-types'
import { MediaImage } from './MediaImage'

export function ProductGallery({ product }: { product: Product }) {
  const images = (product.images ?? []).map((i) => i.image)
  const [active, setActive] = useState(0)

  if (images.length === 0) {
    return (
      <div className="relative aspect-square overflow-hidden rounded-xl border border-line bg-white">
        <MediaImage media={null} className="" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="relative aspect-square overflow-hidden rounded-xl border border-line bg-white">
        <MediaImage
          media={images[active]}
          size="large"
          alt={product.title}
          className="object-contain p-6"
          sizes="(max-width: 1024px) 100vw, 560px"
          priority
        />
      </div>
      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-3">
          {images.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`${i + 1}. görsel`}
              className={`relative aspect-square overflow-hidden rounded-lg border bg-white transition ${
                i === active ? 'border-gold ring-1 ring-gold' : 'border-line hover:border-gold-soft'
              }`}
            >
              <MediaImage media={img} size="thumbnail" className="object-contain p-1.5" sizes="80px" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
