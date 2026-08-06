import Link from 'next/link'

import type { Product } from '@/payload-types'
import { firstProductImage } from '@/lib/media'
import { displayCode, formatPrice } from '@/lib/format'
import { MediaImage } from './MediaImage'
import { ArrowIcon } from './icons'

/**
 * Ürün kartı — yumuşak gölgeli, yuvarlatılmış kart.
 * Kare görsel alanı (ızgara içinde oranlar tutarlı kalsın diye), üst köşede
 * rozet, altında kod + ad + fiyat + koli bilgisi ve bir aksiyon linki.
 */
export function ProductCard({ product }: { product: Product }) {
  const code = displayCode(product)
  const price = formatPrice(product.price, product.currency)

  return (
    <Link
      href={`/urun/${product.slug}`}
      className="card group flex h-full flex-col overflow-hidden"
    >
      <div className="relative aspect-square overflow-hidden rounded-t-2xl border-b border-clay/40 bg-white">
        <MediaImage
          media={firstProductImage(product)}
          size="card"
          alt={product.title}
          className="object-contain p-6 transition-transform duration-500 ease-out group-hover:scale-[1.06]"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 280px"
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

      <div className="flex flex-1 flex-col p-5">
        {code ? (
          <span className="code text-[0.7rem] font-semibold tracking-[0.12em] text-accent-text">
            {code}
          </span>
        ) : null}
        <h3 className="mt-1 font-serif text-lg leading-snug text-navy">{product.title}</h3>

        {price ? <p className="price mt-2 text-lg">{price}</p> : null}
        {product.unitsPerBox ? (
          <p className="mt-0.5 text-xs text-muted">Koli içi {product.unitsPerBox} adet</p>
        ) : null}

        <span className="btn-link mt-auto pt-4">
          İncele
          <ArrowIcon className="h-3.5 w-3.5" />
        </span>
      </div>
    </Link>
  )
}
