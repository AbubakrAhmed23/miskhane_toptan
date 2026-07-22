import type { Media, Product } from '@/payload-types'

export type SizeKey = 'thumbnail' | 'card' | 'large'

// Verilen boyut için en uygun görsel URL'sini döndürür (yoksa orijinale düşer).
export function mediaUrl(media: number | Media | null | undefined, size?: SizeKey): string | null {
  if (!media || typeof media === 'number') return null
  if (size) {
    const sized = media.sizes?.[size]?.url
    if (sized) return sized
  }
  return media.url ?? null
}

export function mediaAlt(media: number | Media | null | undefined, fallback = ''): string {
  if (!media || typeof media === 'number') return fallback
  return media.alt || fallback
}

// Bir ürünün ilk (kapak) görselini döndürür.
export function firstProductImage(product: Product): number | Media | null {
  const img = product.images?.[0]?.image
  return img ?? null
}
