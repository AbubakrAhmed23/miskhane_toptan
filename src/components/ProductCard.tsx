import Link from 'next/link'

import type { Product } from '@/payload-types'
import { firstProductImage } from '@/lib/media'
import { MediaImage } from './MediaImage'

export function ProductCard({ product }: { product: Product }) {
  const img = firstProductImage(product)
  const category = typeof product.category === 'object' ? product.category : null

  return (
    <Link
      href={`/urun/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-line bg-paper shadow-soft transition duration-300 hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="relative aspect-square overflow-hidden bg-white">
        <MediaImage
          media={img}
          size="card"
          className="object-contain p-5 transition duration-500 group-hover:scale-[1.04]"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 280px"
        />
      </div>
      <div className="flex flex-1 flex-col gap-1 border-t border-line p-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-gold">
          {product.code}
        </span>
        <h3 className="font-serif text-lg font-semibold leading-tight text-ink">{product.title}</h3>
        <div className="mt-auto flex flex-wrap items-center gap-x-2 gap-y-1 pt-2 text-xs text-muted">
          {product.capacityMl ? <span>{product.capacityMl} ml</span> : null}
          {product.capacityMl && category ? <span aria-hidden="true">·</span> : null}
          {category ? <span>{category.name}</span> : null}
        </div>
      </div>
    </Link>
  )
}
