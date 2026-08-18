'use client'

import { useState } from 'react'

import type { Product } from '@/payload-types'
import { MediaImage } from './MediaImage'

export function ProductGallery({ product }: { product: Product }) {
  const images = (product.images ?? []).map((i) => i.image)
  const [active, setActive] = useState(0)

  if (images.length === 0) {
    return <div className="relative aspect-square overflow-hidden rounded-2xl bg-white" />
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-white">
        {/*
          Boyut belirtilmez: Payload'daki ORİJİNAL dosya (yeniden kodlanmamış PNG)
          gösterilir. Ürün detayında kalite kaybı olmaması için bilinçli tercih.
        */}
        <MediaImage
          media={images[active]}
          size="original"
          alt={product.title}
          className="object-contain p-6"
          sizes="(max-width: 1024px) 100vw, 620px"
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
              className={`relative aspect-square overflow-hidden rounded-xl border bg-white transition ${
                i === active ? 'border-amber' : 'border-border hover:border-amber/60'
              }`}
            >
              <MediaImage
                media={img}
                size="thumbnail"
                className="object-contain p-1.5"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
